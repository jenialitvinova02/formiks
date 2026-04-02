import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './header.scss';
import Logo from '../../assets/logo.png';
import burger from '../../assets/burger.svg';

export const Header: React.FC = () => {
  const { t, i18n } = useTranslation();
  const token = localStorage.getItem('token');
  const isGuest = localStorage.getItem('guest') === 'true';
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (theme === 'light') document.documentElement.setAttribute('data-theme', 'white');
    else document.documentElement.removeAttribute('data-theme');
  }, [theme]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  const changeLanguage = (lng: string) => i18n.changeLanguage(lng);
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('guest');
    navigate('/login');
  };

  const commonLinks = (
    <>
      <Link to={token || isGuest ? '/dashboard' : '/login'}>{t('header.dashboard')}</Link>
      {!isGuest && <>
        <Link to="/templates">{t('header.myTemplates')}</Link>
        <Link to="/create-template">{t('header.createTemplate')}</Link>
      </>}
      {token ? <Link to="/profile">{t('header.profile')}</Link>
              : <Link to="/login">{t('header.login')}</Link>}
      {token && JSON.parse(atob(token.split('.')[1])).role === 'admin' && (
        <Link to="/admin">Admin</Link>
      )}
    </>
  );

  const commonControls = (
    <>
      <select onChange={e => changeLanguage(e.target.value)} defaultValue={i18n.language}>
        <option value="en">EN</option>
        <option value="ru">RU</option>
        <option value="pl">PL</option>
      </select>
      <button onClick={toggleTheme}>
        {theme === 'dark' ? t('header.lightMode') : t('header.darkMode')}
      </button>
      {(token || isGuest) && (
        <button className="header__button" onClick={handleLogout}>
          {t('header.logout')}
        </button>
      )}
    </>
  );

  return (
    <header className="header">
      <img className="header__logo" src={Logo} alt="Logo" />

      {/* desktop */}
      <nav className="header__links">{commonLinks}</nav>
      <div className="header__right">{commonControls}</div>

      {/* burger */}
      <button
        className="header__burger"
        onClick={() => setMenuOpen(prev => !prev)}
      >
        <img src={burger} alt="Menu" />
      </button>

      {/* mobile menu */}
      {menuOpen && (
        <div className="header__mobile-menu">
          <button
            className="header__mobile-close"
            onClick={() => setMenuOpen(false)}
          >
            ×
          </button>
          <nav className="header__mobile-links">{commonLinks}</nav>
          <div className="header__mobile-controls">{commonControls}</div>
        </div>
      )}
    </header>
  );
};

export default Header;
