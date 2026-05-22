import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from './ToastContext';
import * as api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // On mount, verify token
  useEffect(() => {
    const verifyToken = async () => {
      const savedToken = localStorage.getItem('token');
      if (savedToken) {
        try {
          const { data } = await api.getProfile();
          setUser(data.user || data);
          setToken(savedToken);
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setToken(null);
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, []);

  const login = useCallback(
    async (email, password) => {
      console.log('📝 Attempting login for email:', email);
      try {
        const { data } = await api.loginUser({ email, password });
        console.log('📥 Login response received (success):', data);
        const userData = data.user || data;
        const authToken = data.token;
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(authToken);
        setUser(userData);
        showToast('Welcome back!', 'success');
        return { success: true };
      } catch (err) {
        console.error('❌ Axios error caught in login context:', err);
        if (err.response) {
          console.error('❌ Server error response status:', err.response.status);
          console.error('❌ Server error response data:', err.response.data);
        } else {
          console.error('❌ Network error or server offline: no response received');
        }
        const message = err.response?.data?.message || 'Login failed. Please try again.';
        showToast(message, 'error');
        return { success: false, message };
      }
    },
    [showToast]
  );

  const register = useCallback(
    async (name, email, password, phone) => {
      console.log('📝 Registering Account payload:', { name, email, password: '***', phone });
      try {
        const { data } = await api.registerUser({ name, email, password, phone });
        console.log('📥 Server response received (success):', data);
        const userData = data.user || data;
        const authToken = data.token;
        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(authToken);
        setUser(userData);
        showToast('Account created successfully!', 'success');
        return { success: true };
      } catch (err) {
        console.error('❌ Axios error caught in register context:', err);
        if (err.response) {
          console.error('❌ Server error response status:', err.response.status);
          console.error('❌ Server error response data:', err.response.data);
        } else {
          console.error('❌ Network error or server offline: no response received');
        }
        const message = err.response?.data?.message || 'Registration failed. Please try again.';
        showToast(message, 'error');
        return { success: false, message };
      }
    },
    [showToast]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    showToast('Logged out successfully', 'info');
    navigate('/');
  }, [navigate, showToast]);

  const updateUserProfile = useCallback(
    async (profileData) => {
      try {
        const { data } = await api.updateProfile(profileData);
        const updatedUser = data.user || data;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        showToast('Profile updated successfully!', 'success');
        return { success: true };
      } catch (err) {
        const message = err.response?.data?.message || 'Failed to update profile.';
        showToast(message, 'error');
        return { success: false, message };
      }
    },
    [showToast]
  );

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile: updateUserProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
