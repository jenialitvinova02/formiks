import React, { useState, useEffect } from 'react';
import axios from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';

const Templates: React.FC = () => {
  const [templates, setTemplates] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Запрашиваем шаблоны автора (если обычный пользователь)
    // или все шаблоны (если администратор)
    axios.get('templates')
      .then(res => setTemplates(res.data))
      .catch(err => {
        console.error(err);
        setError('Failed to load templates');
      });
  }, []);

  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>My Templates</h1>
      {templates.length > 0 ? (
        <ul>
          {templates.map(template => (
            <li
              key={template.id}
              onClick={() => navigate(`/templates/${template.id}/answers`)}
              style={{ cursor: 'pointer', margin: '8px 0' }}
            >
              {template.title} - {template.description}
              {/* Можно отобразить количество ответов, если ответов включено в данные */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No templates found</p>
      )}
    </div>
  );
};

export default Templates;