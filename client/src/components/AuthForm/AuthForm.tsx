import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useTranslation } from 'react-i18next';
import './AuthForm.scss';

interface Props {
  mode: 'login' | 'register';
  onSuccess: () => void;
}

const AuthForm: React.FC<Props> = ({ mode, onSuccess }) => {
  const { t, i18n } = useTranslation();
  const { login, register, error, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'login') await login(email, password);
      else await register(username, email, password, isAdmin ? 'admin' : 'user');
      onSuccess();
    } catch {}
  };

  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'dark' ? 'light' : 'dark';
      if (newTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'white');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      return newTheme;
    });
  };

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <form className="authForm" onSubmit={submit}>
      {mode === 'register' && (
        <input
          placeholder={t('authForm.username')}
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
      )}
      <input
        type="email"
        placeholder={t('authForm.email')}
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder={t('authForm.password')}
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {mode === 'register' && (
        <label className="authForm__check">
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={e => setIsAdmin(e.target.checked)}
          />{' '}
          {t('authForm.admin')}
        </label>
      )}
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading
          ? t('authForm.pleaseWait')
          : mode === 'login'
            ? t('authForm.login')
            : t('authForm.register')}
      </button>
      <div className="authForm__controls">
          <select
            onChange={e => changeLanguage(e.target.value)}
            value={i18n.language}
            className="authForm__controls--language"
          >
            <option value="en">EN</option>
            <option value="ru">RU</option>
            <option value="pl">PL</option>
          </select>
          <button className="authForm__controls--theme" type="button" onClick={toggleTheme}>
            {theme === 'dark' ? t('authForm.lightMode') : t('authForm.darkMode')}
          </button>
        </div>
    </form>
  );
};

export default AuthForm;