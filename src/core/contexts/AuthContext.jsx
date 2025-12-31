import React, { createContext, useContext, useState, useEffect } from 'react';
import { APP_URL } from '@core/config/app.config';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const getStoredUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStoredUser();
    if (storedUser && isAuthenticated()) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const getRedirectPath = (role) => {
    switch (role) {
      case 'admin':
        return APP_URL + '/admin/dashboard';
      case 'company':
      case 'empresa':
        return APP_URL + '/empresa/dashboard';
      case 'plantador':
        return APP_URL + '/plantador/dashboard';
      case 'vivero':
        return APP_URL + '/vivero/dashboard';
      case 'user':
        return APP_URL + '/usuario/feed';
      default:
        return '/';
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    logout,
    loading,
    getRedirectPath,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
