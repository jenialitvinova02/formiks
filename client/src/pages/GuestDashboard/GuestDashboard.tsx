import React from 'react';
import { useTranslation } from 'react-i18next';
import { TemplateList, TemplateInfo } from '../../components';
import { usePublicTemplates, TemplateData } from '../../hooks';

export const GuestDashboard: React.FC = () => {
  const { t } = useTranslation();
  const raw = usePublicTemplates();
  const items: TemplateInfo[] = raw.map((t: TemplateData) => ({
    id: Number(t.id),
    title: t.name,
    description: t.description,
  }));

  return (
    <div>
      <h1>{t('guestDashboard.allPublicTemplates')}</h1>
      {items.length > 0 ? (
        <TemplateList
          items={items}
          onSelect={() => {
            /**/
          }}
        />
      ) : (
        <p>{t('guestDashboard.noPublicTemplates')}</p>
      )}
    </div>
  );
};

export default GuestDashboard;
