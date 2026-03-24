import React, { useEffect, useState } from 'react';
import axios from '../../axiosInstance';
import { useNavigate } from 'react-router-dom';
import './dashboard.scss';

interface TemplateData {
  id: number;
  title: string;
  description: string;
  topic: string;
  createdAt: string;
}

const Dashboard: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        // Получаем все шаблоны (если пользователь не админ, можно изменить запрос на /api/templates/user)
        const response = await axios.get('templates');
        setTemplates(response.data);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to fetch templates');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p>Welcome! Here are the available templates for filling.</p>
      {templates.length > 0 ? (
        <div className="form-cards-container">
          {templates.map(template => (
            <div
              className="form-card"
              key={template.id}
              onClick={() => navigate(`/fill-template/${template.id}`)} // Пример Dashboard карточки для заполнения шаблона
            >
              <h3>{template.title}</h3>
              <p>{template.description}</p>
              <p>Topic: {template.topic}</p>
              {/* Можно добавить количество ответов, если эта информация доступна */}
            </div>
          ))}
        </div>
      ) : (
        <p>No templates available.</p>
      )}
    </div>
  );
};

export default Dashboard;