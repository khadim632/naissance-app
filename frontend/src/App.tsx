import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import BirthsList from './pages/births/BirthsList';
import BirthForm from './pages/births/BirthForm';
import ValidationsList from './pages/validations/ValidationsList';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        <Route 
          path="/app" 
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/app/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Birth declaration routes */}
          <Route path="births" element={<BirthsList />} />
          <Route path="births/new" element={<BirthForm />} />
          
          {/* Death declaration routes */}
          <Route path="deaths" element={<div>Death Declarations List (To be implemented)</div>} />
          <Route path="deaths/new" element={<div>New Death Declaration Form (To be implemented)</div>} />
          
          {/* Validation routes */}
          <Route path="validations" element={<ValidationsList />} />
          <Route path="validations/birth/:id" element={<div>Birth Declaration Validation (To be implemented)</div>} />
          <Route path="validations/death/:id" element={<div>Death Declaration Validation (To be implemented)</div>} />
          
          {/* Admin routes */}
          <Route path="users" element={<div>User Management (To be implemented)</div>} />
          <Route path="statistics" element={<div>System Statistics (To be implemented)</div>} />
        </Route>
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;