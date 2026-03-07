import React, { useState, useEffect } from 'react';
import axios from '../../axiosInstance';

const AdminPanel: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Получаем всех пользователей – на сервере должен быть маршрут только для администраторов
    axios.get('users')
      .then(res => setUsers(res.data))
      .catch(err => setError('Failed to load users'));
  }, []);

  const handleMakeAdmin = (userId: number) => {
    // Пример запроса для изменения роли
    axios.put(`users/${userId}`, { role: 'admin' })
      .then(res => {
        // Обновляем список пользователей
        setUsers(prev => prev.map(u => u.id === userId ? res.data : u));
      })
      .catch(err => setError('Failed to update role'));
  };

  const handleRevokeAdmin = (userId: number) => {
    axios.put(`users/${userId}`, { role: 'user' })
      .then(res => {
        setUsers(prev => prev.map(u => u.id === userId ? res.data : u));
      })
      .catch(err => setError('Failed to update role'));
  };

  return (
    <div>
      <h1>Admin Panel</h1>
      {error && <p>{error}</p>}
      <h2>All Users</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            {user.username} ({user.email}) – Role: {user.role}
            {user.role !== 'admin' ? (
              <button onClick={() => handleMakeAdmin(user.id)}>Make Admin</button>
            ) : (
              <button onClick={() => handleRevokeAdmin(user.id)}>Revoke Admin</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;