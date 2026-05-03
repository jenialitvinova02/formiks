import { useState, useEffect } from 'react';
import axios from '../axiosInstance';
import { ROUTES } from '../constants/api';

export interface ResponseInfo {
  id: number;
  createdAt: string;
}

export interface TemplateResponseAnalytics {
  templateId: number;
  totalResponses: number;
  totalAnswers: number;
  correctCount: number;
  incorrectCount: number;
  questions: {
    questionId: number;
    title: string;
    type: string;
    totalAnswers: number;
    optionCounts: { option: string; count: number }[];
    correctAnswer: string | null;
    correctCount: number;
    incorrectCount: number;
    accuracy: number | null;
  }[];
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

export function useTemplateResponseAnalytics(templateId: number | string) {
  const [analytics, setAnalytics] = useState<TemplateResponseAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get(`${ROUTES.responses}/template/${templateId}/analytics`)
      .then((r) => setAnalytics(r.data))
      .catch((e) => setError(e.response?.data?.error || e.message))
      .finally(() => setLoading(false));
  }, [templateId]);

  return { analytics, loading, error };
}
