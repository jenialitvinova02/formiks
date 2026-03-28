import React, { useMemo } from 'react';
import { TemplateList, TemplateInfo } from '../../components';
import { usePublicTemplates, PublicTemplateData } from '../../hooks';

const GuestDashboard: React.FC = () => {
  const rawItems: PublicTemplateData[] = usePublicTemplates();

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
      onSelect={() => {
        /* ... */
      }}
    />
  );
};

export default GuestDashboard;
