import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../axiosInstance';
import { ROUTES } from '../../constants/api';
import { useResponsesForTemplate } from '../../hooks/useResponsesForTemplate';
import ResponseList from '../../components/ResponseList/ResponseList';

const FormAnswersListPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const isAdmin = token
    ? (JSON.parse(atob(token.split('.')[1])) as any).role === 'admin'
    : false;

  const { responses, loading, error } = useResponsesForTemplate(templateId!);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error}</p>;
  if (!responses.length) return <p>No responses yet</p>;

  const handleDeleteAnswer = async (id: number) => {
    if (!window.confirm('Delete this answer?')) return;
    await axios.delete(`${ROUTES.responses}/${id}`);
    navigate(0);
  };

  return (
    <div className="container">
      <h2>Responses for #{templateId}</h2>
      <ResponseList
        items={responses}
        onSelect={id => navigate(`/templates/${templateId}/answers/${id}`)}
      />
      {isAdmin && responses.map(r => (
        <span key={r.id} style={{ marginLeft: 16 }}>
          <button onClick={() => navigate(`/templates/${templateId}/answers/${r.id}/edit`)}>
            Edit
          </button>
          <button onClick={() => handleDeleteAnswer(r.id)}>
            Delete
          </button>
        </span>
      ))}
    </div>
  );
};

export default FormAnswersListPage;