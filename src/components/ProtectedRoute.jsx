import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <p className="text-center text-frost-700 py-12 animate-pulse">Cargando sesión…</p>
    );
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
