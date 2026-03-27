import React from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';

interface SortableItemProps {
    id: number | string;
    children: React.ReactNode;
}

const SortableItem: React.FC<SortableItemProps> = ({ id, children }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        margin: '0 8px',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <div style={{ position: 'relative' }}>
                {/* Иконка-драг внутри карточки */}
                <div
                    {...listeners}
                    style={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        cursor: 'grab',
                        zIndex: 2,
                        backgroundColor: 'rgba(255,255,255,0.7)',
                        padding: '2px 4px',
                        borderRadius: '4px',
                    }}
                >
                    ≡
                </div>
                {children}
            </div>
        </div>
    );
};

export default SortableItem;