// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  allowedRoles: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  // Get user from localStorage and parse it
  const userString = localStorage.getItem('user');
  
  // If no user data exists, redirect to login
  if (!userString) {
    return <Navigate to="/login" replace />;
  }
  
  try {
    const user = JSON.parse(userString);
    
    // Get role from user object - adjust this based on your actual user object structure
    // Based on your API response, the role might be in user.roleName
    const userRole = user.roleName || localStorage.getItem('role');
    
    if (!userRole) {
      console.error('User role not found in user data');
      return <Navigate to="/login" replace />;
    }

    if (allowedRoles.includes(userRole)) {
      // If user's role is in the allowed roles list, allow access
      return <Outlet />;
    } else {
      // If user doesn't have permission, redirect to unauthorized page
      return <Navigate to="/unauthorized" replace />;
    }
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    // If there's an error parsing the user data, redirect to login
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;