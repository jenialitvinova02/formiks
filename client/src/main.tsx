import React from 'react';
import ReactDOM from 'react-dom/client';
import Login from './pages/login/login';
import './styles/style.scss';

ReactDOM.createRoot(document.querySelector<HTMLDivElement>('#app')!).render(
  <React.StrictMode>
    <Login />
  </React.StrictMode>
);
