import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('codesense_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('codesense_token');
      if (storedToken) {
        try {
          const data = await authService.getProfile();
          if (data.success) {
            setUser(data.user);
          }
        } catch (err) {
          localStorage.removeItem('codesense_token');
          localStorage.removeItem('codesense_user');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await authService.login({ email, password });
    if (data.success) {
      localStorage.setItem('codesense_token', data.token);
      localStorage.setItem('codesense_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const register = async (name, email, password) => {
    const data = await authService.register({ name, email, password });
    if (data.success) {
      localStorage.setItem('codesense_token', data.token);
      localStorage.setItem('codesense_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
    }
    return data;
  };

  const logout = () => {
    localStorage.removeItem('codesense_token');
    localStorage.removeItem('codesense_user');
    setToken(null);
    setUser(null);
  };

  const updatePreferences = async (newPrefs) => {
    try {
      const data = await authService.updatePreferences(newPrefs);
      if (data.success && user) {
        setUser({ ...user, preferences: data.preferences });
      }
      return data;
    } catch (err) {
      console.error('Failed to update preferences:', err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(token && user),
        loading,
        login,
        register,
        logout,
        updatePreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
