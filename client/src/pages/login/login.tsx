import React from 'react';
import './login.scss';
import loginImg from '../../assets/login.jpg'

const Login: React.FC = () => {
    return (
        <div className="login">
            <div className="login__container">
            <h1>Log in</h1>
            <div className="login__box">
                <div className="login__inputs">
                    <label>Email</label>
                    <input type="email" />
                </div>
                <div className="login__inputs">
                    <label>Password</label>
                    <input type="password" />
                </div>
                <div className="login__buttons">
                    <button className="login__submit">Submit</button>
                    <button className="login__toggle">Toggle</button>
                </div>
            </div>
            </div>
            <img className="login__img" src={loginImg} alt="Login" />
        </div>
    );
};

export default Login;