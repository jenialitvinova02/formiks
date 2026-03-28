import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../axiosInstance';
import { ROUTES } from '../../constants/api';
import { useResponsesForTemplate, ResponseInfo } from '../../hooks/useResponsesForTemplate';
import './FormAnswersListPage.scss';

const FormAnswersListPage: React.FC = () => {
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

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;
  if (!responses.length) return <p>No responses yet</p>;

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
    if (!window.confirm('Delete selected responses?')) return;
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
      alert('Please select one response for editing');
      return;
    }
    navigate(`/templates/${templateId}/answers/${selectedEdit}/edit`);
  };

  return (
    <div className="FormAnswersList">
      <h2>Responses for #{templateId}</h2>
      {isAdmin && (
        <div className="FormAnswersList__buttons" >
          {mode === 'normal' && (
            <>
              <button onClick={enterDeleteMode}>Delete</button>
              <button onClick={enterEditMode}>Edit</button>
            </>
          )}
          {mode !== 'normal' && (
            <>
              {mode === 'delete' && <button onClick={handleDeleteConfirm}>Confirm Delete</button>}
              {mode === 'edit' && <button onClick={handleEditConfirm}>Confirm Edit</button>}
              <button onClick={cancelAction}>Cancel</button>
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