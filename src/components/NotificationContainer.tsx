import type { NotificationPosition, NotificationRecord } from '../models/index.js';
import { NotificationItem } from './NotificationItem.js';

export type NotificationContainerProps = {
  position: NotificationPosition;
  items: NotificationRecord[];
  onDismiss: (id: string) => void;
};

const positionClassMap: Record<NotificationPosition, string> = {
  'top-left': 'top-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'top-right': 'top-4 right-4 items-end',
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center',
  'bottom-left': 'bottom-4 left-4 items-start',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-right': 'bottom-4 right-4 items-end',
};

export function NotificationContainer({ position, items, onDismiss }: NotificationContainerProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div
      className={`pointer-events-none fixed z-70 flex w-full max-w-xs flex-col gap-3 px-4 sm:max-w-sm ${positionClassMap[position]}`}
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      aria-atomic="false"
    >
      {items.map((item) => (
        <NotificationItem key={item.id} item={item} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

export function NotificationContainerGroup({
  items,
  onDismiss,
}: {
  items: NotificationRecord[];
  onDismiss: (id: string) => void;
}) {
  const groups = items.reduce<Record<NotificationPosition, NotificationRecord[]>>(
    (acc, item) => {
      const list = acc[item.position] ?? [];
      list.push(item);
      acc[item.position] = list;
      return acc;
    },
    {
      'top-left': [],
      'top-center': [],
      'top-right': [],
      center: [],
      'bottom-left': [],
      'bottom-center': [],
      'bottom-right': [],
    },
  );

  return (
    <>
      {Object.entries(groups).map(([position, group]) => (
        <NotificationContainer
          key={position}
          position={position as NotificationPosition}
          items={group}
          onDismiss={onDismiss}
        />
      ))}
    </>
  );
}
