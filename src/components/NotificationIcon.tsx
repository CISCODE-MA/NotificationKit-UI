import type { NotificationRecord } from '../models/index.js';

const typeIconMap: Record<NotificationRecord['type'], JSX.Element> = {
  success: (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.704 5.296a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3.25-3.25a1 1 0 1 1 1.414-1.414l2.543 2.543 6.543-6.543a1 1 0 0 1 1.414 0z"
        clipRule="evenodd"
      />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-1-11a1 1 0 1 1 2 0v4a1 1 0 1 1-2 0V7zm1 8a1.25 1.25 0 1 1 0-2.5A1.25 1.25 0 0 1 10 15z"
        clipRule="evenodd"
      />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l6.518 11.59c.75 1.332-.214 2.99-1.743 2.99H3.482c-1.53 0-2.493-1.658-1.743-2.99L8.257 3.1zm2.743 10.401a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-1-7a1 1 0 0 0-1 1v3a1 1 0 1 0 2 0v-3a1 1 0 0 0-1-1z"
        clipRule="evenodd"
      />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM9 9a1 1 0 1 0 0 2h1v3a1 1 0 1 0 2 0v-4a1 1 0 0 0-1-1H9zm1-4a1.25 1.25 0 1 0 0 2.5A1.25 1.25 0 0 0 10 5z"
        clipRule="evenodd"
      />
    </svg>
  ),
  loading: (
    <svg viewBox="0 0 24 24" className="h-5 w-5 animate-spin" fill="none" stroke="currentColor">
      <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4" />
      <path className="opacity-75" d="M4 12a8 8 0 0 1 8-8" strokeWidth="4" />
    </svg>
  ),
  default: (
    <svg viewBox="0 0 20 20" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M10 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 9a1 1 0 0 1-1-1V7a1 1 0 1 1 2 0v3a1 1 0 0 1-1 1zm0 4a1.25 1.25 0 1 1 0-2.5A1.25 1.25 0 0 1 10 15z" />
    </svg>
  ),
};

export function NotificationIcon({ item }: { item: NotificationRecord }) {
  if (item.icon === null) {
    return null;
  }

  if (item.icon) {
    return <div className="mt-0.5 text-current">{item.icon}</div>;
  }

  return <div className="mt-0.5 text-current">{typeIconMap[item.type]}</div>;
}
