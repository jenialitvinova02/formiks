import React, { useState, useCallback } from 'react';
import axios from '../../axiosInstance';
import { useTranslation } from 'react-i18next';
import { useInput } from '../../hooks';
import { DEFAULT_QUESTION } from '../../constants';

interface Question {
  title: string;
  type: 'text' | 'number' | 'checkbox';
}

export const CreateFormPage: React.FC = () => {
  const { t } = useTranslation();
  const title = useInput('');
  const description = useInput('');
  const [questionsCount, setQuestionsCount] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleQuestionsCountChange = useCallback((count: number) => {
    const newQuestions = Array.from({ length: count }, (_, i) => questions[i] || { ...DEFAULT_QUESTION });
    setQuestions(newQuestions);
    setQuestionsCount(count);
  }, [questions]);

  const updateQuestionAt = useCallback(
    (index: number, field: keyof Question, value: string) => {
      setQuestions(prev => prev.map((q, i) => (i === index ? { ...q, [field]: value } : q)));
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const payload = {
        title: title.value,
        description: description.value,
        questions,
      };
      const response = await axios.post('forms', payload);
      console.log('Form created:', response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || t('createForm.creationError'));
    }
  };

  return (
    <div>
      <h1>{t('createForm.createFormTitle')}</h1>
      {error && <p>{error}</p>}
      <input
        type="text"
        placeholder={t('createForm.formTitlePlaceholder')}
        value={title.value}
        onChange={title.onChange}
      />
      <textarea
        placeholder={t('createForm.descriptionPlaceholder')}
        value={description.value}
        onChange={description.onChange}
      />
      <input
        type="number"
        placeholder={t('createForm.questionsCountPlaceholder')}
        value={questionsCount}
        onChange={e => handleQuestionsCountChange(Number(e.target.value))}
      />
      {questions.map((q, index) => (
        <div key={index}>
          <input
            placeholder={t('createForm.questionTitlePlaceholder', { number: index + 1 })}
            value={q.title}
            onChange={e => updateQuestionAt(index, 'title', e.target.value)}
          />
          <select
            value={q.type}
            onChange={e => updateQuestionAt(index, 'type', e.target.value)}
          >
            <option value="text">{t('createForm.optionText')}</option>
            <option value="number">{t('createForm.optionNumber')}</option>
            <option value="checkbox">{t('createForm.optionCheckbox')}</option>
          </select>
        </div>
      ))}
      <button onClick={handleSubmit}>{t('createForm.submitButton')}</button>
    </div>
  );
};

export default CreateFormPage;