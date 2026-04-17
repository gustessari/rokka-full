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
  hasVaultKey: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  unlockVault: (key: string) => Promise<void>;
  lockVault: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
