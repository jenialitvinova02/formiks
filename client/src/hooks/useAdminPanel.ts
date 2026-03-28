import { useState, useCallback } from 'react';
import axios from '../axiosInstance';
import { ADMIN_ACTIONS, AdminAction } from '../constants/adminActions';

interface UseAdminPanelProps {
  updateRole: (id: number, role: string) => Promise<void>;
}

export function useAdminPanel({ updateRole }: UseAdminPanelProps) {
  const [action, setAction] = useState<AdminAction>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  }, []);

  const cancelAction = useCallback(() => {
    setAction(null);
    setSelectedIds([]);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!action || selectedIds.length === 0) return;
    try {
      if (action === ADMIN_ACTIONS.MAKE_ADMIN) {
        await Promise.all(selectedIds.map(id => updateRole(id, 'admin')));
      } else if (action === ADMIN_ACTIONS.MAKE_USER) {
        await Promise.all(selectedIds.map(id => updateRole(id, 'user')));
      } else if (action === ADMIN_ACTIONS.DELETE) {
        await Promise.all(selectedIds.map(id => axios.delete(`users/${id}`)));
      }
      cancelAction();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  }, [action, selectedIds, updateRole, cancelAction]);

  return { action, setAction, selectedIds, toggleSelection, cancelAction, handleConfirm };
}