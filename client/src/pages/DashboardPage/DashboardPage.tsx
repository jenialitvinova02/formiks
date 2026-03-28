import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useTemplates, TemplateData } from '../../hooks/useTemplates';
import TemplateCard from '../../components/TemplateCard/TemplateCard';
import SortableItem from '../../components/SortableItem/SortableItem';
import { useTranslation } from 'react-i18next';
import { useSortableItems } from '../../hooks/useSortableItems';
import './DashboardPage.scss';

const containerStyle: React.CSSProperties = {
  display: 'flex',
};

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: templates, loading, error } = useTemplates();
  const navigate = useNavigate();

  const { items, handleDragEnd } = useSortableItems(templates);

  useEffect(() => {
  }, [templates]);

  if (loading) return <p>{t('dashboard.loading')}</p>;
  if (error) return <p>{t('dashboard.error', { error })}</p>;

  return (
    <div className="dashboard">
      <h1>{t('dashboard.title')}</h1>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map(item => item.id.toString())} strategy={horizontalListSortingStrategy}>
          <div className="dashboard__container" style={containerStyle}>
            {items.map((tmpl: TemplateData) => (
              <SortableItem key={tmpl.id} id={tmpl.id.toString()}>
                <TemplateCard
                  title={tmpl.title}
                  description={tmpl.description}
                  topic={tmpl.topic}
                  onClick={() => navigate(`/fill-template/${tmpl.id}`)}
                />
              </SortableItem>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default DashboardPage;