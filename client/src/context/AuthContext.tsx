import { useState, useEffect, ReactNode } from 'react';
import { api } from '../utils/api';
import { AuthContext } from './authContext';
import { createVerifier, checkVerifier, encrypt, isEncrypted } from '../utils/crypto';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ email: string; storageLimitBytes: number; storageUsedBytes: number } | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [vaultKey, setVaultKeyState] = useState<string | null>(sessionStorage.getItem('vaultKey'));
  const [isLocked, setIsLocked] = useState(!sessionStorage.getItem('vaultKey'));
  const [hasVaultKey, setHasVaultKey] = useState(false);

  useEffect(() => {
    if (token) {
      api.auth.me().then(setUser).catch(() => {
        localStorage.removeItem('token');
        setToken(null);
      });
      api.auth.getVaultKeyVerifier().then(res => {
        setHasVaultKey(!!res.verifier);
      }).catch(() => {});
    }
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await api.auth.login(email, password);
    localStorage.setItem('token', res.token);
    setToken(res.token);
    setUser(res.user);
    setIsLocked(true);
    try {
      const vRes = await api.auth.getVaultKeyVerifier();
      setHasVaultKey(!!vRes.verifier);
    } catch { /* first time user */ }
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
    setHasVaultKey(false);
  };

  const unlockVault = async (key: string) => {
    const { verifier } = await api.auth.getVaultKeyVerifier();

    if (!verifier) {
      const newVerifier = createVerifier(key);
      await api.auth.setVaultKeyVerifier(newVerifier);
      setHasVaultKey(true);
      sessionStorage.setItem('vaultKey', key);
      setVaultKeyState(key);
      setIsLocked(false);
      return;
    }

    if (!checkVerifier(verifier, key)) {
      throw new Error('Wrong vault key. Access denied.');
    }

    sessionStorage.setItem('vaultKey', key);
    setVaultKeyState(key);
    setIsLocked(false);
  };

  const lockVault = async () => {
    if (vaultKey) {
      try {
        const allItems = await api.vault.list();
        const toEncrypt = allItems.filter(item => !isEncrypted(item.encryptedData));
        if (toEncrypt.length > 0) {
          const updates = toEncrypt.map(item => ({
            _id: item._id,
            encryptedData: encrypt(item.encryptedData, vaultKey),
          }));
          await api.vault.bulkUpdate(updates);
        }
      } catch { /* best effort */ }
    }
    sessionStorage.removeItem('vaultKey');
    setVaultKeyState(null);
    setIsLocked(true);
  };

  const refreshUser = async () => {
    const u = await api.auth.me();
    setUser(u);
  };

  return (
    <AuthContext.Provider value={{ user, token, vaultKey, isLocked, hasVaultKey, login, register, logout, unlockVault, lockVault, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
