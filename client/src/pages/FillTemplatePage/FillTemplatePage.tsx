import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuestions } from '../../hooks/useQuestions';
import FieldInput from '../../components/FieldInput/FieldInput';
import axios from '../../axiosInstance';
import { useTranslation } from 'react-i18next';
import './FillTemplatePage.scss';

const FillTemplatePage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { questions, loading, error } = useQuestions(id || '');
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Questions loaded:', questions);
  }, [questions]);

  const handleChange = (qid: number, val: string | boolean) =>
    setAnswers(prev => ({ ...prev, [qid]: String(val) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`responses/from-template/${id}`, { answers });
      navigate('/dashboard');
    } catch (e: any) {
      setSubmitError(e.response?.data?.error || e.message);
    }
  };

  if (loading) return <p>{t('fillTemplate.loading')}</p>;
  if (error) return <p>{t('fillTemplate.error', { error })}</p>;

  return (
    <div className="formGroup">
      <form className="formGroup__container" onSubmit={handleSubmit}>
        {questions.map(q => (
          <div key={q.id} className="formGroup__container--block">
            <label>{q.title}</label>
            <FieldInput
              question={q}
              value={answers[q.id] || ''}
              onChange={handleChange}
            />
          </div>
        ))}
        {submitError && <p className="error">{submitError}</p>}
        <button type="submit">{t('fillTemplate.submit')}</button>
      </form>
    </div>
  );
};

export default FillTemplatePage;