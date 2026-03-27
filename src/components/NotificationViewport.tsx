import { useMemo } from 'react';
import { createPortal } from 'react-dom';
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

  if (typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <NotificationContainerGroup items={ordered} onDismiss={onDismiss} />,
    document.body,
  );
}
