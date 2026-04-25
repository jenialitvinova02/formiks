import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { InlineAlert, LoadingSkeleton, TemplateList, TemplateInfo } from '../../components';
import { usePublicTemplates, PublicTemplateData } from '../../hooks';
import './GuestDashboard.scss';

export const GuestDashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: raw, loading, error } = usePublicTemplates();

  if (loading) {
    return (
      <div className="guestDashboard">
        <div className="page-title">
          <h1>{t('guestDashboard.allPublicTemplates')}</h1>
        </div>
        <div className="guestDashboard__container">
          <LoadingSkeleton rows={4} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="guestDashboard">
        <InlineAlert title="Failed to load public templates" message={error} />
      </div>
    );
  }

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
            onSelect={(id) => navigate(`/fill-template/${id}`)}
          />
        </div>
      ) : (
        <InlineAlert
          title="No public templates"
          message={t('guestDashboard.noPublicTemplates')}
        />
      )}
    </div>
  );
};

export default GuestDashboard;
