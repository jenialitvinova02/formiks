// filepath: c:\Users\Danila\Desktop\ITtransition\CourseProject\client\src\pages\templates\FormAnswersList.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../axiosInstance';

interface IResponse {
  id: number;
  createdAt: string;
}

const FormAnswersList: React.FC = () => {
  const { templateId: tpl, formId } = useParams<{ templateId?: string; formId?: string }>();
  const templateId = tpl ?? formId;
  const [responses, setResponses] = useState<IResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!templateId) return;
    axios
      .get(`responses/template/${templateId}`)
      .then(res => setResponses(res.data))
      .catch(() => setError('Failed to load responses'));
  }, [templateId]);

  if (error) return <p>{error}</p>;
  if (!responses.length) return <p>No responses yet</p>;

  return (
    <div>
      <h2>Responses for Template #{templateId}</h2>
      <ul>
        {responses.map(r => (
          <li
            key={r.id}
            style={{ cursor: 'pointer' }}
            onClick={() =>
              navigate(`/templates/${templateId}/answers/${r.id}`)
            }
          >
            #{r.id} — submitted at {new Date(r.createdAt).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FormAnswersList;