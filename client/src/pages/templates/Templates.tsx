import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTemplates } from '../../hooks/useTemplates';
import TemplateList, { TemplateInfo } from '../../components/TemplateList/TemplateList';

const Templates: React.FC = () => {
  const { data: templates, loading, error } = useTemplates();
  const navigate = useNavigate();

  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error}</p>;

  // Явно мапим поля из TemplateData в TemplateInfo
  const items: TemplateInfo[] = templates.map(t => ({
    id: t.id,
    title: t.title,
    description: t.description,
  }));

  return (
    <div>
      <h1>My Templates</h1>
      {items.length > 0 ? (
        <TemplateList
          items={items}
          onSelect={id => navigate(`/templates/${id}/answers`)}
        />
      ) : (
        <p>No templates found</p>
      )}
    </div>
  );
};

export default Templates;