import { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import { ROUTES } from '../constants/api';

export interface ResponseInfo {
  id: number;
  createdAt: string;
}

export function useResponsesForTemplate(templateId: number | string) {
  const [responses, setResponses] = useState<ResponseInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${ROUTES.responses}/template/${templateId}`)
      .then((r) => setResponses(r.data))
      .catch((e) => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false));
  }, [templateId]);

  return { responses, loading, error };
}
