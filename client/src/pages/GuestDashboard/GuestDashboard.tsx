import React from 'react';
import { useTranslation } from 'react-i18next';
import { TemplateList, TemplateInfo } from '../../components';
import { usePublicTemplates, PublicTemplateData } from '../../hooks';
import './GuestDashboard.scss';

export const GuestDashboard: React.FC = () => {
  const { t } = useTranslation();
  const raw = usePublicTemplates();

  console.log('GuestDashboard: raw templates:', raw);

  const items: TemplateInfo[] = raw.map((t: PublicTemplateData) => ({
    id: Number(t.id),
    title: t.title,
    description: t.description,
  }));

  return (
    <div className="guestDashboard">
      <div className="page-title">
        <h1>{t('guestDashboard.allPublicTemplates')}</h1>
      </div>
      {items.length > 0 ? (
        <div className="guestDashboard__container">
          <TemplateList
            items={items}
            onSelect={(id) => {
              console.log('Template selected:', id);
            }}
          />
        </div>
      ) : (
        <p>{t('guestDashboard.noPublicTemplates')}</p>
      )}
    </div>
  );
};

export default GuestDashboard;
