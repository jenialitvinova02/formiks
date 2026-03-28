import React, { useState } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { useTranslation } from 'react-i18next';
import './ProfileForm.scss';

const ProfileForm: React.FC = () => {
  const { t } = useTranslation();
  const { data, loading, error, update } = useProfile();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: '', email: '' });

  if (loading) return <p>{t('profileForm.loading')}</p>;
  if (error || !data) return <p>{error || t('profileForm.error')}</p>;

  const save = async () => {
    try {
      await update(form);
      setEditing(false);
    } catch {
    }
  };

  return editing ? (
    <div className="profileEdit">
      <h1>{t('profileForm.editProfile')}</h1>
      <div className="profileEdit__container">
        <div className="profileEdit__container--inputs">
          <label>{t('profileForm.username')}</label>
          <input
            value={form.username || data.username}
            onChange={e => setForm({ ...form, username: e.target.value })}
          />
          <label>{t('profileForm.email')}</label>
          <input
            value={form.email || data.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
        </div>
        <div className="profileEdit__container--buttons">
          <button onClick={save}>{t('profileForm.save')}</button>
          <button onClick={() => setEditing(false)}>{t('profileForm.cancel')}</button>
        </div>
      </div>
    </div>
  ) : (
    <div className="profileForm">
      <h1>{t('profileForm.profile')}</h1>
      <div className="profileForm__container">
        <p>{t('profileForm.username')}: {data.username}</p>
        <p>{t('profileForm.email')}: {data.email}</p>
        <button
          className="profileForm__container--button"
          onClick={() => {
            setForm({ username: data.username, email: data.email });
            setEditing(true);
          }}
        >
          {t('profileForm.edit')}
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;