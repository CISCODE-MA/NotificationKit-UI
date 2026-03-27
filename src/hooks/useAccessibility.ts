import { useCallback, useEffect } from 'react';

/**
 * Hook for managing focus trap behavior within a container.
 * Keeps focus within the container when tabbing.
 */
export function useFocusTrap(containerRef: React.RefObject<HTMLElement>) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || !containerRef.current) {
        return;
      }

      const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement;

      if (event.shiftKey) {
        if (activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        if (activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    },
    [containerRef],
  );

  useEffect(() => {
    const element = containerRef.current;
    if (!element) {
      return;
    }

    element.addEventListener('keydown', handleKeyDown);
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown, containerRef]);
}

/**
 * Hook for managing live region announcements.
 * Announces messages to screen readers.
 */
export function useLiveRegion(message: string, priority: 'polite' | 'assertive' = 'assertive') {
  useEffect(() => {
    if (!message) {
      return;
    }

    let liveRegion = document.querySelector<HTMLDivElement>(
      `[data-notification-live-region="true"][data-priority="${priority}"]`,
    );

    if (!liveRegion) {
      liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', priority);
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.setAttribute('data-notification-live-region', 'true');
      liveRegion.setAttribute('data-priority', priority);
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);
    }

    liveRegion.textContent = message;

    return () => {
      if (liveRegion && !liveRegion.textContent) {
        liveRegion.remove();
      }
    };
  }, [message, priority]);
}
