
import { useState } from 'react';
import axios from '../axiosInstance';
import { ROUTES } from '../constants/api';

export function useAuth() {
  const [error, setError] = useState<string|null>(null);
  const [loading, setLoading] = useState(false);

  async function login(email: string, password: string) {
    setLoading(true); setError(null);
    try {
      const { data } = await axios.post(ROUTES.auth.login, { email, password });
      localStorage.setItem('token', data.token);
      return data;
    } catch (e: any) {
      setError(e.response?.data?.error || e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  async function register(username: string, email: string, password: string, role: string) {
    setLoading(true); setError(null);
    try {
      await axios.post(ROUTES.auth.register, { username, email, password, role });
      return login(email, password);
    } catch (e: any) {
      setError(e.response?.data?.errors?.[0]?.msg || e.response?.data?.error || e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem('token');
  }

  return { login, register, logout, error, loading };
}