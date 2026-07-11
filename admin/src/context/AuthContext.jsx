import { createContext, useContext, useEffect, useRef, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);
const IDLE_TIMEOUT_MS = 15 * 60 * 1000;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const idleTimer = useRef(null);

  useEffect(() => {
    api
      .get('/auth/me')
      .then((res) => {
        if (res.data.role === 'admin') setUser(res.data);
        else setUser(null);
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!user) return;
    function resetTimer() {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(logout, IDLE_TIMEOUT_MS);
    }
    const events = ['mousemove', 'keydown', 'click'];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();
    return () => {
      events.forEach((e) => window.removeEventListener(e, resetTimer));
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [user]);

  async function login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.role !== 'admin') {
      await api.post('/auth/logout');
      throw new Error('Not authorized for admin access');
    }
    setUser(res.data);
    return res.data;
  }

  async function logout() {
    await api.post('/auth/logout').catch(() => {});
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
