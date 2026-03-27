import { useEffect } from 'react';

/**
 * Hook to clear notifications on route change.
 * Requires a clearAll callback and a location key.
 */
export function useClearOnNavigate(clearAll: () => void, locationKey: string) {
  useEffect(() => {
    clearAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationKey]);
}
