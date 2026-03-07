import React, { useState } from 'react';
import axios from '../../axiosInstance';
import loginImg from '../../assets/login.jpg';
import './auth.scss';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            try {
                console.log('Sending login data:', { email, password }); 
                const response = await axios.post('auth/login', { email, password });
                console.log('Login response:', response.data);
                const { token } = response.data;
                localStorage.setItem('token', token); 
                window.location.href = '/'; 
            } catch (err: any) {
                console.error('Login error:', err.response?.data); 
                setError(err.response?.data?.error || 'Login failed');
            }
        } else {
            try {
                console.log('Sending registration data:', { username, email, password });
                const response = await axios.post('auth/register', { username, email, password });
                console.log('Registration response:', response.data); 

                const loginResponse = await axios.post('auth/login', { email, password });
                const { token } = loginResponse.data;
                localStorage.setItem('token', token); 
                window.location.href = '/'; 
            } catch (err: any) {
                console.error('Registration error:', err.response?.data); 
                setError(err.response?.data?.error || 'Registration failed');
            }
        }
    };

    return (
        <div className="login">
            <div className='login__container'>
            <div className="login__box">
                <h1>{isLogin ? 'Login' : 'Register'}</h1>
                <form onSubmit={handleSubmit} className="auth__form">
                    {!isLogin && (
                        <div className="login__inputs">
                            <label>Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="auth__inputs">
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="auth__inputs">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    {success && !isLogin && (
                        <p className="success">Registration successful!</p>
                    )}
                    <div className="login__buttons">
                        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
                    </div>
                </form>
                <button
                    className="auth__toggle"
                    onClick={() => {
                        setIsLogin(prev => !prev);
                        setError(null);
                        setSuccess(false);
                    }}
                >
                    {isLogin ? 'Switch to Register' : 'Switch to Login'}
                </button>
            </div>
            </div>
                <img className="login__img" src={loginImg} alt="Authentication" />
        </div>
    );
};

export default Auth;