// FRONTEND/frontend/src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { authService } from '../services/authService';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('wqam_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await authService.getMe();
      setUser(response.data);
    } catch (error) {
      localStorage.removeItem('wqam_token');
      localStorage.removeItem('wqam_role');
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    localStorage.setItem('wqam_token', token);
    localStorage.setItem('wqam_role', userData.role);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('wqam_token');
    localStorage.removeItem('wqam_role');
    setUser(null);
  };

  return { user, loading, login, logout };
}