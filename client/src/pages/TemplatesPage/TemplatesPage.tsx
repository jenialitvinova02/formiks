import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosInstance';
import { ROUTES } from '../../constants/api';
import { useTemplates } from '../../hooks/useTemplates';
import './TemplatesPage.scss'

const TemplatesPage: React.FC = () => {
  const { data: templates, loading, error, refetch } = useTemplates();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isAdmin = token
    ? (JSON.parse(atob(token.split('.')[1])) as any).role === 'admin'
    : false;

  const [mode, setMode] = useState<'normal' | 'delete' | 'edit'>('normal');
  const [selectedDelete, setSelectedDelete] = useState<number[]>([]);
  const [selectedEdit, setSelectedEdit] = useState<number | null>(null);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;
  if (!templates.length) return <p>No templates available</p>;

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
    if (!window.confirm('Удалить выбранные шаблоны?')) return;
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
      alert('Пожалуйста, выберите один шаблон для редактирования');
      return;
    }
    navigate(`/templates/edit/${selectedEdit}`);
  };

  return (
    <div className="TemplatesPage">
      <h1>My Templates</h1>

      {isAdmin && (
        <div className="TemplatesPage__buttons">
          {mode === 'normal' && (
            <>
              <button onClick={enterDeleteMode}>Delete</button>
              <button onClick={enterEditMode}>Edit</button>
            </>
          )}
          {mode !== 'normal' && (
            <>
              {mode === 'delete' && (
                <button onClick={handleDeleteConfirm}>Confirm Delete</button>
              )}
              {mode === 'edit' && (
                <button onClick={handleEditConfirm}>Confirm Edit</button>
              )}
              <button onClick={cancelAction}>Cancel</button>
            </>
          )}
        </div>
      )}

      <ul className="template-list">
        {templates.map(t => (
          <li
            key={t.id}
            className="template-list__item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: mode === 'normal' ? 'pointer' : 'default'
            }}
            onClick={() => {
              if (mode === 'normal') navigate(`/templates/${t.id}/answers`);
            }}
          >
            {mode === 'delete' && (
              <input
                type="checkbox"
                checked={selectedDelete.includes(t.id)}
                onChange={() => toggleDeleteSelection(t.id)}
              />
            )}
            {mode === 'edit' && (
              <input
                type="radio"
                name="editSelection"
                checked={selectedEdit === t.id}
                onChange={() => setSelectedEdit(t.id)}
              />
            )}
            <span>
              <strong>{t.title}</strong>: {t.description}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TemplatesPage;