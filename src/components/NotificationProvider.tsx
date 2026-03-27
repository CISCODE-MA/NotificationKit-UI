import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  NotificationConfig,
  NotificationProviderConfig,
  NotificationRecord,
  NotificationStoreState,
  NotificationUpdate,
} from '../models/index.js';
import { NotificationContext } from '../context/NotificationContext.js';
import { NotificationStore } from '../store/index.js';
import { NotificationViewport } from './NotificationViewport.js';

export type NotificationProviderProps = {
  children: ReactNode;
  config?: NotificationProviderConfig;
  navigationKey?: string | number;
};

export function NotificationProvider({
  children,
  config,
  navigationKey,
}: NotificationProviderProps) {
  const [store] = useState<NotificationStore>(() => new NotificationStore(config));
  const [state, setState] = useState<NotificationStoreState>(() => store.getState());
  const navigationKeyRef = useRef(navigationKey);

  // Subscribe to store mutation events — this is the only correct way to react to external store changes
  useEffect(() => {
    return store.subscribe(() => {
      setState(store.getState());
    });
  }, [store]);

  // Propagate config changes to the store
  useEffect(() => {
    if (config) {
      store.setProviderConfig(config);
    }
  }, [config, store]);

  // Clear route-scoped notifications when navigation key changes
  useEffect(() => {
    if (navigationKey === undefined || navigationKey === navigationKeyRef.current) {
      navigationKeyRef.current = navigationKey;
      return;
    }
    navigationKeyRef.current = navigationKey;
    store.clearOnNavigate();
  }, [navigationKey, store]);

  const notify = useCallback(
    (input: NotificationConfig): NotificationRecord => {
      return store.add(input);
    },
    [store],
  );

  const withType = useCallback(
    (type: NotificationConfig['type']) =>
      (input: NotificationConfig): NotificationRecord =>
        notify({ ...input, type }),
    [notify],
  );

  const update = useCallback(
    (next: NotificationUpdate) => {
      store.update(next);
    },
    [store],
  );

  const dismiss = useCallback(
    (id: string) => {
      store.dismiss(id);
    },
    [store],
  );

  const clearAll = useCallback(() => {
    store.clearAll();
  }, [store]);

  const restore = useCallback(
    (id: string) => {
      store.restore(id);
    },
    [store],
  );

  const value = useMemo(
    () => ({
      state,
      config: store.getProviderConfig(),
      notify,
      success: withType('success'),
      error: withType('error'),
      warning: withType('warning'),
      info: withType('info'),
      loading: withType('loading'),
      defaultNotification: withType('default'),
      update,
      dismiss,
      clearAll,
      restore,
    }),
    [state, notify, update, dismiss, clearAll, restore, store, withType],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationViewport items={state.notifications} onDismiss={dismiss} />
    </NotificationContext.Provider>
  );
}
