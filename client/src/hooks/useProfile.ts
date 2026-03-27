
import { useState, useEffect } from 'react';
import axios from '../axiosInstance';

export interface UserData { username: string; email: string; }

export function useProfile() {
  const [data, setData] = useState<UserData|null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    axios.get('users/me')
      .then(r=>setData(r.data))
      .catch(e=>setError('Failed to load'))
      .finally(()=>setLoading(false));
  }, []);

  function update(upd: UserData) {
    return axios.put('users/me', upd)
      .then(r=>setData(r.data))
      .catch(e=>{ throw e; });
  }

  return { data, loading, error, update };
}