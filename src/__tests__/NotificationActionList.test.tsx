import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { NotificationActionList } from '../components/NotificationActionList.js';

describe('NotificationActionList', () => {
  it('renders action buttons with correct labels', () => {
    const actions = [
      { label: 'Undo', onClick: vi.fn() },
      { label: 'Retry', onClick: vi.fn() },
    ];
    render(<NotificationActionList actions={actions} />);

    expect(screen.getByText('Undo')).toBeInTheDocument();
    expect(screen.getByText('Retry')).toBeInTheDocument();
  });

  it('calls onClick when action button is clicked', () => {
    const onClick = vi.fn();
    render(<NotificationActionList actions={[{ label: 'Confirm', onClick }]} />);

    fireEvent.click(screen.getByText('Confirm'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders nothing when actions array is empty', () => {
    const { container } = render(<NotificationActionList actions={[]} />);
    expect(container.querySelectorAll('button')).toHaveLength(0);
  });
});
