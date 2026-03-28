import { useLocation } from 'react-router-dom';

export const useAuthMode = (): 'login' | 'register' => {
  const { pathname } = useLocation();
  return pathname.endsWith('register') ? 'register' : 'login';
};

export default useAuthMode;
