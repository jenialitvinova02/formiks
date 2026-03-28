import { useState, useEffect } from 'react';
import axios from '../axiosInstance';

export interface AnswerFull {
  id: number;
  question: { id: number; title: string; type: string };
  value: string;
}

export function useAnswersForResponse(responseId: number | string) {
  const [data, setData] = useState<AnswerFull[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!responseId) return;
    axios
      .get<AnswerFull[]>(`answers/response/${responseId}`)
      .then((r) => setData(r.data))
      .catch((e) => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false));
  }, [responseId]);

  return { data, loading, error };
}
