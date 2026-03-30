import type { NotificationAction } from '../models/index.js';

export function NotificationActionList({ actions }: { actions: NotificationAction[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action, index) => (
        <button
          key={`${action.label}-${index}`}
          type="button"
          onClick={action.onClick}
          className="rounded-full border border-transparent bg-black/5 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-black/10 dark:bg-white/10 dark:text-slate-100 dark:hover:bg-white/20"
        >
          {action.label}
        </button>
      ))}
    </div>
  );
}
