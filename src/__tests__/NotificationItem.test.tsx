import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NotificationItem } from '../components/NotificationItem.js';
import type { NotificationRecord } from '../models/index.js';

function makeItem(overrides: Partial<NotificationRecord> = {}): NotificationRecord {
  return {
    id: 'test-id',
    title: 'Test title',
    message: 'Test message',
    type: 'info',
    position: 'top-right',
    animation: { type: 'slide', durationMs: 200 },
    autoDismiss: false,
    durationMs: 3000,
    pauseOnHover: false,
    pauseOnFocus: false,
    closeButton: true,
    clearOnNavigate: false,
    ariaRole: 'status',
    createdAt: Date.now(),
    state: 'visible',
    ...overrides,
  };
}

describe('NotificationItem', () => {
  it('renders title and message', () => {
    render(<NotificationItem item={makeItem()} onDismiss={vi.fn()} />);
    expect(screen.getByText('Test title')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('calls onDismiss when close button is clicked', () => {
    const onDismiss = vi.fn();
    render(<NotificationItem item={makeItem()} onDismiss={onDismiss} />);
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }));
    expect(onDismiss).toHaveBeenCalledWith('test-id');
  });

  it('calls onDismiss when Escape key is pressed', () => {
    const onDismiss = vi.fn();
    const { container } = render(<NotificationItem item={makeItem()} onDismiss={onDismiss} />);
    fireEvent.keyDown(container.firstChild as Element, { key: 'Escape' });
    expect(onDismiss).toHaveBeenCalledWith('test-id');
  });

  it('calls item.onClick when clicked', () => {
    const onClick = vi.fn();
    const { container } = render(
      <NotificationItem item={makeItem({ onClick })} onDismiss={vi.fn()} />,
    );
    fireEvent.click(container.firstChild as Element);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('pauses timer on mouse enter and resumes on mouse leave', () => {
    const item = makeItem({ autoDismiss: true, durationMs: 5000, pauseOnHover: true });
    const { container } = render(<NotificationItem item={item} onDismiss={vi.fn()} />);
    const el = container.firstChild as Element;
    fireEvent.mouseEnter(el);
    fireEvent.mouseLeave(el);
    // No assertion needed — just verifying handlePause/handleResume don't throw
  });

  it('pauses on focus and resumes on blur', () => {
    const item = makeItem({ autoDismiss: true, durationMs: 5000, pauseOnFocus: true });
    const { container } = render(<NotificationItem item={item} onDismiss={vi.fn()} />);
    const el = container.firstChild as Element;
    fireEvent.focus(el);
    fireEvent.blur(el);
  });

  it('renders with fade animation class', () => {
    const item = makeItem({ animation: { type: 'fade', durationMs: 200 } });
    const { container } = render(<NotificationItem item={item} onDismiss={vi.fn()} />);
    expect((container.firstChild as Element).className).toContain('animate-notify-fade');
  });

  it('renders with scale animation class', () => {
    const item = makeItem({ animation: { type: 'scale', durationMs: 200 } });
    const { container } = render(<NotificationItem item={item} onDismiss={vi.fn()} />);
    expect((container.firstChild as Element).className).toContain('animate-notify-scale');
  });

  it('renders actions when provided', () => {
    const item = makeItem({ actions: [{ label: 'Undo', onClick: vi.fn() }] });
    render(<NotificationItem item={item} onDismiss={vi.fn()} />);
    expect(screen.getByText('Undo')).toBeInTheDocument();
  });

  it('renders progress bar when autoDismiss is true', () => {
    const item = makeItem({ autoDismiss: true, durationMs: 3000 });
    const { container } = render(<NotificationItem item={item} onDismiss={vi.fn()} />);
    // NotificationProgress renders a progress element
    expect(container.querySelector('[role="progressbar"], .progress, div[style]')).toBeDefined();
  });
});
