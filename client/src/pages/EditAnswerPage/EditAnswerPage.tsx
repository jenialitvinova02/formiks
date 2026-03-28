import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../axiosInstance';
import { useAnswersForResponse } from '../../hooks/useAnswersForResponse';
import { useTranslation } from 'react-i18next';

const EditAnswerPage: React.FC = () => {
  const { t } = useTranslation();
  const { templateId, answerId } = useParams<{ templateId: string; answerId: string }>();
  const navigate = useNavigate();
  const { data: answers, loading, error } = useAnswersForResponse(answerId!);

  const [values, setValues] = useState<Record<number, string>>({});

  useEffect(() => {
    const init: Record<number, string> = {};
    answers.forEach(a => {
      init[a.id] = a.value;
    });
    setValues(init);
  }, [answers]);

  const handleChange = (ansId: number, val: string) => {
    setValues(v => ({ ...v, [ansId]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await Promise.all(
        Object.entries(values).map(([id, val]) =>
          axios.put(`answers/${id}`, { value: val })
        )
      );
      navigate(`/templates/${templateId}/answers`);
    } catch (e: any) {
      alert(e.response?.data?.error || e.message);
    }
  };

  if (loading) return <p>{t('editAnswer.loading')}</p>;
  if (error) return <p>{t('editAnswer.error', { error })}</p>;

  return (
    <form onSubmit={handleSubmit} className="container">
      <h2>{t('editAnswer.title', { answerId })}</h2>
      {answers.map(a => (
        <div key={a.id} className="form-group">
          <label>{a.question.title}</label>
          {a.question.type === 'multi-line' ? (
            <textarea
              value={values[a.id]}
              onChange={e => handleChange(a.id, e.target.value)}
            />
          ) : (
            <input
              type={a.question.type === 'integer' ? 'number' : 'text'}
              value={values[a.id]}
              onChange={e => handleChange(a.id, e.target.value)}
            />
          )}
        </div>
      ))}
      <button type="submit">{t('editAnswer.saveChanges')}</button>
      <button type="button" onClick={() => navigate(-1)}>{t('editAnswer.cancel')}</button>
    </form>
  );
};

export default EditAnswerPage;