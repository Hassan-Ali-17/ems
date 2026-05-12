import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loading from './Loading';

export default function ProtectedRoute({ children }) {
  const { token, user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <Loading label="Checking session..." />;
  }

  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}