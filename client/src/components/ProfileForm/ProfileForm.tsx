import React from 'react';
import { useTranslation } from 'react-i18next';
import { useEditableProfile } from '../../hooks';
import { InlineAlert, LoadingSkeleton } from '../../components';
import './ProfileForm.scss';

export const ProfileForm: React.FC = () => {
  const { t } = useTranslation();
  const {
    form,
    onChangeField,
    saveProfile,
    startEditing,
    cancelEditing,
    editing,
    loading,
    error,
  } = useEditableProfile();

  if (loading) {
    return (
      <div className="profileForm">
        <div className="page-title">
          <h1>{t('profileForm.profile')}</h1>
        </div>
        <div className="profileForm__container">
          <LoadingSkeleton rows={2} />
        </div>
      </div>
    );
  }

  if (error || !form) {
    return (
      <InlineAlert
        title="Failed to load profile"
        message={error || t('profileForm.error')}
      />
    );
  }

  return editing ? (
    <div className="profileEdit">
      <div className="page-title">
        <h1>{t('profileForm.editProfile')}</h1>
      </div>
      <div className="profileEdit__container">
        <div className="profileEdit__container--inputs">
          <label>{t('profileForm.username')}</label>
          <input
            value={form.username}
            onChange={(e) => onChangeField('username', e.target.value)}
          />
          <label>{t('profileForm.email')}</label>
          <input
            value={form.email}
            onChange={(e) => onChangeField('email', e.target.value)}
          />
        </div>
        <div className="profileEdit__container--buttons">
          <button onClick={saveProfile}>{t('profileForm.save')}</button>
          <button onClick={cancelEditing}>{t('profileForm.cancel')}</button>
        </div>
      </div>
    </div>
  ) : (
    <div className="profileForm">
      <div className="page-title">
        <h1>{t('profileForm.profile')}</h1>
      </div>
      <div className="profileForm__container">
        <p>
          {t('profileForm.username')}: {form.username}
        </p>
        <p>
          {t('profileForm.email')}: {form.email}
        </p>
        <button
          className="profileForm__container--button"
          onClick={startEditing}
        >
          {t('profileForm.edit')}
        </button>
      </div>
    </div>
  );
};

export default ProfileForm;
