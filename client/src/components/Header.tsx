import { useAuth } from '../context/AuthContext';

interface Props {
  onLock: () => void;
  user: { email: string; storageLimitBytes: number; storageUsedBytes: number } | null;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function Header({ onLock, user }: Props) {
  const { logout } = useAuth();
  const usagePercent = user ? Math.min((user.storageUsedBytes / user.storageLimitBytes) * 100, 100) : 0;

  return (
    <header className="flex items-center justify-between px-6 py-3 wow-panel" style={{ borderTop: 'none', borderLeft: 'none', borderRight: 'none' }}>
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold gold-text gold-glow tracking-wider">⚔️ ROKKA</h1>
        {user && (
          <div className="flex items-center gap-3 ml-4">
            <div className="storage-bar w-32">
              <div className="storage-fill" style={{ width: `${usagePercent}%` }} />
            </div>
            <span className="text-xs opacity-60">
              {formatBytes(user.storageUsedBytes)} / {formatBytes(user.storageLimitBytes)}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs opacity-50">{user?.email}</span>
        <button onClick={onLock} className="wow-btn text-xs py-1.5 px-4">
          🔒 Lock
        </button>
        <button onClick={logout} className="wow-btn wow-btn-danger text-xs py-1.5 px-4">
          Logout
        </button>
      </div>
    </header>
  );
}
