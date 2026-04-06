import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuestions, useAnswersState } from '../../hooks';
import { FieldInput, InlineAlert, LoadingSkeleton } from '../../components';
import axios from '../../axiosInstance';
import { API_RESPONSE_FROM_TEMPLATE } from '../../constants';
import { pushNotification, useAppDispatch } from '../../store';
import './FillTemplatePage.scss';

export const FillTemplatePage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { questions, loading, error } = useQuestions(id || '');
  const { answers, updateAnswer } = useAnswersState();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await axios.post(`${API_RESPONSE_FROM_TEMPLATE}/${id}`, { answers });
        dispatch(
          pushNotification({
            type: 'success',
            message: 'Response submitted successfully.',
          }),
        );
        navigate('/dashboard');
      } catch (e: any) {
        setSubmitError(e.response?.data?.error || e.message);
      }
    },
    [answers, navigate, id, dispatch],
  );

  if (loading) {
    return (
      <div className="formGroup">
        <div className="formGroup__container">
          <LoadingSkeleton rows={4} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <InlineAlert
        title="Failed to load template questions"
        message={t('fillTemplate.error', { error })}
      />
    );
  }

  return (
    <div className="formGroup">
      <form className="formGroup__container" onSubmit={handleSubmit}>
        <div className="page-title">
          <h1>Template Response</h1>
          <p>Answer each field below and submit the completed response.</p>
        </div>
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
        {submitError && (
          <InlineAlert title="Submit failed" message={submitError} />
        )}
        <button type="submit">{t('fillTemplate.submit')}</button>
      </form>
    </div>
  );
};

export default FillTemplatePage;
