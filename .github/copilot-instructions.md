# Copilot Instructions - NotificationKit-UI

> **Purpose**: Development guidelines for NotificationKit-UI - reusable React notification UI components.

---

## 🎯 Package Overview

**Package**: `@ciscode/ui-notification-kit`  
**Type**: React Frontend Component Library  
**Purpose**: Pre-built notification and alert UI components for React apps

### This Package Provides:

- Notification display components
- Toast/alert components
- Notification context providers
- Notification state management hooks
- TypeScript types for notification state
- Vitest unit tests with 80%+ coverage
- Changesets for version management
- Husky + lint-staged for code quality

---

## 🏗️ Project Structure

```
src/
  ├── components/           # React components
  │   ├── Notification/
  │   ├── Toast/
  │   └── index.ts
  ├── hooks/                # Custom hooks
  │   ├── useNotification.ts
  │   └── useToast.ts
  ├── context/              # Context providers
  │   └── NotificationProvider.tsx
  ├── types/                # TypeScript types
  │   └── notification.types.ts
  └── index.ts              # Public exports
```

---

## 📝 Naming Conventions

**Components**: `PascalCase.tsx`

- `Notification.tsx`
- `Toast.tsx`
- `Alert.tsx`

**Hooks**: `camelCase.ts` with `use` prefix

- `useNotification.ts`
- `useToast.ts`

**Types**: `kebab-case.ts`

- `notification.types.ts`

---

## 🧪 Testing Standards

### Coverage Target: 80%+

**Unit Tests:**

- ✅ All components
- ✅ All custom hooks
- ✅ Context logic
- ✅ Type definitions

**Component Tests:**

- ✅ Rendering checks
- ✅ User interactions
- ✅ State changes

**Test file location:**

```
Notification/
  ├── Notification.tsx
  └── Notification.test.tsx
```

---

## 📚 Documentation

### JSDoc Required For:

- All exported components
- All exported hooks
- All exported types/interfaces
- All public functions

### Example:

```typescript
/**
 * Displays a notification message
 * @param message - The notification message
 * @param type - Type of notification (success, error, warning, info)
 * @returns Notification component
 */
export function Notification({ message, type }: Props): JSX.Element;
```

---

## 🎨 Code Style

- ESLint with TypeScript support (`--max-warnings=0`)
- Prettier formatting
- TypeScript strict mode
- Functional components only
- No `React.FC` - always explicit `JSX.Element` return type

---

## 🔄 Development Workflow

### Branch Naming:

```bash
feature/NK-UI-123-add-notification
bugfix/NK-UI-456-fix-toast-timing
refactor/NK-UI-789-extract-styles
```

### Before Publishing:

- [ ] All tests passing
- [ ] Coverage >= 80%
- [ ] ESLint checks pass
- [ ] TypeScript strict mode passes
- [ ] All public APIs documented
- [ ] Changeset created
- [ ] README updated

---

## 📦 Versioning

**MAJOR** (x.0.0): Breaking API changes
**MINOR** (0.x.0): New features (backward compatible)
**PATCH** (0.0.x): Bug fixes and improvements

Always create a changeset for user-facing changes using `npm run changeset`.

---

## 🔐 Security

- Never expose sensitive data in notifications
- Sanitize notification content
- Validate all notification props
- No `dangerouslySetInnerHTML` without approval

---

## 🚫 Restrictions

**NEVER without approval:**

- Breaking changes to component APIs
- Removing exported components/hooks
- Major dependency upgrades

**CAN do autonomously:**

- Bug fixes (non-breaking)
- Internal refactoring
- Adding new features (additive)
- Test improvements

---

## 💬 Communication

- Brief and direct
- Reference component names when discussing changes
- Flag breaking changes immediately
- This package is consumed by multiple applications

---

_Last Updated: March 3, 2026_
_Version: 0.1.0_
