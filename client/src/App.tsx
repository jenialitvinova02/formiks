import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Header from './layouts/header/header';
import AuthPage from './pages/AuthPage/AuthPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import TemplatesPage from './pages/TemplatesPage/TemplatesPage';
import CreateTemplatePage from './pages/CreateTemplatePage/CreateTemplatePage';
import AdminPanel from './pages/AdminPanel/AdminPanel';
import CreateFormPage from './pages/CreateFormPage/CreateFormPage';
import GuestDashboard from './pages/GuestDashboard/GuestDashboard'; 
import ProtectedRoute from './routes/ProtectedRoute';
import FillForm from './pages/FillTemplatePage/FillTemplatePage';
import FillTemplatePage from './pages/FillTemplatePage/FillTemplatePage';
import FormAnswersListPage from './pages/FormAnswersListPage/FormAnswersListPage';
import ViewAnswerPage from './pages/Templates/ViewAnswerPage';
import EditAnswerPage from './pages/EditAnswerPage/EditAnswerPage';

const AppContent: React.FC = () => {
  const location = useLocation();
  const showHeader = !['/login', '/register'].includes(location.pathname);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />
        <Route path="/guest" element={<GuestDashboard />} />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        <Route path="/templates" element={
          <ProtectedRoute>
            <TemplatesPage />
          </ProtectedRoute>
        } />
        <Route path="/create-template" element={
          <ProtectedRoute>
            <CreateTemplatePage />
          </ProtectedRoute>
        } />
        <Route path="/create-form" element={
          <ProtectedRoute>
            <CreateFormPage />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/fill-template/:id" element={
          <ProtectedRoute>
            <FillTemplatePage />
          </ProtectedRoute>
        } />
        <Route path="/fill-form/:id" element={
          <ProtectedRoute>
            <FillForm />
          </ProtectedRoute>
        } />
 
        <Route
          path="/templates/:templateId/answers"
          element={
            <ProtectedRoute>
              <FormAnswersListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/templates/:templateId/answers/:answerId"
          element={
            <ProtectedRoute>
              <ViewAnswerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/templates/:templateId/answers/:answerId/edit"
          element={
            <ProtectedRoute>
              <EditAnswerPage />
            </ProtectedRoute>
          }
        />
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