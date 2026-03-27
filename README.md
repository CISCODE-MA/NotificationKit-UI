# NotificationKit-UI

NotificationKit-UI is a React + TypeScript notification library with multiple variants, configurable behavior, accessibility support, and route-aware clearing.

## Features

- Notification types: `success`, `error`, `warning`, `info`, `loading`, `default`
- Positions: `top-left`, `top-center`, `top-right`, `center`, `bottom-left`, `bottom-center`, `bottom-right`
- Configurable animation: `slide`, `fade`, `scale`
- Auto-dismiss with per-notification override
- Optional action buttons
- Optional close button
- Pause on hover and pause on focus
- Queue limit (FIFO) with history support
- Route-aware clearing with `clearOnNavigate`
- Dark mode compatible styles
- RTL-ready Tailwind setup
- Accessibility: ARIA roles, live-region announcements, keyboard escape-to-dismiss

## Installation

```bash
npm install @ciscode/ui-notification-kit
```

Also ensure host app peer dependencies are installed:

- `react`
- `react-dom`

## Styling

Import package styles once in your app entry file:

```ts
import '@ciscode/ui-notification-kit/style.css';
```

## Quick Start

```tsx
import React from 'react';
import { NotificationProvider, useNotification } from '@ciscode/ui-notification-kit';
import '@ciscode/ui-notification-kit/style.css';

function Demo() {
  const { success, error, loading, update } = useNotification();

  const runTask = async () => {
    const pending = loading({
      title: 'Please wait',
      message: 'Processing request...',
      autoDismiss: false,
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      update({
        id: pending.id,
        type: 'success',
        title: 'Done',
        message: 'Operation completed',
        autoDismiss: true,
      });
    } catch {
      error({ title: 'Failed', message: 'Something went wrong' });
    }
  };

  return <button onClick={runTask}>Run Task</button>;
}

export default function App() {
  return (
    <NotificationProvider>
      <Demo />
    </NotificationProvider>
  );
}
```

## Provider API

`NotificationProvider` props:

- `config?: NotificationProviderConfig`
- `navigationKey?: string | number`

`navigationKey` can be tied to router location changes. When it changes, notifications with `clearOnNavigate: true` are removed while others remain visible.

### Example with React Router

```tsx
import { useLocation } from 'react-router-dom';
import { NotificationProvider } from '@ciscode/ui-notification-kit';

function RootLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return <NotificationProvider navigationKey={location.key}>{children}</NotificationProvider>;
}
```

## Hook API

`useNotification()` returns:

- `state`
- `config`
- `notify(config)`
- `success(config)`
- `error(config)`
- `warning(config)`
- `info(config)`
- `loading(config)`
- `defaultNotification(config)`
- `update({ id, ...patch })`
- `dismiss(id)`
- `clearAll()`
- `restore(id)`

## Notification Config

Main fields you can pass to `notify` and typed helper methods:

- `title?: string`
- `message?: string`
- `body?: ReactNode`
- `type?: NotificationType`
- `position?: NotificationPosition`
- `animation?: { type: 'slide' | 'fade' | 'scale'; durationMs: number }`
- `autoDismiss?: boolean`
- `durationMs?: number`
- `pauseOnHover?: boolean`
- `pauseOnFocus?: boolean`
- `closeButton?: boolean`
- `clearOnNavigate?: boolean`
- `actions?: { label: string; onClick: () => void }[]`
- `icon?: ReactNode | null`
- `onClick?: () => void`
- `ariaRole?: 'status' | 'alert'`

## Provider Defaults

`NotificationProviderConfig` supports:

- `maxVisible` (default: `5`)
- `defaultType` (default: `default`)
- `defaultPosition` (default: `top-right`)
- `defaultAnimation` (default: `{ type: 'slide', durationMs: 300 }`)
- `defaultAutoDismiss` (default: `true`)
- `defaultDurationMs` (default: `4000`)
- `defaultPauseOnHover` (default: `true`)
- `defaultPauseOnFocus` (default: `true`)
- `defaultCloseButton` (default: `true`)
- `defaultClearOnNavigate` (default: `false`)
- `defaultAriaRole` (default: `status`)
- `defaultIcon` (default: `null`)
- `historyLimit` (default: `20`)

## Accessibility Notes

- Uses ARIA role per notification (`status` or `alert`)
- Adds live-region announcements for screen readers
- Supports keyboard escape to dismiss
- Supports pause-on-focus for better readability

## Compatibility Notes

- Built with React and TypeScript for host apps using modern React (including environments like WidgetKit-UI/comptaleyes frontend)
- Tailwind-compatible output CSS is published as `@ciscode/ui-notification-kit/style.css`
- Distributed in ESM + CJS with type declarations

## Development Scripts

- `npm run build`
- `npm run typecheck`
- `npm test`
- `npm run lint`
- `npm run format`
