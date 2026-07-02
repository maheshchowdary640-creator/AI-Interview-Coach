import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on startup
  useEffect(() => {
    const storedUser = localStorage.getItem('ai_coach_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Failed to parse stored user:', err);
        localStorage.removeItem('ai_coach_user');
      }
    }
    setLoading(false);
  }, []);

  const loginUser = async (name, email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/users', { name, email });
      const userData = response.data;
      setUser(userData);
      localStorage.setItem('ai_coach_user', JSON.stringify(userData));
      return userData;
    } catch (err) {
      console.error('Login error:', err);
      const errMsg = err.response?.data?.error || 'Failed to sign in. Check backend connection.';
      setError(errMsg);
      throw new Error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('ai_coach_user');
  };

  return (
    <UserContext.Provider value={{ user, loading, error, loginUser, logoutUser, setError }}>
      {children}
    </UserContext.Provider>
  );
};
