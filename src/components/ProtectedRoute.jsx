import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loading from './ui/Loading';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { role, loading } = useAuth();

  if (loading) {
    return <Loading message="Verificando sesión…" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
