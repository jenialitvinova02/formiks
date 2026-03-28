import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import axios from '../../axiosInstance';
import { useTranslation } from 'react-i18next';
import './AdminPanel.scss';

type ActionType = 'makeAdmin' | 'makeUser' | 'delete' | null;

const AdminPanel: React.FC = () => {
  const { t } = useTranslation();
  const { data: users, loading, error, updateRole } = useUsers();
  const [action, setAction] = useState<ActionType>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  if (loading) return <p>{t('loading')}</p>;
  if (error) return <p>{error}</p>;

  const toggleSelection = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const cancelAction = () => {
    setAction(null);
    setSelectedIds([]);
  };

  const handleConfirm = async () => {
    if (!action || selectedIds.length === 0) return;
    try {
      if (action === 'makeAdmin') {
        await Promise.all(selectedIds.map(id => updateRole(id, 'admin')));
      } else if (action === 'makeUser') {
        await Promise.all(selectedIds.map(id => updateRole(id, 'user')));
      } else if (action === 'delete') {
        await Promise.all(selectedIds.map(id => axios.delete(`users/${id}`)));
      }
      cancelAction();
    } catch (err: any) {
      alert(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="adminPanel">
      <h1>{t('admin.title')}</h1>
      <div className="adminPanel__buttons">
        {action === null ? (
          <>
            <button onClick={() => setAction('makeAdmin')}>{t('admin.makeAdmin')}</button>
            <button onClick={() => setAction('makeUser')}>{t('admin.makeUser')}</button>
            <button onClick={() => setAction('delete')}>{t('admin.delete')}</button>
          </>
        ) : (
          <div className="adminPanel__managementButtons">
            <button onClick={handleConfirm}>{t('admin.confirm')}</button>
            <button onClick={cancelAction}>{t('admin.cancel')}</button>
          </div>
        )}
      </div>
      <p>{action !== null && t('admin.selectUsers')}</p>
      <ul className="adminPanel__userList">
        {users.map(user => (
          <li key={user.id}>
            <label>
              {action !== null && (
                <input
                  type="checkbox"
                  checked={selectedIds.includes(user.id)}
                  onChange={() => toggleSelection(user.id)}
                />
              )}
              {user.username} ({user.email}) – {user.role}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;