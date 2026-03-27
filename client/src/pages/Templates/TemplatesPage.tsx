import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../axiosInstance';
import { ROUTES } from '../../constants/api';
import { useTemplates } from '../../hooks/useTemplates';

const TemplatesPage: React.FC = () => {
  const { data: templates, loading, error, refetch } = useTemplates();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isAdmin = token
    ? (JSON.parse(atob(token.split('.')[1])) as any).role === 'admin'
    : false;

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error}</p>;

  const handleDelete = async (id: number) => {
    if (!window.confirm('Удалить шаблон?')) return;
    await axios.delete(`${ROUTES.templates}/${id}`);
    refetch();
  };

  return (
    <div className="container">
      <h1>My Templates</h1>
      <ul className="template-list">
        {templates.map(t => (
          <li key={t.id} className="template-list__item">
            <span
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/templates/${t.id}/answers`)}
            >
              <strong>{t.title}</strong>: {t.description}
            </span>
            {isAdmin && (
              <>
                <button onClick={() => navigate(`/templates/edit/${t.id}`)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(t.id)}>
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TemplatesPage;