import { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import { Question } from './useQuestions';

export interface TemplateData {
  id: string;
  title: string;
  description: string;
  topic?: string;
  questions?: Question[];
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

export function usePublicTemplate(templateId?: number | string) {
  const [data, setData] = useState<TemplateData | null>(null);
  const [loading, setLoading] = useState(Boolean(templateId));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!templateId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    axios
      .get<TemplateData>(`/public/templates/${templateId}`)
      .then((r) => setData(r.data))
      .catch((e) => {
        setError(e.response?.data?.error || e.message);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, [templateId]);

  return { data, loading, error };
}
