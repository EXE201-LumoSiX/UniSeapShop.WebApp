import { NavigateFunction } from 'react-router-dom';

export const checkAuth = (navigate: NavigateFunction, redirectTo: string = '/login') => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate(redirectTo, { state: { from: window.location.pathname } });
    return false;
  }
  return true;
};

export const getUserRole = () => {
  try {
    const userString = localStorage.getItem('user');
    if (!userString) return null;
    
    const user = JSON.parse(userString);
    return user.roleName || localStorage.getItem('role');
  } catch (error) {
    console.error('Error getting user role:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};