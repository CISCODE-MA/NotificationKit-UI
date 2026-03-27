import type { ReactNode } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading' | 'default';

export type NotificationPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type NotificationAnimationType = 'slide' | 'fade' | 'scale';

export type NotificationAnimation = {
  type: NotificationAnimationType;
  durationMs: number;
};

export type NotificationAction = {
  label: string;
  onClick: () => void;
};

export type NotificationContent = {
  title?: string;
  message?: string;
  body?: ReactNode;
};

export type NotificationIconNode = ReactNode;

export type NotificationOptions = {
  id?: string;
  type?: NotificationType;
  position?: NotificationPosition;
  animation?: NotificationAnimation;
  autoDismiss?: boolean;
  durationMs?: number;
  pauseOnHover?: boolean;
  pauseOnFocus?: boolean;
  closeButton?: boolean;
  clearOnNavigate?: boolean;
  onClick?: () => void;
  actions?: NotificationAction[];
  icon?: NotificationIconNode | null;
  ariaRole?: 'status' | 'alert';
};

export type NotificationConfig = NotificationContent & NotificationOptions;

export type NotificationRecord = NotificationConfig & {
  id: string;
  type: NotificationType;
  position: NotificationPosition;
  animation: NotificationAnimation;
  autoDismiss: boolean;
  durationMs: number;
  pauseOnHover: boolean;
  pauseOnFocus: boolean;
  closeButton: boolean;
  clearOnNavigate: boolean;
  createdAt: number;
  state: 'visible' | 'dismissing';
};

export type NotificationUpdate = Partial<NotificationRecord> & { id: string };

export type NotificationHistoryItem = NotificationRecord & {
  dismissedAt: number;
};

export type NotificationProviderConfig = {
  maxVisible?: number;
  defaultType?: NotificationType;
  defaultPosition?: NotificationPosition;
  defaultAnimation?: NotificationAnimation;
  defaultAutoDismiss?: boolean;
  defaultDurationMs?: number;
  defaultPauseOnHover?: boolean;
  defaultPauseOnFocus?: boolean;
  defaultCloseButton?: boolean;
  defaultClearOnNavigate?: boolean;
  defaultAriaRole?: 'status' | 'alert';
  defaultIcon?: NotificationIconNode | null;
  historyLimit?: number;
};

export type NotificationStoreState = {
  notifications: NotificationRecord[];
  history: NotificationHistoryItem[];
};
