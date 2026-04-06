import { useState, useCallback } from 'react';
import axios from '../axiosInstance';
import { ADMIN_ACTIONS, AdminAction } from '../constants/adminActions';
import { pushNotification, useAppDispatch } from '../store';

interface UseAdminPanelProps {
  updateRole: (id: number, role: string) => Promise<void>;
}

export function useAdminPanel({ updateRole }: UseAdminPanelProps) {
  const dispatch = useAppDispatch();
  const [action, setAction] = useState<AdminAction>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleSelection = useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
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
        await Promise.all(selectedIds.map((id) => updateRole(id, 'admin')));
      } else if (action === ADMIN_ACTIONS.MAKE_USER) {
        await Promise.all(selectedIds.map((id) => updateRole(id, 'user')));
      } else if (action === ADMIN_ACTIONS.DELETE) {
        await Promise.all(selectedIds.map((id) => axios.delete(`users/${id}`)));
      }
      dispatch(
        pushNotification({
          type: 'success',
          message: 'Admin action completed successfully.',
        }),
      );
      cancelAction();
    } catch (err: any) {
      dispatch(
        pushNotification({
          type: 'error',
          message: err.response?.data?.error || err.message,
        }),
      );
    }
  }, [action, selectedIds, updateRole, cancelAction, dispatch]);

  return {
    action,
    setAction,
    selectedIds,
    toggleSelection,
    cancelAction,
    handleConfirm,
  };
}
