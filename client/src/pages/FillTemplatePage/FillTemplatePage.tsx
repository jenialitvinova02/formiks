import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuestions } from '../../hooks/useQuestions';
import FieldInput from '../../components/FieldInput/FieldInput';
import axios from '../../axiosInstance';


const FillTemplatePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { questions, loading, error } = useQuestions(id || '');
  const [answers, setAnswers] = useState<Record<number,string>>({});
  const [submitError, setSubmitError] = useState<string|null>(null);

  const handleChange = (qid: number, val: string|boolean) =>
    setAnswers(prev => ({ ...prev, [qid]: String(val) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`responses/from-template/${id}`, { answers });
      navigate('/dashboard');
    } catch (e: any) {
      setSubmitError(e.response?.data?.error || e.message);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <form onSubmit={handleSubmit}>
      {questions.map(q => (
        <div key={q.id} className="form-group">
          <label>{q.title}</label>
          <FieldInput
            question={q}
            value={answers[q.id] || ''}
            onChange={handleChange}
          />
        </div>
      ))}
      {submitError && <p className="error">{submitError}</p>}
      <button type="submit">Submit</button>
    </form>
  );
};

export default FillTemplatePage;