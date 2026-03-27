import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';  // ← добавили Link
import AuthForm from '../../components/AuthForm/AuthForm';
import './AuthPage.scss';

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const mode = pathname.endsWith('register') ? 'register' : 'login';

  return (
    <div className="auth">
      {/* Левая колонка — фон-картинка */}
      <div className="auth__img" />

      {/* Правая колонка — контейнер формы */}
      <div className="auth__container">
        <div className="auth__box">
          <h1 className="auth__box--title">
            {mode === 'login' ? 'Sign In' : 'Register'}
          </h1>

          <div className="auth__box--form">
            <AuthForm
              mode={mode as 'login' | 'register'}
              onSuccess={() => navigate('/dashboard')}
            />
          </div>

          {/* переключатель режимов */}
          <div className="auth__box--toggle">
            {mode === 'login' ? (
              <p>
                Don't have an account?{' '}
                <Link to="/register">Register here</Link>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <Link to="/login">Sign In here</Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;