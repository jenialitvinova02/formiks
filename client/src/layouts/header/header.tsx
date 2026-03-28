import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './header.scss';
import Logo from '../../assets/logo.png';

const Header: React.FC = () => {
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
    // Если тема светлая, устанавливаем data-theme="white", иначе сбрасываем атрибут
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'white');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <header className="header">
      <img className="header__logo" src={Logo} alt="Logo" />
      <nav className="header__links">
        <Link to={token || isGuest ? "/dashboard" : "/login"}>Dashboard</Link>
        {!(isGuest) && (
          <>
            <Link to="/templates">My Templates</Link>
            <Link to="/create-template">Create Template</Link>
          </>
        )}
        {token ? (
          <Link to="/profile">Profile</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
        {token && JSON.parse(atob(token.split('.')[1])).role === 'admin' && (
          <Link to="/admin">Admin Panel</Link>
        )}
      </nav>
      <div className="header__right">
        <button onClick={toggleTheme}>
          {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
        </button>
        {(token || isGuest) && (
          <button className="header__button" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </header>
  );
};

export default Header;