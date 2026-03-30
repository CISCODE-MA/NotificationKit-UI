import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { NotificationProvider } from '../components/NotificationProvider.js';
import { useNotification } from '../hooks/useNotification.js';
import React from 'react';

describe('NotificationProvider', () => {
  function TestComponent() {
    const { notify, dismiss, state } = useNotification();
    return (
      <>
        <button onClick={() => notify({ title: 'Test', message: 'Hello' })}>Show</button>
        <button onClick={() => dismiss(state.notifications[0]?.id)}>Dismiss</button>
      </>
    );
  }

  it('renders notifications and allows dismiss', () => {
    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>,
    );
    fireEvent.click(screen.getByText('Show'));
    expect(screen.getByText('Test')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Dismiss'));
    expect(screen.queryByText('Test')).not.toBeInTheDocument();
  });

  it('clears only clearOnNavigate notifications when navigationKey changes', () => {
    function Wrapper() {
      const [route, setRoute] = React.useState(1);

      return (
        <NotificationProvider navigationKey={route}>
          <RouteAwareTest onNavigate={() => setRoute((prev) => prev + 1)} />
        </NotificationProvider>
      );
    }

    function RouteAwareTest({ onNavigate }: { onNavigate: () => void }) {
      const { notify } = useNotification();

      return (
        <>
          <button
            onClick={() =>
              notify({
                title: 'Transient',
                message: 'Route-scoped',
                clearOnNavigate: true,
                autoDismiss: false,
              })
            }
          >
            Add transient
          </button>
          <button
            onClick={() =>
              notify({
                title: 'Persistent',
                message: 'Keep me',
                clearOnNavigate: false,
                autoDismiss: false,
              })
            }
          >
            Add persistent
          </button>
          <button onClick={onNavigate}>Navigate</button>
        </>
      );
    }

    render(<Wrapper />);

    fireEvent.click(screen.getByText('Add transient'));
    fireEvent.click(screen.getByText('Add persistent'));

    expect(screen.getByText('Transient')).toBeInTheDocument();
    expect(screen.getByText('Persistent')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Navigate'));

    expect(screen.queryByText('Transient')).not.toBeInTheDocument();
    expect(screen.getByText('Persistent')).toBeInTheDocument();
  });
});
