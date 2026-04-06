import React, { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosInstance';
import { ROUTES } from '../../constants';
import {
  InlineAlert,
  LoadingSkeleton,
} from '../../components';
import { useTemplates, useIsAdmin, useFormAnswersActions } from '../../hooks';
import { useTranslation } from 'react-i18next';
import { pushNotification, useAppDispatch } from '../../store';
import './TemplatesPage.scss';

export const TemplatesPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: templates, loading, error, refetch } = useTemplates();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'title' | 'newest'>('title');

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
      dispatch(
        pushNotification({
          type: 'success',
          message: 'Templates deleted successfully.',
        }),
      );
    } catch (err: any) {
      dispatch(
        pushNotification({
          type: 'error',
          message: err.response?.data?.error || err.message,
        }),
      );
    }
  }, [selectedDelete, refetch, cancelAction, t, dispatch]);

  const handleEditConfirm = useCallback(() => {
    if (selectedEdit === null) {
      dispatch(
        pushNotification({
          type: 'info',
          message: t('templates.pleaseSelectEdit'),
        }),
      );
      return;
    }
    navigate(`/templates/edit/${selectedEdit}`);
  }, [selectedEdit, navigate, t, dispatch]);

  const visibleTemplates = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const filtered = templates.filter((template) =>
      [template.title, template.description, template.topic]
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch),
    );

    return [...filtered].sort((left, right) => {
      if (sortBy === 'newest') {
        return (
          new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
        );
      }

      return left.title.localeCompare(right.title);
    });
  }, [templates, search, sortBy]);

  if (loading)
    return (
      <div className="TemplatesPage">
        <div className="page-title">
          <h1>{t('templates.myTemplates')}</h1>
        </div>
        <div className="TemplatesPage__container">
          <LoadingSkeleton rows={4} />
        </div>
      </div>
    );

  if (error)
    return (
      <div className="TemplatesPage">
        <InlineAlert
          title="Failed to load templates"
          message={t('templates.error', { error })}
        />
      </div>
    );

  return (
    <div className="TemplatesPage">
      <div className="page-title">
        <h1>{t('templates.myTemplates')}</h1>
        <p>Manage published forms, update drafts and review response collections.</p>
      </div>

      <div className="TemplatesPage__container">
        <div className="TemplatesPage__filters">
          <input
            aria-label="Search templates"
            placeholder="Search by title, description or topic"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <select
            aria-label="Sort templates"
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as 'title' | 'newest')
            }
          >
            <option value="title">Sort by title</option>
            <option value="newest">Sort by newest</option>
          </select>
        </div>
        {!visibleTemplates.length && (
          <InlineAlert
            title="No results"
            message={
              templates.length === 0
                ? t('templates.noTemplates')
                : 'No templates match the current filters.'
            }
          />
        )}
        <ul className="template-list">
          {visibleTemplates.map((tmpl) => (
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
