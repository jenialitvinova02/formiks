import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuestions, useAnswersState } from '../../hooks';
import { FieldInput } from '../../components';
import axios from '../../axiosInstance';
import { API_RESPONSE_FROM_TEMPLATE } from '../../constants';
import './FillTemplatePage.scss';

export const FillTemplatePage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { questions, loading, error } = useQuestions(id || '');
  const { answers, updateAnswer } = useAnswersState();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await axios.post(`${API_RESPONSE_FROM_TEMPLATE}/${id}`, { answers });
        navigate('/dashboard');
      } catch (e: any) {
        setSubmitError(e.response?.data?.error || e.message);
      }
    },
    [answers, navigate, id],
  );

  if (loading) return <p>{t('fillTemplate.loading')}</p>;
  if (error) return <p>{t('fillTemplate.error', { error })}</p>;

  return (
    <div className="formGroup">
      <form className="formGroup__container" onSubmit={handleSubmit}>
        {questions.map((q) => (
          <div key={q.id} className="formGroup__container--block">
            <label>{q.title}</label>
            <FieldInput
              question={q}
              value={answers[q.id] || ''}
              onChange={updateAnswer}
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
