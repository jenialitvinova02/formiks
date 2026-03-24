// filepath: c:\Users\Danila\Desktop\ITtransition\CourseProject\client\src\pages\templates\FormAnswersList.tsx
import React, { useState, useEffect } from 'react';
import axios from '../../axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';

const FormAnswersList: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [answers, setAnswers] = useState<any[]>([]);
  const [formTitle, setFormTitle] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch form details to display its title or info
    axios.get(`templates/${formId}`)
      .then(res => setFormTitle(res.data.title))
      .catch(err => {
        console.error('Error fetching form info:', err);
        setFormTitle('(unknown form)');
      });

    // Fetch all answers for this form
    axios.get(`responses/template/${formId}`)
      .then(res => setAnswers(res.data))
      .catch(err => {
        console.error('Error fetching answers:', err);
        setError('Failed to load answers');
      });
  }, [formId]);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Answers for: {formTitle}</h1>
      {answers.length > 0 ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {answers.map(answer => (
            <div
              key={answer.id}
              onClick={() => navigate(`/templates/${formId}/answers/${answer.id}`)}
              style={{
                cursor: 'pointer',
                border: '1px solid #888',
                padding: 10,
                borderRadius: 6,
                minWidth: 150
              }}
            >
              <p>Answer #{answer.id}</p>
              <small>Value: {answer.value.slice(0, 20)}...</small>
            </div>
          ))}
        </div>
      ) : (
        <p>No answers found for this form</p>
      )}
    </div>
  );
};

export default FormAnswersList;