import { useMemo } from 'react';
import type { NotificationRecord } from '../models/index.js';
import { NotificationContainerGroup } from './NotificationContainer.js';

export function NotificationViewport({
  items,
  onDismiss,
}: {
  items: NotificationRecord[];
  onDismiss: (id: string) => void;
}) {
  const ordered = useMemo(() => [...items].sort((a, b) => a.createdAt - b.createdAt), [items]);

  return <NotificationContainerGroup items={ordered} onDismiss={onDismiss} />;
}
