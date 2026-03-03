# Copilot Instructions - Notification Kit UI Module

> **Purpose**: Development guidelines for the Notification Kit UI module - reusable React notification components.

---

## 🎯 Module Overview

**Package**: `@ciscode/ui-notification-kit`  
**Type**: React Component Library  
**Purpose**: Pre-built notification UI components for React apps

### Responsibilities:

- Toast notifications
- Alert banners
- Notification centers
- Badge counters
- Real-time notification displays

---

## 🏗️ Module Structure

```
src/
  ├── components/           # React components
  │   ├── Toast/
  │   │   ├── Toast.tsx
  │   │   ├── Toast.test.tsx
  │   │   └── index.ts
  │   ├── NotificationCenter/
  │   └── AlertBanner/
  ├── hooks/               # Custom hooks
  │   ├── use-notifications.ts
  │   └── use-toast.ts
  ├── context/            # Notification context provider
  │   └── NotificationProvider.tsx
  ├── types/              # TypeScript types
  │   └── notification.types.ts
  └── index.ts            # Exports
```

---

## 📝 Naming Conventions

**Components**: `PascalCase.tsx`

- `Toast.tsx`
- `NotificationCenter.tsx`
- `AlertBanner.tsx`

**Hooks**: `camelCase.ts` with `use` prefix

- `use-notifications.ts`
- `use-toast.ts`

**Types**: `kebab-case.ts`

- `notification.types.ts`

---

## 🧪 Testing - Component Library Standards

### Coverage Target: 80%+

**Unit Tests:**

- ✅ All custom hooks
- ✅ Utilities and helpers
- ✅ Context logic

**Component Tests:**

- ✅ All components with user interactions
- ✅ Notification display logic
- ✅ Error state handling
- ✅ Auto-dismiss functionality

**Skip:**

- ❌ Purely presentational components (no logic)

**Test location:**

```
Toast/
  ├── Toast.tsx
  └── Toast.test.tsx  ← Same directory
```

---

## 📚 Documentation Standards

### JSDoc for Hooks:

```typescript
/**
 * Hook for managing notification state
 * @returns Notification methods and state
 * @example
 * ```tsx
 * const { notify, dismiss, notifications } = useNotifications();
 * 
 * const showSuccess = () => {
 *   notify({ type: 'success', message: 'Action completed!' });
 * };
 * ```
 */
export function useNotifications(): UseNotificationsReturn;
```

### Component Documentation:

```typescript
export interface ToastProps {
  /** Toast message content */
  message: string;
  /** Toast type (success, error, warning, info) */
  type?: 'success' | 'error' | 'warning' | 'info';
  /** Auto-dismiss duration in ms (0 = no auto-dismiss) */
  duration?: number;
  /** Callback when toast is dismissed */
  onDismiss?: () => void;
}

/**
 * Toast notification component
 * 
 * @example
 * ```tsx
 * <Toast
 *   type="success"
 *   message="Operation successful!"
 *   duration={3000}
 * />
 * ```
 */
export function Toast(props: ToastProps): JSX.Element;
```

---

## 🚀 Module Development Principles

### 1. Headless & Customizable

**Unstyled by default:**

```typescript
// Components accept className prop
<Toast className="my-custom-styles" message="Hello!" />
```

### 2. Accessibility First

**ARIA support:**

```tsx
<div role="alert" aria-live="polite">
  {message}
</div>
```

### 3. TypeScript Strict Mode

```typescript
// All exports fully typed
export type NotificationType = 'success' | 'error' | 'warning' | 'info';
```

---

## 🛠️ Development Workflow

### Creating New Components:

1. **Create component folder**
   ```
   mkdir -p src/components/MyComponent
   cd src/components/MyComponent
   ```

2. **Create files**
   - `MyComponent.tsx` - Component implementation
   - `MyComponent.test.tsx` - Component tests
   - `index.ts` - Export

3. **Export from main index**
   ```typescript
   // src/index.ts
   export { MyComponent } from './components/MyComponent';
   ```

### Testing Commands:

```bash
npm test                    # Run all tests
npm run test:watch          # Watch mode
npm run test:coverage       # Coverage report
```

### Build Commands:

```bash
npm run build              # Build for production
npm run dev                # Development mode
```

---

## ⚠️ Common Gotchas

### 1. Auto-dismiss Timers

```typescript
// ✅ Clean up timers
useEffect(() => {
  const timer = setTimeout(() => dismiss(), duration);
  return () => clearTimeout(timer);
}, [duration]);
```

### 2. Notification Queue Management

```typescript
// ✅ Limit queue size
const MAX_NOTIFICATIONS = 5;
const addNotification = (notif) => {
  setNotifications(prev => [...prev.slice(-MAX_NOTIFICATIONS + 1), notif]);
};
```

### 3. Z-index Management

```typescript
// Define consistent z-index scale
const NOTIFICATION_Z_INDEX = 9999;
```

---

## 📦 Dependencies

**Keep minimal:**

- ✅ React 18+
- ✅ TypeScript 5+
- ❌ Avoid heavy animation libraries
- ❌ Avoid CSS-in-JS unless necessary

---

## 📋 Code Review Checklist

Before submitting PR:

- [ ] All components have tests (80%+ coverage)
- [ ] JSDoc comments on all exports
- [ ] Props interface documented
- [ ] Accessibility attributes added
- [ ] TypeScript strict mode passes
- [ ] No console.log statements
- [ ] Updated exports in main index.ts

---

## 🔗 Integration Guidelines

**With backend NotificationKit:**

```typescript
import { useNotifications } from '@ciscode/ui-notification-kit';
import { notificationSocket } from '@ciscode/notification-kit';

// Listen to backend events
notificationSocket.on('notification', (data) => {
  notify({ type: data.type, message: data.message });
});
```

---
