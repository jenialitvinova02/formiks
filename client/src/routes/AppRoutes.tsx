import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import {
  FillTemplatePage,
  FormAnswersListPage,
  ViewAnswerPage,
  EditAnswerPage,
  AdminPanel,
  CreateFormPage,
  GuestDashboard,
  AuthPage,
  DashboardPage,
  ProfilePage,
  TemplatesPage,
  CreateTemplatePage,
} from '../pages';
import ProtectedRoute from './ProtectedRoute';
import { Header } from '../layouts';

const AppRoutes: React.FC = () => {
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
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/templates"
          element={
            <ProtectedRoute>
              <TemplatesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-template"
          element={
            <ProtectedRoute>
              <CreateTemplatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/templates/edit/:templateId"
          element={
            <ProtectedRoute>
              <CreateTemplatePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-form"
          element={
            <ProtectedRoute>
              <CreateFormPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fill-template/:id"
          element={
            <ProtectedRoute>
              <FillTemplatePage />
            </ProtectedRoute>
          }
        />
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

export default AppRoutes;