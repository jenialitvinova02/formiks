import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemplates } from '../../hooks/useTemplates';
import TemplateCard from '../../components/TemplateCard/TemplateCard';
import './DashboardPage.scss';

const DashboardPage: React.FC = () => {
  const { data: templates, loading, error } = useTemplates();
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {templates.length > 0 ? (
        <div className="dashboard__container">
          {templates.map(t => (
            <TemplateCard
              key={t.id}
              title={t.title}
              description={t.description}
              topic={t.topic}
              onClick={() => navigate(`/fill-template/${t.id}`)}
            />
          ))}
        </div>
      ) : (
        <p>No templates available.</p>
      )}
    </div>
  );
};

export default DashboardPage;