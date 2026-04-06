import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../axiosInstance';
import { InlineAlert, LoadingSkeleton } from '../../components';
import { useAnswersForResponse, useAnswerValues } from '../../hooks';
import { useTranslation } from 'react-i18next';
import { pushNotification, useAppDispatch } from '../../store';
import './EditAnswerPage.scss';

export const EditAnswerPage: React.FC = () => {
  const { t } = useTranslation();
  const { templateId, answerId } = useParams<{
    templateId: string;
    answerId: string;
  }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { data: answers, loading, error } = useAnswersForResponse(answerId!);
  const { values, handleChange } = useAnswerValues(answers);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        await Promise.all(
          Object.entries(values).map(([id, val]) =>
            axios.put(`answers/${id}`, { value: val }),
          ),
        );
        dispatch(
          pushNotification({
            type: 'success',
            message: 'Answer updated successfully.',
          }),
        );
        navigate(`/templates/${templateId}/answers`);
      } catch (e: any) {
        dispatch(
          pushNotification({
            type: 'error',
            message: e.response?.data?.error || e.message,
          }),
        );
      }
    },
    [values, navigate, templateId, dispatch],
  );

  if (loading) {
    return (
      <div className="editAnswerPage">
        <LoadingSkeleton rows={4} />
      </div>
    );
  }
  if (error)
    return (
      <InlineAlert
        title="Failed to load answer"
        message={t('editAnswer.error', { error })}
      />
    );

  return (
    <form onSubmit={handleSubmit} className="editAnswerPage">
      <div className="page-title">
        <h1>{t('editAnswer.title', { answerId })}</h1>
      </div>
      {answers.map((a) => (
        <div key={a.id} className="editAnswerPage__group">
          <label>{a.question.title}</label>
          {a.question.type === 'multi-line' ? (
            <textarea
              value={values[a.id]}
              onChange={(e) => handleChange(a.id, e.target.value)}
            />
          ) : (
            <input
              type={a.question.type === 'integer' ? 'number' : 'text'}
              value={values[a.id]}
              onChange={(e) => handleChange(a.id, e.target.value)}
            />
          )}
        </div>
      ))}
      <div className="actions-row">
        <button type="submit">{t('editAnswer.saveChanges')}</button>
        <button type="button" onClick={() => navigate(-1)}>
          {t('editAnswer.cancel')}
        </button>
      </div>
    </form>
  );
};

export default EditAnswerPage;
