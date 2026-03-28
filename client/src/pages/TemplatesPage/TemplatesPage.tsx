import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosInstance';
import { ROUTES } from '../../constants/api';
import { useTemplates } from '../../hooks/useTemplates';
import { useTranslation } from 'react-i18next';
import './TemplatesPage.scss';

const TemplatesPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: templates, loading, error, refetch } = useTemplates();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isAdmin = token
    ? (JSON.parse(atob(token.split('.')[1])) as any).role === 'admin'
    : false;

  const [mode, setMode] = useState<'normal' | 'delete' | 'edit'>('normal');
  const [selectedDelete, setSelectedDelete] = useState<number[]>([]);
  const [selectedEdit, setSelectedEdit] = useState<number | null>(null);

  if (loading) return <p>{t('templates.loading')}</p>;
  if (error) return <p>{t('templates.error', { error })}</p>;
  if (!templates.length) return <p>{t('templates.noTemplates')}</p>;

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
    if (!window.confirm(t('templates.deleteConfirm'))) return;
    try {
      await Promise.all(
        selectedDelete.map(id => axios.delete(`${ROUTES.templates}/${id}`))
      );
      refetch();
      setMode('normal');
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  };

  const handleEditConfirm = () => {
    if (selectedEdit === null) {
      alert(t('templates.pleaseSelectEdit'));
      return;
    }
    navigate(`/templates/edit/${selectedEdit}`);
  };

  return (
    <div className="TemplatesPage">
      <h1>{t('templates.myTemplates')}</h1>

      {isAdmin && (
        <div className="TemplatesPage__buttons">
          {mode === 'normal' && (
            <>
              <button onClick={enterDeleteMode}>{t('templates.delete')}</button>
              <button onClick={enterEditMode}>{t('templates.edit')}</button>
            </>
          )}
          {mode !== 'normal' && (
            <>
              {mode === 'delete' && (
                <button onClick={handleDeleteConfirm}>{t('templates.confirmDelete')}</button>
              )}
              {mode === 'edit' && (
                <button onClick={handleEditConfirm}>{t('templates.confirmEdit')}</button>
              )}
              <button onClick={cancelAction}>{t('templates.cancel')}</button>
            </>
          )}
        </div>
      )}

      <ul className="template-list">
        {templates.map(tmpl => (
          <li
            key={tmpl.id}
            className="template-list__item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: mode === 'normal' ? 'pointer' : 'default'
            }}
            onClick={() => {
              if (mode === 'normal') navigate(`/templates/${tmpl.id}/answers`);
            }}
          >
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
            <span>
              <strong>{tmpl.title}</strong>: {tmpl.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TemplatesPage;