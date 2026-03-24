// filepath: c:\Users\Danila\Desktop\ITtransition\CourseProject\client\src\pages\templates\ViewAnswer.tsx
import React, { useState, useEffect } from 'react';
import axios from '../../axiosInstance';
import { useParams } from 'react-router-dom';

interface QuestionData {
  title: string;
  description: string;
  type: string;
}

const ViewAnswer: React.FC = () => {
  const { formId, answerId } = useParams<{ formId: string; answerId: string }>();
  const [answer, setAnswer] = useState<any>(null);
  const [form, setForm] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the single answer
    axios.get(`answers/${answerId}`)
      .then(res => setAnswer(res.data))
      .catch(err => {
        console.error('Error fetching answer:', err);
        setError('Failed to load answer');
      });

    // Fetch the form
    axios.get(`templates/${formId}`)
      .then(res => setForm(res.data))
      .catch(err => {
        console.error('Error fetching form:', err);
        setError('Failed to load form');
      });
  }, [formId, answerId]);

  if (error) return <p>{error}</p>;
  if (!answer || !form) return <p>Loading...</p>;

  // If your form has questions in form.questions, you might want to show them.
  // Right now, we only have the single answer record. The "value" might correspond
  // to a specific question or an index. If you store multiple answers per "value",
  // you could parse JSON, etc. Adjust as needed.

  return (
    <div>
      <h1>Form: {form.title}</h1>
      <p>{form.description}</p>

      <h2>Answer #{answer.id}</h2>
      <p>Value: {answer.value}</p>

      {/* If you want to display all questions, you can do: */}
      <div>
        {Array.isArray(form.questions) && form.questions.map((q: QuestionData, i: number) => (
          <div key={i} style={{ marginTop: '10px' }}>
            <strong>Question:</strong> {q.title} <br />
            <em>Type:</em> {q.type}
          </div>
        ))}
      </div>
      {/* Then you could indicate which question the "answer" is tied to (answer.questionId). */}
    </div>
  );
};

export default ViewAnswer;