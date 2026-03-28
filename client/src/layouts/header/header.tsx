import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './header.scss';
import Logo from '../../assets/logo.png';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem('token');
  const isGuest = localStorage.getItem('guest') === 'true';
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('guest');
    navigate('/login');
  };

  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'white');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="header">
      <img className="header__logo" src={Logo} alt="Logo" />
      <nav className="header__links">
        <Link to={token || isGuest ? "/dashboard" : "/login"}>{t('header.dashboard')}</Link>
        {!(isGuest) && (
          <>
            <Link to="/templates">{t('header.myTemplates')}</Link>
            <Link to="/create-template">{t('header.createTemplate')}</Link>
          </>
        )}
        {token ? (
          <Link to="/profile">{t('header.profile')}</Link>
        ) : (
          <Link to="/login">{t('header.login')}</Link>
        )}
        {token && JSON.parse(atob(token.split('.')[1])).role === 'admin' && (
          <Link to="/admin">Admin</Link>
        )}
      </nav>
      <div className="header__right">
      <select onChange={(e) => changeLanguage(e.target.value)} defaultValue={i18n.language}>
          <option value="en">EN</option>
          <option value="ru">RU</option>
          <option value="pl">PL</option>
        </select>
        <button onClick={toggleTheme}>
          {theme === 'dark' ? t('header.lightMode') : t('header.darkMode')}
        </button>
        {(token || isGuest) && (
          <button className="header__button" onClick={handleLogout}>{t('header.logout')}</button>
        )}
      </div>
    </header>
  );
};

export default Header;