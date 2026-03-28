import { useState, useEffect, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { TemplateData } from './useTemplates';

export function useSortableItems(initialItems: TemplateData[]) {
  const [items, setItems] = useState<TemplateData[]>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleDragEnd = useCallback((event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex(item => item.id.toString() === String(active.id));
    const newIndex = items.findIndex(item => item.id.toString() === String(over.id));
    setItems(arrayMove(items, oldIndex, newIndex));
  }, [items]);

  return { items, setItems, handleDragEnd };
}