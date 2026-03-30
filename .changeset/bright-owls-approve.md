---
'@ciscode/ui-notification-kit': minor
---

Ship the first functional release of NotificationKit-UI.

### Added

- Notification provider and hook API (`NotificationProvider`, `useNotification`)
- Notification types: success, error, warning, info, loading, default
- Position support: top-left, top-center, top-right, center, bottom-left, bottom-center, bottom-right
- Configurable animations (slide, fade, scale), durations, auto-dismiss, close button, actions, and custom icons
- Store lifecycle with add/update/dismiss/clear/restore and history tracking
- Route-aware clearing support (`clearOnNavigate`, `navigationKey`)
- Accessibility support (live-region announcements, ARIA roles, keyboard escape-to-dismiss)
- Tailwind + RTL styling support and published style asset export (`./style.css`)
- Test coverage for store behavior, provider behavior, and a11y essentials

### Changed

- Package entry exports updated to align with generated build outputs
- Notification rendering moved to a portal to avoid stacking-context issues in host apps
- Layering hardened so notifications stay above dashboard content

### Notes

- Import styles in host apps using: `@ciscode/ui-notification-kit/style.css`
