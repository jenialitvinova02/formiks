import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../axiosInstance';
import { ROUTES } from '../../constants';
import { InlineAlert, LoadingSkeleton } from '../../components';
import { useResponsesForTemplate, ResponseInfo } from '../../hooks';
import { useTranslation } from 'react-i18next';
import { pushNotification, useAppDispatch, useAppSelector } from '../../store';
import './FormAnswersListPage.scss';

export const FormAnswersListPage: React.FC = () => {
  const { t } = useTranslation();
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isAdmin = useAppSelector((state) => state.session.user?.role === 'admin');

  const { responses, loading, error } = useResponsesForTemplate(templateId!);
  const [mode, setMode] = useState<'normal' | 'delete' | 'edit'>('normal');
  const [selectedDelete, setSelectedDelete] = useState<number[]>([]);
  const [selectedEdit, setSelectedEdit] = useState<number | null>(null);

  if (loading) {
    return (
      <div className="FormAnswersList">
        <div className="page-title">
          <h1>{t('formAnswersList.responsesFor', { templateId })}</h1>
        </div>
        <div className="FormAnswersList__container">
          <LoadingSkeleton rows={4} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="FormAnswersList">
        <InlineAlert
          title="Failed to load responses"
          message={t('formAnswersList.error', { error })}
        />
      </div>
    );
  }

  const toggleDeleteSelection = (id: number) => {
    setSelectedDelete((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const enterDeleteMode = () => {
    setMode('delete');
    setSelectedDelete([]);
  };

  const enterEditMode = () => {
    setMode('edit');
    setSelectedEdit(null);
  };

  const cancelAction = () => {
    setMode('normal');
    setSelectedDelete([]);
    setSelectedEdit(null);
  };

  const handleDeleteConfirm = async () => {
    if (selectedDelete.length === 0) return;
    if (!window.confirm(t('formAnswersList.deleteConfirmPrompt'))) return;
    try {
      await Promise.all(
        selectedDelete.map((id) => axios.delete(`${ROUTES.responses}/${id}`)),
      );
      dispatch(
        pushNotification({
          type: 'success',
          message: 'Responses deleted successfully.',
        }),
      );
      navigate(0);
    } catch (err: any) {
      dispatch(
        pushNotification({
          type: 'error',
          message: err.response?.data?.error || err.message,
        }),
      );
    }
  };

  const handleEditConfirm = () => {
    if (selectedEdit === null) {
      dispatch(
        pushNotification({
          type: 'info',
          message: t('formAnswersList.selectEditAlert'),
        }),
      );
      return;
    }
    navigate(`/templates/${templateId}/answers/${selectedEdit}/edit`);
  };

  return (
    <div className="FormAnswersList">
      <div className="page-title">
        <h1>{t('formAnswersList.responsesFor', { templateId })}</h1>
      </div>
      <div className="FormAnswersList__container">
        {!responses.length && (
          <InlineAlert
            title="No responses yet"
            message={t('formAnswersList.noResponses')}
          />
        )}
        <ul className="response-list">
          {responses.map((r: ResponseInfo) => (
            <li
              key={r.id}
              className="response-list__item"
              data-mode={mode}
              onClick={() => {
                if (mode === 'normal')
                  navigate(`/templates/${templateId}/answers/${r.id}`);
              }}
            >
              <div className="response-list__meta">
                {mode === 'delete' && (
                  <input
                    type="checkbox"
                    checked={selectedDelete.includes(r.id)}
                    onChange={() => toggleDeleteSelection(r.id)}
                  />
                )}
                {mode === 'edit' && (
                  <input
                    type="radio"
                    name="editSelection"
                    checked={selectedEdit === r.id}
                    onChange={() => setSelectedEdit(r.id)}
                  />
                )}
                <span>
                  #{r.id} – {new Date(r.createdAt).toLocaleString()}
                </span>
              </div>
            </li>
          ))}
        </ul>
        {isAdmin && (
          <div className="FormAnswersList__buttons">
            {mode === 'normal' && (
              <>
                <button onClick={enterDeleteMode}>
                  {t('formAnswersList.deleteButton')}
                </button>
                <button onClick={enterEditMode}>
                  {t('formAnswersList.editButton')}
                </button>
              </>
            )}
            {mode !== 'normal' && (
              <>
                {mode === 'delete' && (
                  <button onClick={handleDeleteConfirm}>
                    {t('formAnswersList.confirmDelete')}
                  </button>
                )}
                {mode === 'edit' && (
                  <button onClick={handleEditConfirm}>
                    {t('formAnswersList.confirmEdit')}
                  </button>
                )}
                <button onClick={cancelAction}>
                  {t('formAnswersList.cancel')}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FormAnswersListPage;
