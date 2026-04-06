import { useState, useEffect } from 'react';
import axios from '../axiosInstance';

export interface TemplateData {
  id: string;
  title: string;
  description: string;
}

export function usePublicTemplates() {
  const [data, setData] = useState<TemplateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get<TemplateData[]>('/public/templates')
      .then((r) => setData(r.data))
      .catch((e) => {
        setError(e.response?.data?.error || e.message);
        setData([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
