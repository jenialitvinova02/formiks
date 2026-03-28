import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthForm } from '../../components';
import { useAuthMode } from '../../hooks';
import './AuthPage.scss';

export const AuthPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const mode = useAuthMode();

  return (
    <div className="auth">
      <div className="auth__img" />
      <div className="auth__container">
        <div className="auth__box">
          <h1 className="auth__box--title">
            {mode === 'login' ? t('auth.signIn') : t('auth.register')}
          </h1>

          <div className="auth__box--form">
            <AuthForm mode={mode} onSuccess={() => navigate('/dashboard')} />
          </div>
          <div className="auth__box--toggle">
            {mode === 'login' ? (
              <p>
                {t('auth.dontHaveAccount')}{' '}
                <Link to="/register">{t('auth.registerHere')}</Link>
              </p>
            ) : (
              <p>
                {t('auth.alreadyHaveAccount')}{' '}
                <Link to="/login">{t('auth.signInHere')}</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
