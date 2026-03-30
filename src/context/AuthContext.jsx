import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getAccessToken, clearTokens } from '../utils/tokenStorage';
import { getCurrentUser } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const token = getAccessToken();
    if (token) {
      try {
        const response = await getCurrentUser();
        if (response.success) {
          setUser(response.data);
        } else {
          clearTokens();
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        clearTokens();
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (authData) => {
    // authData contains tokens
    // We already store tokens in the page, but let's ensure user info is fetched
    await fetchUser();
  };

  const logout = () => {
    clearTokens();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};
