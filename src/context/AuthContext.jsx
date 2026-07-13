import { createContext, useContext, useState, useCallback } from 'react';
import adminCredentials from '../data/adminCredentials.json';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('hms_user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      // API-integration-ready: once a real backend exists, swap the block below for
      // `const { data } = await api.post('/auth/login', credentials);` — the JSON-based
      // fixed-credential check stays useful as a local/offline fallback.
      await new Promise((r) => setTimeout(r, 600));

      const matchedUser = adminCredentials.find(
        (u) =>
          u.email.toLowerCase() === credentials.email?.trim().toLowerCase() &&
          u.password === credentials.password
      );

      if (!matchedUser) {
        const message = 'Wrong ID or password. Please try again.';
        setError(message);
        return { success: false, message };
      }

      const authenticatedUser = {
        name: matchedUser.name,
        role: matchedUser.role,
        email: matchedUser.email,
        department: matchedUser.department,
        phone: matchedUser.phone,
        lastLogin: matchedUser.lastLogin,
        memberSince: matchedUser.memberSince,
        status: matchedUser.status,
      };
      const mockToken = 'mock-jwt-token';

      localStorage.setItem('hms_token', mockToken);
      localStorage.setItem('hms_user', JSON.stringify(authenticatedUser));
      setUser(authenticatedUser);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong. Please try again.';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((current) => {
      const next = { ...current, ...updates };
      localStorage.setItem('hms_user', JSON.stringify(next));
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('hms_token');
    localStorage.removeItem('hms_user');
    setUser(null);
  }, []);

  const value = { user, loading, error, login, logout, updateUser, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
