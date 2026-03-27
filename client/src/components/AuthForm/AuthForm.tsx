// filepath: client/src/components/AuthForm/AuthForm.tsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import './AuthForm.scss';

interface Props {
  mode: 'login'|'register';
  onSuccess: () => void;
}

const AuthForm: React.FC<Props> = ({ mode, onSuccess }) => {
  const { login, register, error, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (mode === 'login') await login(email, password);
      else           await register(username, email, password, isAdmin ? 'admin' : 'user');
      onSuccess();
    } catch {}  // error уже в хуке
  };

  return (
    <form className="auth-form" onSubmit={submit}>
      {mode==='register' && (
        <input
          placeholder="Username"
          value={username}
          onChange={e=>setUsername(e.target.value)}
          required
        />
      )}
      <input
        type="email" placeholder="Email"
        value={email}
        onChange={e=>setEmail(e.target.value)}
        required
      />
      <input
        type="password" placeholder="Password"
        value={password}
        onChange={e=>setPassword(e.target.value)}
        required
      />
      {mode==='register' && (
        <label>
          <input
            type="checkbox"
            checked={isAdmin}
            onChange={e=>setIsAdmin(e.target.checked)}
          /> Admin
        </label>
      )}
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? 'Please wait…' : mode==='login' ? 'Login' : 'Register'}
      </button>
    </form>
  );
};

export default AuthForm;