import React, { useCallback } from 'react';
import { useAuth, useTheme, useLanguage, useInput } from '../../hooks';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../../constants';
import { pushNotification, useAppDispatch } from '../../store';
import './AuthForm.scss';

interface Props {
  mode: 'login' | 'register';
  onSuccess: () => void;
}

export const AuthForm: React.FC<Props> = ({ mode, onSuccess }) => {
  const { t } = useTranslation();
  const { login, register, error, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { currentLanguage, changeLanguage } = useLanguage();
  const dispatch = useAppDispatch();

  const emailInput = useInput('');
  const passwordInput = useInput('');
  const usernameInput = useInput('');
  const [validationError, setValidationError] = React.useState<string | null>(
    null,
  );

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setValidationError(null);

      if (!emailInput.value.includes('@')) {
        setValidationError('Please enter a valid email address.');
        return;
      }

      if (passwordInput.value.length < 6) {
        setValidationError('Password must be at least 6 characters long.');
        return;
      }

      if (mode === 'register' && usernameInput.value.trim().length < 2) {
        setValidationError('Username must be at least 2 characters long.');
        return;
      }

      try {
        if (mode === 'login') {
          await login(emailInput.value, passwordInput.value);
        } else {
          await register(usernameInput.value, emailInput.value, passwordInput.value);
        }
        dispatch(
          pushNotification({
            type: 'success',
            message: mode === 'login' ? 'Signed in successfully.' : 'Account created successfully.',
          }),
        );
        onSuccess();
      } catch {
        return;
      }
    },
    [
      mode,
      emailInput.value,
      passwordInput.value,
      usernameInput.value,
      login,
      register,
      onSuccess,
      dispatch,
    ],
  );

  return (
    <form className="authForm" onSubmit={submit}>
      {mode === 'register' && (
        <input
          placeholder={t('authForm.username')}
          value={usernameInput.value}
          onChange={usernameInput.onChange}
          required
        />
      )}
      <input
        type="email"
        placeholder={t('authForm.email')}
        value={emailInput.value}
        onChange={emailInput.onChange}
        required
      />
      <input
        type="password"
        placeholder={t('authForm.password')}
        value={passwordInput.value}
        onChange={passwordInput.onChange}
        required
      />
      {validationError && <p className="error">{validationError}</p>}
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
          onChange={(e) => changeLanguage(e.target.value)}
          value={currentLanguage}
        >
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.label}
            </option>
          ))}
        </select>
        <button type="button" onClick={toggleTheme}>
          {theme === 'dark' ? t('authForm.lightMode') : t('authForm.darkMode')}
        </button>
      </div>
    </form>
  );
};

export default AuthForm;
