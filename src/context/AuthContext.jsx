import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ROLES, getRole } from '../utils/permissions';
import { loginByEmailPassword } from '../services/authService';

const AuthContext = createContext(null);
const STORAGE_KEY = 'frostbite_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (correo, password) => {
    const data = await loginByEmailPassword(correo, password);
    setUser(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return data;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const role = getRole(user);

  const value = useMemo(
    () => ({
      user,
      role: user ? role : ROLES.PUBLICO,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [user, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
