// src/App.tsx
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
import DeathForm from './pages/deaths/DeathForm'; // Ajouter l'import
import DeathsList from './pages/deaths/DeathsList'; // Ajouter l'import
import ValidationsList from './pages/validations/ValidationsList';
import RequireRole from './components/auth/RequireRole';
import UsersList from './pages/UsersList';
import Statistics from './pages/Statistics';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <>{children}</>;
};

const RoleBasedRedirect: React.FC = () => {
  const { authState, getRedirectPath } = useAuth();
  
  if (!authState.user) {
    return <Navigate to="/app/dashboard" replace />;
  }
  
  const redirectPath = getRedirectPath(authState.user.role);
  return <Navigate to={redirectPath} replace />;
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
          <Route index element={<RoleBasedRedirect />} />
          <Route path="dashboard" element={<Dashboard />} /> 
          
          <Route 
            path="statistics" 
            element={
              <RequireRole allowedRoles={['admin', 'superadmin', 'hopital', 'mairie']}>
                <Statistics />
              </RequireRole>
            } 
          />
          
          <Route 
            path="births" 
            element={
              <RequireRole allowedRoles={['hopital']}>
                <BirthsList />
              </RequireRole>
            } 
          />
          <Route 
            path="births/new" 
            element={
              <RequireRole allowedRoles={['hopital']}>
                <BirthForm />
              </RequireRole>
            } 
          />
          
          <Route 
            path="validations" 
            element={
              <RequireRole allowedRoles={['mairie']}>
                <ValidationsList />
              </RequireRole>
            } 
          />
          <Route 
            path="validations/birth/:id" 
            element={
              <RequireRole allowedRoles={['mairie']}>
                <div>Birth Declaration Validation (To be implemented)</div>
              </RequireRole>
            } 
          />    
          <Route 
            path="validations/death/:id" 
            element={
              <RequireRole allowedRoles={['mairie']}>
                <div>Death Declaration Validation (To be implemented)</div>
              </RequireRole>
            } 
          />    
          
          <Route 
            path="deaths" 
            element={
              <RequireRole allowedRoles={['hopital']}>
                <DeathsList />
              </RequireRole>
            } 
          />
          <Route 
            path="deaths/new" 
            element={
              <RequireRole allowedRoles={['hopital']}>
                <DeathForm /> {/* Remplacer le placeholder */}
              </RequireRole>
            } 
          />
          
          <Route 
            path="users" 
            element={
              <RequireRole allowedRoles={['admin', 'superadmin']}>
                <UsersList /> 
              </RequireRole>
            } 
          />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;