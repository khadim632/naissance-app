import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface RequireRoleProps {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RequireRole: React.FC<RequireRoleProps> = ({ allowedRoles, children }) => {
  const { authState } = useAuth();
  const location = useLocation();

  const userRole = authState.user?.role;

  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/app/dashboard" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default RequireRole;
