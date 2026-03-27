import { createContext } from 'react';
import type {
  NotificationConfig,
  NotificationProviderConfig,
  NotificationRecord,
  NotificationStoreState,
  NotificationUpdate,
} from '../models/index.js';

export type NotificationContextValue = {
  state: NotificationStoreState;
  config: Required<NotificationProviderConfig>;
  notify: (config: NotificationConfig) => NotificationRecord;
  success: (config: NotificationConfig) => NotificationRecord;
  error: (config: NotificationConfig) => NotificationRecord;
  warning: (config: NotificationConfig) => NotificationRecord;
  info: (config: NotificationConfig) => NotificationRecord;
  loading: (config: NotificationConfig) => NotificationRecord;
  defaultNotification: (config: NotificationConfig) => NotificationRecord;
  update: (update: NotificationUpdate) => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
  restore: (id: string) => void;
};

export const NotificationContext = createContext<NotificationContextValue | null>(null);
