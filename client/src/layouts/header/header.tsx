import React from 'react';
import './header.scss';
import Logo from '../../assets/logo.png';

const Header: React.FC = () => {
    return (
        <header className='header'>
            <img className='header__logo' src={Logo} alt="Logo" />
            <div className='header__right'>
                <div className='header__links'>
                    <a href="/" className='header__link'>Home</a>
                    <a href="/" className='header__link'>My Forms</a>
                    <a href="/" className='header__link'>Profile</a>
                </div>

            </div>
        </header>
    );
};

export default Header;