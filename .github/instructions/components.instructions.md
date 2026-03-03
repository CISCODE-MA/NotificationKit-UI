# Component Development Instructions - NotificationKit-UI

> **Purpose**: React component development standards for notification/toast UI components.

---

## 🎯 Component Architecture

### Component Structure

```
ComponentName/
  ├── ComponentName.tsx       # Main component
  ├── ComponentName.test.tsx  # Tests
  ├── ComponentName.types.ts  # Props & types
  ├── ComponentName.styles.ts # Styled components (if using)
  └── index.ts                # Exports
```

### Notification Component Template

```typescript
import React, { useEffect } from 'react';
import { NotificationProps } from './Notification.types';

/**
 * Notification/Toast component with auto-dismiss and actions
 * @param {NotificationProps} props - Component props
 * @returns {JSX.Element} Rendered notification
 */
export const Notification: React.FC<NotificationProps> = ({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  actions,
}) => {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div
      role="status"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      className={`notification notification-${type}`}
    >
      <p>{message}</p>
      {actions && (
        <div className="notification-actions">
          {actions.map((action, i) => (
            <button key={i} onClick={action.onClick}>
              {action.label}
            </button>
          ))}
        </div>
      )}
      <button
        onClick={onClose}
        aria-label="Close notification"
        className="notification-close"
      >
        ×
      </button>
    </div>
  );
};

Notification.displayName = 'Notification';
```

---

## 📝 Props Standards

### Notification Props Interface

```typescript
export interface NotificationProps {
  /** Notification message content */
  message: string | React.ReactNode;
  /** Notification type/severity */
  type?: 'info' | 'success' | 'warning' | 'error';
  /** Auto-dismiss duration in ms (0 = no auto-dismiss) */
  duration?: number;
  /** Callback when notification is closed */
  onClose: () => void;
  /** Optional action buttons */
  actions?: Array<{
    label: string;
    onClick: () => void;
  }>;
  /** Position on screen */
  position?:
    | 'top-right'
    | 'top-left'
    | 'bottom-right'
    | 'bottom-left'
    | 'top-center'
    | 'bottom-center';
}
```

---

## ♿ Accessibility (A11y)

### ARIA Live Regions

```typescript
// ✅ Good - Uses aria-live for screen readers
<div
  role="status"
  aria-live={type === 'error' ? 'assertive' : 'polite'}
  aria-atomic="true"
>
  {message}
</div>

// ❌ Bad - No screen reader support
<div className="toast">{message}</div>
```

### Notification ARIA Attributes

- ✅ `role="status"` or `role="alert"` for notifications
- ✅ `aria-live="polite"` for info/success (non-critical)
- ✅ `aria-live="assertive"` for error/warning (critical)
- ✅ `aria-atomic="true"` to read entire message
- ✅ Close button has `aria-label="Close notification"`

### Keyboard Support

```typescript
// Dismiss on Escape key
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  document.addEventListener('keydown', handleEscape);
  return () => document.removeEventListener('keydown', handleEscape);
}, [onClose]);
```

---

## 🎨 Theming & Styling

### Notification Types & Colors

```typescript
const notificationStyles = {
  info: {
    background: theme.colors.info,
    color: theme.colors.infoText,
    icon: 'ℹ️',
  },
  success: {
    background: theme.colors.success,
    color: theme.colors.successText,
    icon: '✓',
  },
  warning: {
    background: theme.colors.warning,
    color: theme.colors.warningText,
    icon: '⚠',
  },
  error: {
    background: theme.colors.error,
    color: theme.colors.errorText,
    icon: '✕',
  },
};
```

### Animations

```typescript
// Entry animation
@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

// Exit animation
@keyframes slideOut {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}
```

---

## 🧪 Component Testing

### Test Coverage Requirements

```typescript
describe('Notification', () => {
  it('renders message', () => {
    render(<Notification message="Test notification" onClose={jest.fn()} />);
    expect(screen.getByText('Test notification')).toBeInTheDocument();
  });

  it('auto-dismisses after duration', async () => {
    jest.useFakeTimers();
    const onClose = jest.fn();

    render(<Notification message="Test" duration={3000} onClose={onClose} />);

    jest.advanceTimersByTime(3000);
    expect(onClose).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('calls onClose when close button clicked', async () => {
    const onClose = jest.fn();
    render(<Notification message="Test" onClose={onClose} />);

    await userEvent.click(screen.getByLabelText('Close notification'));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders with correct ARIA attributes for errors', () => {
    const { container } = render(
      <Notification message="Error!" type="error" onClose={jest.fn()} />
    );

    expect(container.querySelector('[aria-live="assertive"]')).toBeInTheDocument();
  });

  it('renders action buttons', async () => {
    const action = jest.fn();
    render(
      <Notification
        message="Test"
        onClose={jest.fn()}
        actions={[{ label: 'Undo', onClick: action }]}
      />
    );

    await userEvent.click(screen.getByRole('button', { name: 'Undo' }));
    expect(action).toHaveBeenCalled();
  });

  it('does not auto-dismiss when duration is 0', () => {
    jest.useFakeTimers();
    const onClose = jest.fn();

    render(<Notification message="Test" duration={0} onClose={onClose} />);

    jest.advanceTimersByTime(10000);
    expect(onClose).not.toHaveBeenCalled();

    jest.useRealTimers();
  });
});
```

---

## 🔄 State Management

### Notification Queue Management

```typescript
interface NotificationState {
  id: string;
  message: string;
  type: NotificationProps['type'];
}

const [notifications, setNotifications] = useState<NotificationState[]>([]);

const addNotification = (notification: Omit<NotificationState, 'id'>) => {
  const id = Date.now().toString();
  setNotifications((prev) => [...prev, { ...notification, id }]);
};

const removeNotification = (id: string) => {
  setNotifications((prev) => prev.filter((n) => n.id !== id));
};
```

### Notification Context Provider

```typescript
import { createContext, useContext } from 'react';

interface NotificationContextValue {
  showNotification: (props: NotificationInput) => void;
  hideNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};
```

---

## 📦 Component Exports

### Public API (index.ts)

```typescript
// Export components
export { Notification } from './Notification';
export { NotificationContainer } from './NotificationContainer';
export { NotificationProvider, useNotification } from './NotificationContext';

// Export types
export type { NotificationProps } from './Notification.types';
export type { NotificationPosition, NotificationType } from './types';
```

---

## 🚫 Anti-Patterns to Avoid

### ❌ Memory Leaks with Timers

```typescript
// Bad - Timer not cleaned up
useEffect(() => {
  setTimeout(onClose, duration);
}, []);

// Good - Timer cleaned up
useEffect(() => {
  const timer = setTimeout(onClose, duration);
  return () => clearTimeout(timer);
}, [duration, onClose]);
```

### ❌ No Maximum Notifications

```typescript
// Bad - Unlimited notifications can overflow screen
const addNotification = (notif) => {
  setNotifications((prev) => [...prev, notif]);
};

// Good - Limit max notifications shown
const MAX_NOTIFICATIONS = 5;
const addNotification = (notif) => {
  setNotifications((prev) => [...prev.slice(-MAX_NOTIFICATIONS + 1), notif]);
};
```

### ❌ Blocking UI with Notifications

```typescript
// Bad - Notifications block content
<div style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>

// Good - Notifications overlay in corner
<div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999 }}>
```

---

## 📋 Pre-Commit Checklist

- [ ] Notification uses `aria-live` for screen readers
- [ ] Auto-dismiss timer cleaned up properly
- [ ] Close button has accessible label
- [ ] Keyboard support (Escape to dismiss)
- [ ] Max notification limit implemented
- [ ] Entry/exit animations smooth
- [ ] Different types styled distinctly
- [ ] Tests cover auto-dismiss behavior
- [ ] Action buttons work correctly
- [ ] Position prop respected

---

## 📚 Resources

- [ARIA Live Regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
- [Toast Accessibility](https://www.w3.org/WAI/ARIA/apg/patterns/alert/)
- [React Toastify](https://fkhadra.github.io/react-toastify/introduction) (inspiration)
- [React Hot Toast](https://react-hot-toast.com/) (inspiration)
