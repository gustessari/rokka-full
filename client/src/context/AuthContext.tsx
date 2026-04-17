import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../utils/api';

interface User {
  email: string;
  storageLimitBytes: number;
  storageUsedBytes: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  vaultKey: string | null;
  isLocked: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setVaultKey: (key: string) => void;
  lockVault: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [vaultKey, setVaultKeyState] = useState<string | null>(sessionStorage.getItem('vaultKey'));
  const [isLocked, setIsLocked] = useState(!sessionStorage.getItem('vaultKey'));

  useEffect(() => {
    if (token) {
      api.auth.me().then(setUser).catch(() => {
        localStorage.removeItem('token');
        setToken(null);
      });
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login(email, password);
    localStorage.setItem('token', res.token);
    setToken(res.token);
    setUser(res.user);
    setIsLocked(true);
  };

  const register = async (email: string, password: string) => {
    await api.auth.register(email, password);
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('vaultKey');
    setToken(null);
    setUser(null);
    setVaultKeyState(null);
    setIsLocked(true);
  };

  const setVaultKey = (key: string) => {
    sessionStorage.setItem('vaultKey', key);
    setVaultKeyState(key);
    setIsLocked(false);
  };

  const lockVault = () => {
    sessionStorage.removeItem('vaultKey');
    setVaultKeyState(null);
    setIsLocked(true);
  };

  const refreshUser = async () => {
    const u = await api.auth.me();
    setUser(u);
  };

  return (
    <AuthContext.Provider value={{ user, token, vaultKey, isLocked, login, register, logout, setVaultKey, lockVault, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
