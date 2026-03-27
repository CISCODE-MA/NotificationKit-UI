import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NotificationItem } from '../components/NotificationItem.js';
import React from 'react';

describe('NotificationItem accessibility', () => {
  it('has proper ARIA attributes', () => {
    render(
      <NotificationItem
        item={{
          id: '1',
          type: 'info',
          position: 'top-right',
          animation: { type: 'slide', durationMs: 300 },
          autoDismiss: false,
          durationMs: 4000,
          pauseOnHover: false,
          pauseOnFocus: false,
          closeButton: true,
          clearOnNavigate: false,
          ariaRole: 'status',
          icon: null,
          title: 'Accessible',
          message: 'Notification',
          createdAt: Date.now(),
          state: 'visible',
        }}
        onDismiss={() => {}}
      />,
    );
    const notification = screen.getByRole('status');
    expect(notification).toHaveAttribute('aria-describedby');
    expect(screen.getByText('Accessible')).toBeInTheDocument();
    expect(screen.getByText('Notification')).toBeInTheDocument();
  });
});
