import React from 'react';
import TemplateList, { TemplateInfo } from '../../components/TemplateList/TemplateList';
import { usePublicTemplates, TemplateData } from '../../hooks/usePublicTemplates';

const GuestDashboard: React.FC = () => {
  const rawItems: TemplateData[] = usePublicTemplates();

  const items: TemplateInfo[] = rawItems.map(t => ({
    id: Number(t.id),
    title: t.name,
    description: t.description,
  }));

  return <TemplateList items={items} onSelect={() => { /* ... */ }} />;
};

export default GuestDashboard;