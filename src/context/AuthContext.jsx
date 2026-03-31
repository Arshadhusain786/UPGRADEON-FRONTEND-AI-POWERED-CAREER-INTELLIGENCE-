import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { getAccessToken, clearTokens } from '../utils/tokenStorage';
import { getCurrentUser } from '../api/authApi';
import { getBalance } from '../api/creditApi';
import { useTheme } from '../context/ThemeContext';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { setTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCredits = useCallback(async () => {
    try {
      const response = await getBalance();
      if (response.success) {
        setCredits(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error);
    }
  }, []);

  const fetchUser = useCallback(async () => {
    const token = getAccessToken();
    if (token) {
      try {
        const response = await getCurrentUser();
        if (response.success) {
          setUser(response.data);
          
          // 🌗 Sync theme from user profile
          if (response.data.theme) {
            setTheme(response.data.theme);
          }

          // 💎 Fetch credits after user info is fetched
          await fetchCredits();
        } else {
          clearTokens();
          setUser(null);
          setCredits(null);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        clearTokens();
        setUser(null);
        setCredits(null);
      }
    }
    setLoading(false);
  }, [fetchCredits, setTheme]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = useCallback(async (authData) => {
    setLoading(true);
    await fetchUser();
  }, [fetchUser]);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setCredits(null);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      credits, 
      loading, 
      login, 
      logout, 
      refreshUser: fetchUser, 
      refreshCredits: fetchCredits 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
