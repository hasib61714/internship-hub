import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // ✅ ADDED THIS LINE
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser && storedUser !== 'undefined') {
        setToken(storedToken); // ✅ NOW WORKS!
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      } else {
        // Clear invalid data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Clear invalid data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    setError('');
    setLoading(true);
    
    try {
      const response = await api.post('/login', { email, password });
      const { user, token: authToken } = response.data;
      
      setUser(user);
      setToken(authToken); // ✅ ADDED THIS
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(user));
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      
      // Redirect based on role
      if (user.role === 'student' || user.role === 'employee') {
        navigate('/student/dashboard');
      } else if (user.role === 'company') {
        navigate('/company/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (data) => {
    try {
      const response = await api.post('/register', data);
      const { user, token: authToken } = response.data;
      
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setToken(authToken); // ✅ ADDED THIS
      api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      
      // Redirect after registration
      if (user.role === 'student') {
        navigate('/student/dashboard');
      } else if (user.role === 'company') {
        navigate('/company/dashboard');
      }
      
      return user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null); // ✅ ADDED THIS
    delete api.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token, // ✅ ADDED THIS
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isStudent: user?.role === 'student' || user?.role === 'employee',
    isCompany: user?.role === 'company',
    isAdmin: user?.role === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};