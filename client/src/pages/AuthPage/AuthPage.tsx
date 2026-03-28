import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';  
import { useTranslation } from 'react-i18next';
import AuthForm from '../../components/AuthForm/AuthForm';
import './AuthPage.scss';

const AuthPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const mode = pathname.endsWith('register') ? 'register' : 'login';

  return (
    <div className="auth">
      <div className="auth__img" />
      <div className="auth__container">
        <div className="auth__box">
          <h1 className="auth__box--title">
            {mode === 'login' ? t('auth.signIn') : t('auth.register')}
          </h1>

          <div className="auth__box--form">
            <AuthForm
              mode={mode as 'login' | 'register'}
              onSuccess={() => navigate('/dashboard')}
            />
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