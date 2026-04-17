import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function UnlockPage() {
  const { unlockVault, logout, user, hasVaultKey } = useAuth();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (key.length < 4) {
      setError('Vault key must be at least 4 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await unlockVault(key);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unlock failed';
      setError(msg);
      setShake(true);
      setTimeout(() => setShake(false), 600);
      setKey('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at center, #1a1008 0%, #0d0d0d 70%)' }}>
      <div className={`wow-panel p-8 w-full max-w-md animate-fade-in text-center ${shake ? 'shake-error' : ''}`}>
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold gold-text gold-glow tracking-wider mb-2">VAULT LOCKED</h1>
        <p className="text-sm opacity-70 mb-6">
          {hasVaultKey
            ? `Enter your secret key to decrypt your vault, ${user?.email}`
            : `Set your vault key for the first time, ${user?.email}`
          }
        </p>

        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="password"
            value={key}
            onChange={e => { setKey(e.target.value); setError(''); }}
            className="wow-input text-center text-lg tracking-widest"
            placeholder={hasVaultKey ? 'Enter vault key...' : 'Create your vault key...'}
            autoFocus
          />

          {error && (
            <div className="bg-red-900/40 border border-red-700 rounded p-3 animate-fade-in">
              <p className="text-red-300 text-sm font-semibold">⚠️ {error}</p>
            </div>
          )}

          <button type="submit" className="wow-btn w-full lock-pulse" disabled={loading}>
            {loading ? '⏳ Verifying...' : hasVaultKey ? '🔓 Unlock Vault' : '🔑 Set Vault Key'}
          </button>
        </form>

        <button onClick={logout} className="mt-6 text-sm opacity-50 hover:opacity-100 gold-text transition-opacity">
          Sign out
        </button>
      </div>
    </div>
  );
}
