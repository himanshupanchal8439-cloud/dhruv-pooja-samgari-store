'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data);
    return res.data;
  }

  async function register(name, email, password, phone) {
    const res = await api.post('/auth/register', { name, email, password, phone });
    setUser(res.data);
    return res.data;
  }

  async function logout() {
    await api.post('/auth/logout');
    setUser(null);
  }

  async function refreshUser() {
    const res = await api.get('/auth/me');
    setUser(res.data);
    return res.data;
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
