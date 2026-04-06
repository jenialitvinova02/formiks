import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { useTemplates, useSortableItems } from '../../hooks';
import {
  InlineAlert,
  LoadingSkeleton,
  TemplateCard,
  SortableItem,
} from '../../components';
import { useTranslation } from 'react-i18next';
import { TemplateData } from '../../hooks/useTemplates';
import './DashboardPage.scss';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: templates, loading, error } = useTemplates();
  const navigate = useNavigate();

  const { items, handleDragEnd } = useSortableItems(templates);

  useEffect(() => {}, [templates]);

  if (loading) {
    return (
      <div className="dashboard">
        <section className="dashboard__hero">
          <div className="page-title">
            <h1>{t('dashboard.title')}</h1>
          </div>
        </section>
        <div className="dashboard__container">
          <LoadingSkeleton rows={4} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <InlineAlert
          title="Failed to load dashboard"
          message={t('dashboard.error', { error })}
        />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <section className="dashboard__hero">
        <div className="page-title">
          <h1>{t('dashboard.title')}</h1>
          <p>Browse templates, reorder priorities and launch form flows faster.</p>
        </div>
      </section>
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={items.map((item) => item.id.toString())}
          strategy={horizontalListSortingStrategy}
        >
          <div className="dashboard__container">
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
