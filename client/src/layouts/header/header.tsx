import React from 'react';
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
        {(token || isGuest) && (
          <button onClick={handleLogout}>Logout</button>
        )}
      </nav>
    </header>
  );
};

export default Header;