import { Navigate, Outlet, useLocation } from 'react-router-dom';
import React from 'react';
import { isAuthenticated, getUserRole } from '../utils/authUtils';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const location = useLocation();
  
  // Check if user is authenticated
  if (!isAuthenticated()) {
    // Redirect to login and remember where they were trying to go
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  
  // Get user role
  const userRole = getUserRole();
  
  if (!userRole) {
    console.error('User role not found');
    return <Navigate to="/login" replace />;
  }

  // Check if user has required role
  if (allowedRoles.includes(userRole)) {
    return <Outlet />;
  } else {
    // If user doesn't have permission, redirect to unauthorized page
    return <Navigate to="/unauthorized" replace />;
  }
};

export default ProtectedRoute;