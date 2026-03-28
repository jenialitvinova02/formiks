import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../axiosInstance';
import { ROUTES } from '../../constants/api';
import { useResponsesForTemplate, ResponseInfo } from '../../hooks/useResponsesForTemplate';
import { useTranslation } from 'react-i18next';
import './FormAnswersListPage.scss';

const FormAnswersListPage: React.FC = () => {
  const { t } = useTranslation();
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isAdmin = token
    ? (JSON.parse(atob(token.split('.')[1])) as any).role === 'admin'
    : false;

  const { responses, loading, error } = useResponsesForTemplate(templateId!);
  const [mode, setMode] = useState<'normal' | 'delete' | 'edit'>('normal');
  const [selectedDelete, setSelectedDelete] = useState<number[]>([]);
  const [selectedEdit, setSelectedEdit] = useState<number | null>(null);

  if (loading) return <p>{t('formAnswersList.loading')}</p>;
  if (error) return <p>{t('formAnswersList.error', { error })}</p>;
  if (!responses.length) return <p>{t('formAnswersList.noResponses')}</p>;

  const toggleDeleteSelection = (id: number) => {
    setSelectedDelete(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
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
        selectedDelete.map(id => axios.delete(`${ROUTES.responses}/${id}`))
      );
      navigate(0);
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleEditConfirm = () => {
    if (selectedEdit === null) {
      alert(t('formAnswersList.selectEditAlert'));
      return;
    }
    navigate(`/templates/${templateId}/answers/${selectedEdit}/edit`);
  };

  return (
    <div className="FormAnswersList">
      <h2>{t('formAnswersList.responsesFor', { templateId })}</h2>
      {isAdmin && (
        <div className="FormAnswersList__buttons">
          {mode === 'normal' && (
            <>
              <button onClick={enterDeleteMode}>{t('formAnswersList.deleteButton')}</button>
              <button onClick={enterEditMode}>{t('formAnswersList.editButton')}</button>
            </>
          )}
          {mode !== 'normal' && (
            <>
              {mode === 'delete' && <button onClick={handleDeleteConfirm}>{t('formAnswersList.confirmDelete')}</button>}
              {mode === 'edit' && <button onClick={handleEditConfirm}>{t('formAnswersList.confirmEdit')}</button>}
              <button onClick={cancelAction}>{t('formAnswersList.cancel')}</button>
            </>
          )}
        </div>
      )}

      <ul className="response-list">
        {responses.map((r: ResponseInfo) => (
          <li
            key={r.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: mode === 'normal' ? 'pointer' : 'default'
            }}
            onClick={() => {
              if (mode === 'normal') navigate(`/templates/${templateId}/answers/${r.id}`);
            }}
          >
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormAnswersListPage;