import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UnlockPage from './pages/UnlockPage';
import Dashboard from './pages/Dashboard';

function AppRoutes() {
  const { token, isLocked } = useAuth();
  const [page, setPage] = useState<'login' | 'register'>('login');

  if (!token) {
    return page === 'login'
      ? <LoginPage onSwitch={() => setPage('register')} />
      : <RegisterPage onSwitch={() => setPage('login')} />;
  }

  if (isLocked) return <UnlockPage />;

  return <Dashboard />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
