import { useState } from 'react';
import axios from '../axiosInstance';
import { ROUTES } from '../constants/api';

export interface NewQuestion {
  title: string;
  description: string;
  type: string;
}
export interface TemplateForm {
  title: string;
  description: string;
  topic: string;
  tags: string;
  isPublic: boolean;
  questions: NewQuestion[];
}

export function useCreateTemplate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function create(data: TemplateForm) {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(ROUTES.templates, data);
      return res.data;
    } catch (e: any) {
      setError(e.response?.data?.error || e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }

  return { create, loading, error };
}

export const createTemplate = async (templateData: any) => {
  try {
    console.log('[useCreateTemplate] Отправка данных шаблона:', templateData);
    const response = await axios.post('/api/templates', templateData);
    console.log('[useCreateTemplate] Ответ сервера:', response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      '[useCreateTemplate] Ошибка при создании шаблона:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
