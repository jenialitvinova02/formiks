import React from 'react';
import { useUsers } from '../../hooks/useUsers';
import UserList from '../../components/UserList/UserList';
import './AdminPanel.scss';

const AdminPanel: React.FC = () => {
  const { data: users, loading, error, updateRole } = useUsers();
  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error}</p>;

  return (
    <div>
      <h1>Admin Panel</h1>
      <div className="userList">
      <UserList items={users} onRoleChange={updateRole} />
    </div>
    </div>

  );
};

export default AdminPanel;