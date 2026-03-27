import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { useTemplates, TemplateData } from '../../hooks/useTemplates';
import TemplateCard from '../../components/TemplateCard/TemplateCard';
import SortableItem from '../../components/SortableItem/SortableItem';
import './DashboardPage.scss';

const DashboardPage: React.FC = () => {
    const { data: templates, loading, error } = useTemplates();
    const [items, setItems] = useState<TemplateData[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        setItems(templates);
    }, [templates]);

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;
        const oldIndex = items.findIndex(item => item.id.toString() === active.id);
        const newIndex = items.findIndex(item => item.id.toString() === over.id);
        setItems(arrayMove(items, oldIndex, newIndex));
    };

    if (loading) return <p>Loading…</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map(item => item.id.toString())} strategy={horizontalListSortingStrategy}>
                    <div className="dashboard__container" style={{ display: 'flex' }}>
                        {items.map(t => (
                            <SortableItem key={t.id} id={t.id.toString()}>
                                <TemplateCard
                                    title={t.title}
                                    description={t.description}
                                    topic={t.topic}
                                    onClick={() => navigate(`/fill-template/${t.id}`)}
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