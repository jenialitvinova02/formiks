import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../axiosInstance';
import { useAnswersForResponse, useAnswerValues } from '../../hooks';
import { useTranslation } from 'react-i18next';

export const EditAnswerPage: React.FC = () => {
  const { t } = useTranslation();
  const { templateId, answerId } = useParams<{ templateId: string; answerId: string }>();
  const navigate = useNavigate();
  
  const { data: answers, loading, error } = useAnswersForResponse(answerId!);
  const { values, handleChange } = useAnswerValues(answers);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
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
  }, [values, navigate, templateId]);

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
      <button type="button" onClick={() => navigate(-1)}>
        {t('editAnswer.cancel')}
      </button>
    </form>
  );
};

export default EditAnswerPage;