import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function UnlockPage() {
  const { setVaultKey, logout, user } = useAuth();
  const [key, setKey] = useState('');
  const [error, setError] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.length < 4) {
      setError('Vault key must be at least 4 characters');
      return;
    }
    setVaultKey(key);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at center, #1a1008 0%, #0d0d0d 70%)' }}>
      <div className="wow-panel p-8 w-full max-w-md animate-fade-in text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold gold-text gold-glow tracking-wider mb-2">VAULT LOCKED</h1>
        <p className="text-sm opacity-70 mb-6">Enter your secret key to decrypt your vault, {user?.email}</p>

        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="password"
            value={key}
            onChange={e => { setKey(e.target.value); setError(''); }}
            className="wow-input text-center text-lg tracking-widest"
            placeholder="Enter vault key..."
            autoFocus
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" className="wow-btn w-full lock-pulse">
            🔓 Unlock Vault
          </button>
        </form>

        <button onClick={logout} className="mt-6 text-sm opacity-50 hover:opacity-100 gold-text transition-opacity">
          Sign out
        </button>
      </div>
    </div>
  );
}
