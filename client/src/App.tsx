import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './layouts/header/header';
import Auth from './pages/auth/auth';
import Dashboard from './pages/dashboard/dashboard';
import Profile from './pages/profile/Profile';
import Templates from './pages/templates/Templates';
import CreateTemplate from './pages/createTemplate/CreateTemplate';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import CreateForm from './pages/CreateForm/CreateForm';
import GuestDashboard from './pages/GuestDashboard/GuestDashboard'; 
import ProtectedRoute from './routes/ProtectedRoute';

const AppContent: React.FC = () => {
  const location = useLocation();
  const showHeader = location.pathname !== '/login';
  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/guest" element={<GuestDashboard />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/templates" element={
          <ProtectedRoute>
            <Templates />
          </ProtectedRoute>
        } />
        <Route path="/create-template" element={
          <ProtectedRoute>
            <CreateTemplate />
          </ProtectedRoute>
        } />
        <Route path="/create-form" element={
          <ProtectedRoute>
            <CreateForm />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};

export default App;