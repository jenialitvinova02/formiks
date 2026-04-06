import { useMemo } from 'react';
import { useAppSelector } from '../store';

export function useIsAdmin(): boolean {
  const user = useAppSelector((state) => state.session.user);

  return useMemo(() => {
    return user?.role === 'admin';
  }, [user]);
}
