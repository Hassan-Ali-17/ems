import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loading from './Loading';

export default function RoleRoute({ roles, children }) {
  const { token, user, initializing } = useAuth();

  if (initializing) {
    return <Loading label="Checking permissions..." />;
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin' : user.role === 'organizer' ? '/organizer' : '/profile'} replace />;
  }

  return children;
}