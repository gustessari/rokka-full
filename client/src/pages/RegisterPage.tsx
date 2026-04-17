import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage({ onSwitch }: { onSwitch: () => void }) {
  const { register, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await register(email, password);
      await login(email, password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'radial-gradient(ellipse at center, #1a1008 0%, #0d0d0d 70%)' }}>
      <div className="wow-panel p-8 w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold gold-text gold-glow tracking-wider">⚔️ ROKKA</h1>
          <p className="text-sm mt-2 opacity-70 tracking-widest uppercase">Forge Your Vault</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold gold-text mb-1 uppercase tracking-wider text-xs">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="wow-input" placeholder="warrior@rokka.dev" required />
          </div>
          <div>
            <label className="block text-sm font-semibold gold-text mb-1 uppercase tracking-wider text-xs">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="wow-input" placeholder="••••••••" required />
          </div>
          <div>
            <label className="block text-sm font-semibold gold-text mb-1 uppercase tracking-wider text-xs">Confirm Password</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} className="wow-input" placeholder="••••••••" required />
          </div>

          {error && <p className="text-red-400 text-sm text-center">{error}</p>}

          <button type="submit" className="wow-btn w-full" disabled={loading}>
            {loading ? 'Forging...' : 'Forge Account'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm opacity-70">
          Already have an account?{' '}
          <button onClick={onSwitch} className="gold-text hover:underline font-semibold">
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
