import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function DashboardPage() {
  const { user } = useAuth();

  if (user?.role === 'admin') return <Navigate to="/admin" replace />;
  if (user?.role === 'organizer') return <Navigate to="/organizer" replace />;
  return <Navigate to="/profile" replace />;
}