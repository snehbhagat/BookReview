import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('auth'))?.user || null; } catch { return null; }
  });
  const [token, setToken] = useState(() => {
    try { return JSON.parse(localStorage.getItem('auth'))?.token || null; } catch { return null; }
  });

  const saveAuth = useCallback((nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    localStorage.setItem('auth', JSON.stringify({ user: nextUser, token: nextToken }));
    // storage event for other tabs
    window.dispatchEvent(new StorageEvent('storage', { key: 'auth' }));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth');
    window.dispatchEvent(new StorageEvent('storage', { key: 'auth' }));
  }, []);

  useEffect(() => {
    // optional token expiration checks could go here
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, saveAuth, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
