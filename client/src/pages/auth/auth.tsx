import React, { useState } from 'react';
import axios from '../../axiosInstance';
import './auth.scss';
import { useNavigate } from 'react-router-dom';

const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isLogin) {
            try {
                console.log('Sending login data:', { email, password });
                const response = await axios.post('auth/login', { email, password });
                console.log('Login response:', response.data);
                const { token } = response.data;
                localStorage.setItem('token', token);
                navigate('/dashboard');
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
                navigate('/dashboard');
            } catch (err: any) {
                console.error('Registration error:', err.response?.data);
                setError(err.response?.data?.error || 'Registration failed');
            }
        }
    };

    const handleGuest = () => {
        localStorage.setItem('guest', 'true');
        localStorage.removeItem('token');
        navigate('/guest');
    };

    return (
        <div className="auth">
            <div className='auth__container'>
            <div className="auth__box">
                <h1 className="auth__box--title">{isLogin ? 'Login' : 'Register'}</h1>
                <form onSubmit={handleSubmit} className="auth__box--form">
                    {!isLogin && (
                        <div className="auth__box--form-inputs">
                            <p>Username</p>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    )}
                    <div className="auth__box--form-inputs">
                        <p>Email</p>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="auth__box--form-inputs">
                        <p>Password</p>
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
                </form>
                     
                <button
                    className="auth__box--toggle toggle"
                    onClick={() => {
                        setIsLogin(prev => !prev);
                        setError(null);
                        setSuccess(false);
                    }}
                >
                    {isLogin ? 'Switch to Register' : 'Switch to Login'}
                </button>
                <div className="auth__box--buttons">
                        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
                        {isLogin && (
                    <button className="auth__guest" onClick={handleGuest}>
                        Enter as Guest
                    </button>
                )}
                    </div>
            </div>
            </div>
            <div className="auth__img"></div>
        </div>
    );
};

export default Auth;