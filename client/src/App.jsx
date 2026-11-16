import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import FindPartnersPage from './pages/FindPartnersPage';
import PartnerRequestsPage from './pages/PartnerRequestsPage';
import MyPartnersPage from './pages/MyPartnersPage';
import StudentProfilePage from './pages/StudentProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Public-Only Auth Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />

          {/* Protected Routes (Wrapped in ProtectedRoute and DashboardLayout) */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/find-partners" element={<FindPartnersPage />} />
            <Route path="/requests" element={<PartnerRequestsPage />} />
            <Route path="/my-partners" element={<MyPartnersPage />} />
            <Route path="/partners" element={<MyPartnersPage />} />
            <Route path="/profile" element={<StudentProfilePage />} />
            <Route path="/profile/:id" element={<StudentProfilePage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
