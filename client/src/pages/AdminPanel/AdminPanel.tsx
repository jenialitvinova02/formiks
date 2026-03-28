import React from 'react';
import { useUsers } from '../../hooks/useUsers';
import { useTranslation } from 'react-i18next';
import { useAdminPanel } from '../../hooks/useAdminPanel';
import { ADMIN_ACTIONS } from '../../constants/adminActions';
import './AdminPanel.scss';


const AdminPanel: React.FC = () => {
  const { t } = useTranslation();
  const { data: users, loading, error, updateRole } = useUsers();
  const { action, setAction, selectedIds, toggleSelection, cancelAction, handleConfirm } =
    useAdminPanel({ updateRole });

  if (loading) return <p>{t('loading')}</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="adminPanel">
      <h1>{t('admin.title')}</h1>
      <div className="adminPanel__buttons">
        {action === null ? (
          <>
            <button onClick={() => setAction(ADMIN_ACTIONS.MAKE_ADMIN)}>{t('admin.makeAdmin')}</button>
            <button onClick={() => setAction(ADMIN_ACTIONS.MAKE_USER)}>{t('admin.makeUser')}</button>
            <button onClick={() => setAction(ADMIN_ACTIONS.DELETE)}>{t('admin.delete')}</button>
          </>
        ) : (
          <div className="adminPanel__managementButtons">
            <button onClick={handleConfirm}>{t('admin.confirm')}</button>
            <button onClick={cancelAction}>{t('admin.cancel')}</button>
          </div>
        )}
      </div>
      {action !== null && <p>{t('admin.selectUsers')}</p>}
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