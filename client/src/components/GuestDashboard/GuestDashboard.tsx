import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TemplateList, TemplateInfo } from '../../components';
import { usePublicTemplates } from '../../hooks';

const GuestDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: rawItems } = usePublicTemplates();

  const items: TemplateInfo[] = useMemo(
    () =>
      rawItems.map((t) => ({
        id: Number(t.id),
        title: t.title,
        description: t.description,
      })),
    [rawItems],
  );

  return (
    <TemplateList
      items={items}
      onSelect={(id) => navigate(`/fill-template/${id}`)}
    />
  );
};

export default GuestDashboard;
