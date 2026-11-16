import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('hisab_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('hisab_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync token in localStorage & verify session
  useEffect(() => {
    const verifyUser = async () => {
      const savedToken = localStorage.getItem('hisab_token');
      if (savedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('hisab_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed:', err.response?.data?.message || err.message);
          if (err.response?.status === 401 || err.response?.status === 403) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { user: userData, token: userToken } = res.data;
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('hisab_token', userToken);
        localStorage.setItem('hisab_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, message: 'Login failed' };
    } catch (err) {
      const message = err.response?.data?.message || 'Server error. Please try again.';
      return {
        success: false,
        message,
        isExpired: err.response?.data?.isExpired || false,
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      if (res.data.success) {
        const { user: userData, token: userToken } = res.data;
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('hisab_token', userToken);
        localStorage.setItem('hisab_user', JSON.stringify(userData));
        return { success: true, user: userData };
      }
      return { success: false, message: 'Registration failed' };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hisab_token');
    localStorage.removeItem('hisab_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === 'admin',
        loading,
        login,
        register,
        logout,
        setUser,
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
