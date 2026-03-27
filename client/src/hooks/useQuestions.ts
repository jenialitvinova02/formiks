import { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import { ROUTES } from '../constants/api';

export interface Question {
  id: number;
  title: string;
  description: string;
  type: string;
}

export function useQuestions(templateId: number | string) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    axios.get(`${ROUTES.questions}/template/${templateId}`)
      .then(r => setQuestions(r.data))
      .catch(e => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false));
  }, [templateId]);

  return { questions, loading, error };
}