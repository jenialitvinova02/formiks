// filepath: c:\Users\Danila\Desktop\ITtransition\CourseProject\client\src\pages\templates\FormAnswersList.tsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResponsesForTemplate } from '../../hooks/useResponsesForTemplate';
import ResponseList from '../../components/ResponseList/ResponseList';

const FormAnswersList: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { responses, loading, error } = useResponsesForTemplate(templateId!);

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error}</p>;
  if (!responses.length) return <p>No responses yet</p>;

  return (
    <div>
      <h2>Responses for #{templateId}</h2>
      <ResponseList
        items={responses}
        onSelect={id => navigate(`/templates/${templateId}/answers/${id}`)}
      />
    </div>
  );
};

export default FormAnswersList;