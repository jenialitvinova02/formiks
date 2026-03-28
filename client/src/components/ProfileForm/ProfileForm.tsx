import React, { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import './ProfileForm.scss';

const ProfileForm: React.FC = () => {
  const { data, loading, error, update } = useProfile();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: '', email: '' });

  if (loading) return <p>Loading…</p>;
  if (error || !data) return <p>{error || 'Error'}</p>;

  const save = async () => {
    try {
      await update(form);
      setEditing(false);
    } catch {
    }
  };

  return editing ? (
    <div className='profileEdit'>
    <h1>Edit Profile</h1>
    <div className='profileEdit__container'>
      <div className='profileEdit__container--inputs'>
        <input
          value={form.username || data.username}
          onChange={e => setForm({ ...form, username: e.target.value })}
        />
        <input
          value={form.email || data.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div className='profileEdit__container--buttons'>
        <button onClick={save}>Save</button>
        <button onClick={() => setEditing(false)}>Cancel</button>
      </div>
    </div>
    </div>


  ) : (
    <div className='profileForm'>
          <h1>Profile</h1>
    <div className='profileForm__container'>
      <p>Username: {data.username}</p>
      <p>Email: {data.email}</p>
      <button className='profileForm__container--button' onClick={() => {
        setForm({ username: data.username, email: data.email });
        setEditing(true);
      }}>Edit</button>
    </div>
    </div>

  );
};

export default ProfileForm;