import { createContext } from 'react';

interface User {
  email: string;
  storageLimitBytes: number;
  storageUsedBytes: number;
}

export interface AuthContextType {
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

export const AuthContext = createContext<AuthContextType | null>(null);
