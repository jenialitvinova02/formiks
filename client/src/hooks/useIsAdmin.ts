import { useMemo } from 'react';

export function useIsAdmin(): boolean {
  const token = localStorage.getItem('token');
  return useMemo(() => {
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'admin';
    } catch {
      return false;
    }
  }, [token]);
}