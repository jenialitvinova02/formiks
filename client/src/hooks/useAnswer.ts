import { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import { ROUTES } from '../constants/api';

export interface AnswerDetail {
  id: number;
  questionId: number;
  value: string;
}

export function useAnswer(id: string | undefined) {
  const [data, setData] = useState<AnswerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    if (!id) return;
    axios.get<AnswerDetail>(`${ROUTES.answers}/${id}`)
      .then(r => setData(r.data))
      .catch(e => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}