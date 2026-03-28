import { useState, useEffect } from 'react';
import axios from '../axiosInstance';

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

export function useUsers() {
  const [data, setData] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('users')
      .then((r) => setData(r.data))
      .catch(() => setError('Cannot fetch users'))
      .finally(() => setLoading(false));
  }, []);

  function updateRole(id: number, role: string) {
    return axios.put(`users/${id}`, { role }).then((r) => {
      setData((d) => d.map((u) => (u.id === id ? r.data : u)));
    });
  }

  return { data, loading, error, updateRole };
}
