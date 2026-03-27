import type {
  NotificationConfig,
  NotificationHistoryItem,
  NotificationProviderConfig,
  NotificationRecord,
  NotificationStoreState,
  NotificationUpdate,
} from '../models/index.js';

const DEFAULT_ANIMATION = { type: 'slide', durationMs: 300 } as const;

const DEFAULT_PROVIDER_CONFIG: Required<NotificationProviderConfig> = {
  maxVisible: 5,
  defaultType: 'default',
  defaultPosition: 'top-right',
  defaultAnimation: DEFAULT_ANIMATION,
  defaultAutoDismiss: true,
  defaultDurationMs: 4000,
  defaultPauseOnHover: true,
  defaultPauseOnFocus: true,
  defaultCloseButton: true,
  defaultClearOnNavigate: false,
  defaultAriaRole: 'status',
  defaultIcon: null,
  historyLimit: 20,
};

let idCounter = 0;

function nextId() {
  idCounter += 1;
  return `nk_${Date.now()}_${idCounter}`;
}

function toRecord(
  config: NotificationConfig,
  provider: Required<NotificationProviderConfig>,
): NotificationRecord {
  const createdAt = Date.now();
  const id = config.id ?? nextId();
  const type = config.type ?? provider.defaultType;
  const position = config.position ?? provider.defaultPosition;
  const animation = config.animation ?? provider.defaultAnimation;
  const autoDismiss = config.autoDismiss ?? provider.defaultAutoDismiss;
  const durationMs = config.durationMs ?? provider.defaultDurationMs;
  const pauseOnHover = config.pauseOnHover ?? provider.defaultPauseOnHover;
  const pauseOnFocus = config.pauseOnFocus ?? provider.defaultPauseOnFocus;
  const closeButton = config.closeButton ?? provider.defaultCloseButton;
  const clearOnNavigate = config.clearOnNavigate ?? provider.defaultClearOnNavigate;
  const ariaRole = config.ariaRole ?? provider.defaultAriaRole;
  const icon = config.icon ?? provider.defaultIcon;

  return {
    ...config,
    id,
    type,
    position,
    animation,
    autoDismiss,
    durationMs,
    pauseOnHover,
    pauseOnFocus,
    closeButton,
    clearOnNavigate,
    ariaRole,
    icon,
    createdAt,
    state: 'visible',
  };
}

function pushHistory(
  history: NotificationHistoryItem[],
  item: NotificationRecord,
  limit: number,
): NotificationHistoryItem[] {
  const updated = [{ ...item, dismissedAt: Date.now() }, ...history];
  if (updated.length <= limit) {
    return updated;
  }
  return updated.slice(0, limit);
}

export class NotificationStore {
  private provider: Required<NotificationProviderConfig>;
  private state: NotificationStoreState;
  private listeners: Set<() => void> = new Set();

  constructor(providerConfig?: NotificationProviderConfig) {
    this.provider = { ...DEFAULT_PROVIDER_CONFIG, ...providerConfig };
    this.state = { notifications: [], history: [] };
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  getProviderConfig() {
    return this.provider;
  }

  getState() {
    return this.state;
  }

  setProviderConfig(nextConfig: NotificationProviderConfig) {
    this.provider = { ...this.provider, ...nextConfig };
    this.notify();
  }

  add(config: NotificationConfig) {
    const record = toRecord(config, this.provider);
    const notifications = [...this.state.notifications, record];
    const maxVisible = this.provider.maxVisible;
    const overflow =
      maxVisible > 0 && notifications.length > maxVisible ? notifications.length - maxVisible : 0;
    const dismissedByOverflow = overflow > 0 ? notifications.slice(0, overflow) : [];
    const trimmed = overflow > 0 ? notifications.slice(overflow) : notifications;

    const history = dismissedByOverflow.reduce<NotificationHistoryItem[]>(
      (acc, item) => pushHistory(acc, item, this.provider.historyLimit),
      this.state.history,
    );

    this.state = {
      notifications: trimmed,
      history,
    };

    this.notify();
    return record;
  }

  update(update: NotificationUpdate) {
    const notifications = this.state.notifications.map((item) =>
      item.id === update.id ? { ...item, ...update } : item,
    );

    this.state = {
      ...this.state,
      notifications,
    };
    this.notify();
  }

  dismiss(id: string) {
    const target = this.state.notifications.find((item) => item.id === id);
    if (!target) {
      return;
    }

    this.state = {
      notifications: this.state.notifications.filter((item) => item.id !== id),
      history: pushHistory(this.state.history, target, this.provider.historyLimit),
    };
    this.notify();
  }

  clearAll() {
    const history = this.state.notifications.reduce<NotificationHistoryItem[]>(
      (acc, item) => pushHistory(acc, item, this.provider.historyLimit),
      this.state.history,
    );

    this.state = {
      notifications: [],
      history,
    };
    this.notify();
  }

  clearOnNavigate() {
    const toKeep = this.state.notifications.filter((item) => !item.clearOnNavigate);
    const toDismiss = this.state.notifications.filter((item) => item.clearOnNavigate);

    const history = toDismiss.reduce<NotificationHistoryItem[]>(
      (acc, item) => pushHistory(acc, item, this.provider.historyLimit),
      this.state.history,
    );

    this.state = {
      notifications: toKeep,
      history,
    };
    this.notify();
  }

  restore(id: string) {
    const historyItem = this.state.history.find((item) => item.id === id);
    if (!historyItem) {
      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { dismissedAt: _dismissedAt, ...rest } = historyItem;
    this.add(rest);
    this.state = {
      ...this.state,
      history: this.state.history.filter((item) => item.id !== id),
    };
  }
}
