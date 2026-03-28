import { useState, useEffect, useCallback } from 'react';
import { useTemplate } from './useTemplate';
import { DEFAULT_QUESTION } from '../constants/form';
import { TemplateForm, NewQuestion } from './useCreateTemplate';

export const useTemplateForm = (templateId?: string) => {
  const isEditMode = Boolean(templateId);
  const { data: template, loading, error } = useTemplate(templateId);

  const [meta, setMeta] = useState<Omit<TemplateForm, 'questions'>>({
    title: '',
    description: '',
    topic: '',
    tags: '',
    isPublic: true,
  });
  const [questions, setQuestions] = useState<NewQuestion[]>([]);

  // При наличии шаблона (режим редактирования) инициализируем значения
  useEffect(() => {
    if (isEditMode && template) {
      setMeta({
        title: template.title,
        description: template.description,
        topic: (template as any).topic || '',
        tags: (template as any).tags || '',
        isPublic: (template as any).isPublic || false,
      });
      if (template.questions && Array.isArray(template.questions)) {
        setQuestions(
          template.questions.map((q: any) => ({
            title: q.title,
            description: q.description || '',
            type: q.type,
          })),
        );
      }
    }
  }, [isEditMode, template]);

  const handleMetaChange = useCallback(
    (field: keyof typeof meta, value: string | boolean) => {
      setMeta((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleQuestionChange = useCallback(
    (idx: number, field: keyof NewQuestion, value: string) => {
      setQuestions((prev) =>
        prev.map((q, i) => (i === idx ? { ...q, [field]: value } : q)),
      );
    },
    [],
  );

  const addQuestion = useCallback(() => {
    setQuestions((prev) => [
      ...prev,
      { ...DEFAULT_QUESTION, type: 'single-line' },
    ]);
  }, []);

  return {
    isEditMode,
    meta,
    questions,
    handleMetaChange,
    handleQuestionChange,
    addQuestion,
    loading,
    error,
  };
};
