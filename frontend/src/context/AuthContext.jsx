import { createContext, useContext, useState } from 'react';
import { loginUser, registerUser } from '../api/authApi.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Load persisted session from localStorage
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('crm_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('crm_token') || null);

  // ── login ──────────────────────────────────────────────────────────────────
  const login = async (username, password) => {
    const data = await loginUser(username, password);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('crm_user', JSON.stringify(data.user));
    localStorage.setItem('crm_token', data.token);
    return data;
  };

  // ── register ───────────────────────────────────────────────────────────────
  const register = async (username, password) => {
    const data = await registerUser(username, password);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('crm_user', JSON.stringify(data.user));
    localStorage.setItem('crm_token', data.token);
    return data;
  };

  // ── logout ─────────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('crm_user');
    localStorage.removeItem('crm_token');
  };

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
