import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAnswersState, usePublicTemplate, useTemplate } from '../../hooks';
import { FieldInput, InlineAlert, LoadingSkeleton } from '../../components';
import axios from '../../axiosInstance';
import {
  API_PUBLIC_TEMPLATE_RESPONSE,
  API_RESPONSE_FROM_TEMPLATE,
} from '../../constants';
import { pushNotification, useAppDispatch } from '../../store';
import './FillTemplatePage.scss';

export const FillTemplatePage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  const publicTemplate = usePublicTemplate(isAuthenticated ? undefined : id);
  const privateTemplate = useTemplate(isAuthenticated ? id : undefined);
  const template = isAuthenticated ? privateTemplate.data : publicTemplate.data;
  const loading = isAuthenticated ? privateTemplate.loading : publicTemplate.loading;
  const error = isAuthenticated ? privateTemplate.error : publicTemplate.error;
  const questions = template?.questions ?? [];
  const { answers, updateAnswer } = useAnswersState();
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const endpoint = isAuthenticated
          ? `${API_RESPONSE_FROM_TEMPLATE}/${id}`
          : `${API_PUBLIC_TEMPLATE_RESPONSE}/${id}/responses`;

        await axios.post(endpoint, { answers });
        dispatch(
          pushNotification({
            type: 'success',
            message: 'Response submitted successfully.',
          }),
        );
        navigate(isAuthenticated ? '/dashboard' : '/guest');
      } catch (e: any) {
        setSubmitError(e.response?.data?.error || e.message);
      }
    },
    [answers, navigate, id, dispatch, isAuthenticated],
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
          <h1>{template?.title || 'Template Response'}</h1>
          <p>{template?.description || 'Answer each field below and submit the completed response.'}</p>
        </div>
        {questions.length === 0 && (
          <InlineAlert
            title="No questions"
            message="This template does not contain questions yet."
          />
        )}
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
