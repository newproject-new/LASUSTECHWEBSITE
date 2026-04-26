/**
 * AuthContext — JWT Authentication State
 *
 * Manages the logged-in user's session across the entire application.
 * The JWT token is stored in localStorage under the key 'lasustech_token'
 * and attached to every outgoing API request via axios default headers.
 *
 * Three roles are supported: 'student', 'lecturer', 'admin'.
 * Role-based routing is enforced in App.jsx using the isAuthenticated flag
 * and the user.role value exposed by this context.
 *
 * Session persistence: on page reload the stored token is verified against
 * the /auth/me endpoint. If the token is expired or invalid, logout() is
 * called automatically and the user is redirected to the login page by the
 * Axios 401 interceptor in api.js.
 *
 * Note on JWTs in localStorage: this is acceptable for a demo/academic
 * system. A production deployment should use httpOnly cookies with CSRF
 * tokens to prevent XSS-based token theft.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('lasustech_token'));
  const [loading, setLoading] = useState(true);

  // On mount, if a token exists in localStorage, verify it with the server
  // and restore the user session. The empty dependency array is intentional —
  // this effect runs once at page load only. Login and logout update state
  // directly through their own functions rather than re-triggering this effect.
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => { logout(); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    const { token: tok, user: u } = res.data;
    localStorage.setItem('lasustech_token', tok);
    api.defaults.headers.common['Authorization'] = `Bearer ${tok}`;
    setToken(tok);
    setUser(u);
    return u;
  };

  const register = async (data) => {
    const res = await api.post('/auth/register', data);
    const { token: tok, user: u } = res.data;
    localStorage.setItem('lasustech_token', tok);
    api.defaults.headers.common['Authorization'] = `Bearer ${tok}`;
    setToken(tok);
    setUser(u);
    return u;
  };

  const logout = () => {
    localStorage.removeItem('lasustech_token');
    delete api.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
