import { useState, useEffect, useCallback } from 'react';
import { useProfile } from './useProfile';

export type ProfileFormFields = {
  username: string;
  email: string;
};

export function useEditableProfile() {
  const { data, update, loading, error } = useProfile();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileFormFields>({ username: '', email: '' });

  // При загрузке профиля и изменении data инициализируем форму
  useEffect(() => {
    if (data) {
      setForm({ username: data.username, email: data.email });
    }
  }, [data]);

  const onChangeField = useCallback(
    (field: keyof ProfileFormFields, value: string) => {
      setForm(prev => ({ ...prev, [field]: value }));
    },
    []
  );

  const saveProfile = useCallback(async () => {
    await update(form);
    setEditing(false);
  }, [form, update]);

  const startEditing = useCallback(() => {
    if (data) {
      setForm({ username: data.username, email: data.email });
      setEditing(true);
    }
  }, [data]);

  const cancelEditing = useCallback(() => setEditing(false), []);

  return { form, onChangeField, saveProfile, startEditing, cancelEditing, editing, loading, error };
}