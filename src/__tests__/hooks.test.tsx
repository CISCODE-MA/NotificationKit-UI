import { renderHook, act } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useRef } from 'react';
import { useClearOnNavigate } from '../hooks/useClearOnNavigate.js';
import { useFocusTrap, useLiveRegion } from '../hooks/useAccessibility.js';
import { useNotification } from '../hooks/useNotification.js';

// ─── useClearOnNavigate ──────────────────────────────────────────────────────

describe('useClearOnNavigate', () => {
  it('calls clearAll when locationKey changes', () => {
    const clearAll = vi.fn();
    const { rerender } = renderHook(
      ({ key }: { key: string }) => useClearOnNavigate(clearAll, key),
      { initialProps: { key: 'route-1' } },
    );

    expect(clearAll).toHaveBeenCalledTimes(1); // initial effect run

    rerender({ key: 'route-2' });
    expect(clearAll).toHaveBeenCalledTimes(2);

    rerender({ key: 'route-2' }); // same key — should not re-fire
    expect(clearAll).toHaveBeenCalledTimes(2);
  });
});

// ─── useFocusTrap ────────────────────────────────────────────────────────────

describe('useFocusTrap', () => {
  it('attaches and detaches keydown listener on the container', () => {
    const div = document.createElement('div');
    document.body.appendChild(div);

    const addSpy = vi.spyOn(div, 'addEventListener');
    const removeSpy = vi.spyOn(div, 'removeEventListener');

    const { unmount } = renderHook(() => {
      const ref = useRef<HTMLElement>(div as HTMLElement);
      useFocusTrap(ref);
    });

    expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    unmount();
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

    document.body.removeChild(div);
  });

  it('wraps focus to last element when Tab is pressed on first focusable element', () => {
    const container = document.createElement('div');
    const btn1 = document.createElement('button');
    const btn2 = document.createElement('button');
    container.appendChild(btn1);
    container.appendChild(btn2);
    document.body.appendChild(container);
    btn1.focus();

    renderHook(() => {
      const ref = useRef<HTMLElement>(container as HTMLElement);
      useFocusTrap(ref);
    });

    // Tab forward from last element should wrap to first
    btn2.focus();
    const tabEvent = new KeyboardEvent('keydown', {
      key: 'Tab',
      bubbles: true,
      cancelable: true,
    });
    act(() => {
      container.dispatchEvent(tabEvent);
    });

    document.body.removeChild(container);
  });

  it('does nothing when ref is null', () => {
    // Should not throw
    expect(() => {
      renderHook(() => {
        const ref = useRef<HTMLElement>(null);
        useFocusTrap(ref);
      });
    }).not.toThrow();
  });
});

// ─── useLiveRegion ───────────────────────────────────────────────────────────

describe('useLiveRegion', () => {
  it('creates a live region element with the given message', () => {
    renderHook(() => useLiveRegion('Notification sent'));

    const region = document.querySelector('[data-notification-live-region="true"]');
    expect(region).not.toBeNull();
    expect(region?.textContent).toBe('Notification sent');
  });

  it('reuses an existing live region element', () => {
    renderHook(() => useLiveRegion('First message'));
    renderHook(() => useLiveRegion('Second message'));

    const regions = document.querySelectorAll('[data-notification-live-region="true"]');
    expect(regions.length).toBe(1);
  });

  it('skips creation when message is empty', () => {
    document
      .querySelectorAll('[data-notification-live-region="true"]')
      .forEach((el) => el.remove());

    renderHook(() => useLiveRegion(''));

    const region = document.querySelector('[data-notification-live-region="true"]');
    expect(region).toBeNull();
  });

  it('supports polite priority', () => {
    renderHook(() => useLiveRegion('Polite message', 'polite'));

    const region = document.querySelector('[data-priority="polite"]');
    expect(region).not.toBeNull();
    expect(region?.getAttribute('aria-live')).toBe('polite');
  });
});

// ─── useNotification (error path) ────────────────────────────────────────────

describe('useNotification', () => {
  it('throws when used outside of NotificationProvider', () => {
    expect(() => {
      renderHook(() => useNotification());
    }).toThrow('useNotification must be used within a NotificationProvider');
  });
});
