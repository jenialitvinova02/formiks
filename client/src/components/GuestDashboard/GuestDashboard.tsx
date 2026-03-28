import React, { useMemo } from 'react';
import { TemplateList, TemplateInfo } from '../../components';
import { usePublicTemplates, TemplateData } from '../../hooks';

const GuestDashboard: React.FC = () => {
  const rawItems: TemplateData[] = usePublicTemplates();

  const items: TemplateInfo[] = useMemo(
    () =>
      rawItems.map((t) => ({
        id: Number(t.id),
        title: t.name,
        description: t.description,
      })),
    [rawItems],
  );

  return (
    <TemplateList
      items={items}
      onSelect={() => {
        /* ... */
      }}
    />
  );
};

export default GuestDashboard;
