import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosInstance';
import { ROUTES } from '../../constants';
import { useTemplates, useIsAdmin, useFormAnswersActions } from '../../hooks';
import { useTranslation } from 'react-i18next';
import './TemplatesPage.scss';

export const TemplatesPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: templates, loading, error, refetch } = useTemplates();
  const navigate = useNavigate();

  const isAdmin = useIsAdmin();

  const {
    mode,
    selectedDelete,
    selectedEdit,
    toggleDeleteSelection,
    enterDeleteMode,
    enterEditMode,
    cancelAction,
    setSelectedEdit,
  } = useFormAnswersActions();

  const handleDeleteConfirm = useCallback(async () => {
    if (selectedDelete.length === 0) return;
    if (!window.confirm(t('templates.deleteConfirm'))) return;
    try {
      await Promise.all(
        selectedDelete.map((id) => axios.delete(`${ROUTES.templates}/${id}`)),
      );
      refetch();
      cancelAction();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  }, [selectedDelete, refetch, cancelAction, t]);

  const handleEditConfirm = useCallback(() => {
    if (selectedEdit === null) {
      alert(t('templates.pleaseSelectEdit'));
      return;
    }
    navigate(`/templates/edit/${selectedEdit}`);
  }, [selectedEdit, navigate, t]);

  if (loading) return <p>{t('templates.loading')}</p>;
  if (error) return <p>{t('templates.error', { error })}</p>;
  if (!templates.length) return <p>{t('templates.noTemplates')}</p>;

  return (
    <div className="TemplatesPage">
      <div className="page-title">
        <h1>{t('templates.myTemplates')}</h1>
        <p>Manage published forms, update drafts and review response collections.</p>
      </div>

      <div className="TemplatesPage__container">
        <ul className="template-list">
          {templates.map((tmpl) => (
            <li
              key={tmpl.id}
              className="template-list__item"
              data-mode={mode}
              onClick={() => {
                if (mode === 'normal') navigate(`/templates/${tmpl.id}/answers`);
              }}
            >
              <div className="template-list__meta">
                {mode === 'delete' && (
                  <input
                    type="checkbox"
                    checked={selectedDelete.includes(tmpl.id)}
                    onChange={() => toggleDeleteSelection(tmpl.id)}
                  />
                )}
                {mode === 'edit' && (
                  <input
                    type="radio"
                    name="editSelection"
                    checked={selectedEdit === tmpl.id}
                    onChange={() => setSelectedEdit(tmpl.id)}
                  />
                )}
                <div className="template-list__copy">
                  <strong>{tmpl.title}</strong>
                  <span>{tmpl.description}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {isAdmin && (
          <div className="TemplatesPage__buttons">
            {mode === 'normal' ? (
              <>
                <button onClick={enterDeleteMode}>
                  {t('templates.delete')}
                </button>
                <button onClick={enterEditMode}>{t('templates.edit')}</button>
              </>
            ) : (
              <div>
                {mode === 'delete' && (
                  <button onClick={handleDeleteConfirm}>
                    {t('templates.confirmDelete')}
                  </button>
                )}
                {mode === 'edit' && (
                  <button onClick={handleEditConfirm}>
                    {t('templates.confirmEdit')}
                  </button>
                )}
                <button onClick={cancelAction}>{t('templates.cancel')}</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplatesPage;
