import { useState, useCallback } from 'react';

export type Mode = 'normal' | 'delete' | 'edit';

export function useFormAnswersActions() {
  const [mode, setMode] = useState<Mode>('normal');
  const [selectedDelete, setSelectedDelete] = useState<number[]>([]);
  const [selectedEdit, setSelectedEdit] = useState<number | null>(null);

  const toggleDeleteSelection = useCallback((id: number) => {
    setSelectedDelete((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }, []);

  const enterDeleteMode = useCallback(() => {
    setMode('delete');
    setSelectedDelete([]);
  }, []);

  const enterEditMode = useCallback(() => {
    setMode('edit');
    setSelectedEdit(null);
  }, []);

  const cancelAction = useCallback(() => {
    setMode('normal');
    setSelectedDelete([]);
    setSelectedEdit(null);
  }, []);

  return {
    mode,
    setMode,
    selectedDelete,
    selectedEdit,
    toggleDeleteSelection,
    enterDeleteMode,
    enterEditMode,
    cancelAction,
    setSelectedEdit,
  };
}
