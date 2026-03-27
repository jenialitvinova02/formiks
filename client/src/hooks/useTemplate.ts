import { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import { ROUTES } from '../constants/api';

export interface TemplateDetail {
  id: number;
  title: string;
  description: string;
  questions: { id: number; title: string; type: string }[];
}

export function useTemplate(id: string | undefined) {
  const [data, setData] = useState<TemplateDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    if (!id) return;
    axios.get<TemplateDetail>(`${ROUTES.templates}/${id}`)
      .then(r => setData(r.data))
      .catch(e => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}