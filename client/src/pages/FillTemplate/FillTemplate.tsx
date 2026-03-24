import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../axiosInstance';

interface Question {
  id: number;
  title: string;
  description: string;
  type: string;
}

interface TemplateData {
  id: number;
  title: string;
  description: string;
  topic: string;
}

const FillTemplate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [templateData, setTemplateData] = useState<TemplateData | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`templates/${id}`)
      .then(res => setTemplateData(res.data))
      .catch(err => setError('Не удалось загрузить шаблон: ' + (err.response?.data?.error || err.message)));

    axios.get(`questions/template/${id}`)
      .then(res => setQuestions(res.data))
      .catch(err => console.error('Error fetching questions:', err));
  }, [id]);

  const handleChange = (questionId: number, e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setAnswers({ ...answers, [questionId]: e.target.value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    axios.post(`responses/from-template/${id}`, { answers })
      .then(() => {
        setSubmitted(true);
        navigate('/dashboard');
      })
      .catch(err => setError('Не удалось отправить ответы: ' + (err.response?.data?.error || err.message)));
  };

  if (error) return <p>{error}</p>;
  if (!templateData) return <p>Загрузка шаблона…</p>;
  if (submitted) return <p>Ответы успешно отправлены!</p>;

  return (
    <div>
      <h1>{templateData.title}</h1>
      <p>{templateData.description}</p>
      <form onSubmit={handleSubmit}>
        {questions.map(q => (
          <div key={q.id}>
            <label>{q.title}</label>
            {q.type === 'text' && <input type="text" required onChange={e => handleChange(q.id, e)} />}
            {q.type === 'integer' && <input type="number" required onChange={e => handleChange(q.id, e)} />}
            {q.type === 'checkbox' && (
              <input
                type="checkbox"
                onChange={e =>
                  handleChange(q.id, {
                    ...e,
                    target: { ...e.target, value: e.target.checked ? 'true' : 'false' }
                  } as any)
                }
              />
            )}
          </div>
        ))}
        <button type="submit">Отправить ответы</button>
      </form>
    </div>
  );
};

export default FillTemplate;