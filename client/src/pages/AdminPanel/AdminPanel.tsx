import React from 'react';
import { useUsers } from '../../hooks/useUsers';
import UserList from '../../components/UserList/UserList';

const AdminPanel: React.FC = () => {
  const { data: users, loading, error, updateRole } = useUsers();
  if (loading) return <p>Loading…</p>;
  if (error)   return <p>Error: {error}</p>;
  return <UserList items={users} onRoleChange={updateRole} />;
};

export default AdminPanel;