import React, { useState, useEffect } from 'react';
import axios from '../../axiosInstance';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('users/me')
      .then(res => {
        setUser(res.data);
        setFormData({ username: res.data.username, email: res.data.email });
      })
      .catch(err => setError('Failed to load user data'));
  }, []);

  const handleSave = () => {
    axios.put('users/me', formData)
      .then(res => {
        setUser(res.data);
        setEditing(false);
      })
      .catch(err => setError('Failed to update profile'));
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div>
      <h1>Profile</h1>
      {error && <p>{error}</p>}
      {editing ? (
        <div>
          <input 
            type="text" 
            value={formData.username} 
            onChange={e => setFormData({...formData, username: e.target.value})} 
          />
          <input 
            type="email" 
            value={formData.email} 
            onChange={e => setFormData({...formData, email: e.target.value})} 
          />
          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <p>Username: {user.username}</p>
          <p>Email: {user.email}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      )}
    </div>
  );
};

export default Profile;