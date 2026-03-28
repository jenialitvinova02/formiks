import React, { useState } from 'react';
import { useUsers } from '../../hooks/useUsers';
import axios from '../../axiosInstance';
import './AdminPanel.scss';

type ActionType = 'makeAdmin' | 'makeUser' | 'delete' | null;

const AdminPanel: React.FC = () => {
  const { data: users, loading, error, updateRole } = useUsers();
  const [action, setAction] = useState<ActionType>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  if (loading) return <p>Loading…</p>;
  if (error) return <p>Error: {error}</p>;

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
      <h1>Admin Panel</h1>
      {/* Панель действий всегда сверху */}
      {action === null ? (
        <div className="adminPanel__buttons">
          <button onClick={() => setAction('makeAdmin')}>Сделать админом</button>
          <button onClick={() => setAction('makeUser')}>Сделать пользователем</button>
          <button onClick={() => setAction('delete')}>Удалить</button>
        </div>
      ) : (
        <div className="adminPanel__managementButtons">
          <button onClick={handleConfirm}>Подтвердить</button>
          <button onClick={cancelAction}>Отмена</button>
        </div>
      )}

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