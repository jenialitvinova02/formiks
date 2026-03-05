import React, { useState } from 'react';
import axios from '../../axiosInstance'; // импортируем наш axios интерсептор
import './login.scss';
import loginImg from '../../assets/login.jpg';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post('auth/login', { email, password });
            const { token } = response.data;
            localStorage.setItem('token', token);
            window.location.href = '/';
        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    return (
        <div className="login">
            <div className="login__container">
                <h1>Log in</h1>
                <form onSubmit={handleSubmit} className="login__box">
                    <div className="login__inputs">
                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className="login__inputs">
                        <label>Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            required 
                        />
                    </div>
                    {error && <p className="error">{error}</p>}
                    <div className="login__buttons">
                        <button type="submit" className="login__submit">Submit</button>
                    </div>
                </form>
            </div>
            <img className="login__img" src={loginImg} alt="Login" />
        </div>
    );
};

export default Login;