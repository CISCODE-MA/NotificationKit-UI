import type { MouseEvent } from 'react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { NotificationRecord } from '../models/index.js';
import { useLiveRegion } from '../hooks/useAccessibility.js';
import { NotificationActionList } from './NotificationActionList.js';
import { NotificationIcon } from './NotificationIcon.js';
import { NotificationProgress } from './NotificationProgress.js';

export type NotificationItemProps = {
  item: NotificationRecord;
  onDismiss: (id: string) => void;
};

const typeStyles: Record<NotificationRecord['type'], string> = {
  success:
    'border-emerald-500/40 bg-emerald-50 text-emerald-950 dark:bg-emerald-900/40 dark:text-emerald-50',
  error: 'border-rose-500/40 bg-rose-50 text-rose-950 dark:bg-rose-900/40 dark:text-rose-50',
  warning: 'border-amber-500/40 bg-amber-50 text-amber-950 dark:bg-amber-900/40 dark:text-amber-50',
  info: 'border-sky-500/40 bg-sky-50 text-sky-950 dark:bg-sky-900/40 dark:text-sky-50',
  loading: 'border-slate-500/40 bg-slate-50 text-slate-950 dark:bg-slate-900/40 dark:text-slate-50',
  default:
    'border-slate-200 bg-white text-slate-950 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-50',
};

export function NotificationItem({ item, onDismiss }: NotificationItemProps) {
  const [isPaused, setIsPaused] = useState(false);
  const [remaining, setRemaining] = useState(item.durationMs);
  const timerRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const itemRef = useRef<HTMLDivElement>(null);
  const descriptionId = useId();

  const canDismiss = item.autoDismiss && item.durationMs > 0;

  // Announce notification to screen readers
  const announcementText = [item.title, item.message].filter(Boolean).join(': ') || 'Notification';
  useLiveRegion(announcementText, item.ariaRole === 'alert' ? 'assertive' : 'polite');

  useEffect(() => {
    if (!canDismiss || isPaused) {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      return;
    }

    startRef.current = Date.now();
    timerRef.current = window.setTimeout(() => {
      onDismiss(item.id);
    }, remaining);

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, [canDismiss, isPaused, item.id, onDismiss, remaining]);

  const handlePause = () => {
    if (!canDismiss || !startRef.current) {
      return;
    }
    const elapsed = Date.now() - startRef.current;
    setRemaining((prev) => Math.max(prev - elapsed, 0));
    startRef.current = null;
    setIsPaused(true);
  };

  const handleResume = () => {
    if (!canDismiss) {
      return;
    }
    setIsPaused(false);
  };

  const handleClose = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onDismiss(item.id);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    // Escape key to dismiss
    if (event.key === 'Escape') {
      event.preventDefault();
      onDismiss(item.id);
    }
  };

  const handleClick = () => {
    item.onClick?.();
  };

  const shouldPauseOnHover = item.pauseOnHover && canDismiss;
  const shouldPauseOnFocus = item.pauseOnFocus && canDismiss;

  const animationClass = useMemo(() => {
    switch (item.animation.type) {
      case 'fade':
        return 'animate-notify-fade';
      case 'scale':
        return 'animate-notify-scale';
      default:
        return 'animate-notify-slide';
    }
  }, [item.animation.type]);

  return (
    <div
      ref={itemRef}
      className={`pointer-events-auto flex w-full flex-col gap-3 rounded-xl border px-4 py-3 shadow-lg transition ${typeStyles[item.type]} ${animationClass}`}
      role={item.ariaRole}
      aria-describedby={descriptionId}
      onClick={handleClick}
      onMouseEnter={shouldPauseOnHover ? handlePause : undefined}
      onMouseLeave={shouldPauseOnHover ? handleResume : undefined}
      onFocus={shouldPauseOnFocus ? handlePause : undefined}
      onBlur={shouldPauseOnFocus ? handleResume : undefined}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="flex items-start gap-3">
        <NotificationIcon item={item} />
        <div id={descriptionId} className="flex min-w-0 flex-1 flex-col gap-1">
          {item.title ? <p className="text-sm font-semibold">{item.title}</p> : null}
          {item.message ? (
            <p className="text-sm text-slate-600 dark:text-slate-200">{item.message}</p>
          ) : null}
          {item.body ? (
            <div className="text-sm text-slate-600 dark:text-slate-200">{item.body}</div>
          ) : null}
        </div>
        {item.closeButton ? (
          <button
            type="button"
            aria-label="Dismiss notification"
            className="text-slate-500 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
            onClick={handleClose}
          >
            ✕
          </button>
        ) : null}
      </div>
      {item.actions && item.actions.length > 0 ? (
        <NotificationActionList actions={item.actions} />
      ) : null}
      {canDismiss ? (
        <NotificationProgress remaining={remaining} duration={item.durationMs} />
      ) : null}
    </div>
  );
}
