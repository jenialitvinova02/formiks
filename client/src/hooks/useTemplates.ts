import { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import { API_TEMPLATES } from '../constants/apiRoutes';

export interface TemplateData {
  id: number;
  title: string;
  description: string;
  topic: string;
  createdAt: string;
}

export function useTemplates() {
  const [data, setData] = useState<TemplateData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  const fetchTemplates = () => {
    setLoading(true);
    axios.get(API_TEMPLATES)
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  };

  useEffect(fetchTemplates, []);

  return { data, loading, error, refetch: fetchTemplates };
}