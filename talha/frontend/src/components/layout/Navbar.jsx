import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

const navLinkClass = ({ isActive }) => `nav-link fw-semibold ${isActive ? 'active text-info' : 'text-light-emphasis'}`;

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top glass-nav">
      <div className="container py-2">
        <Link className="navbar-brand fw-bold letter-space" to="/">
          EMS
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#emsNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="emsNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-2">
            <li className="nav-item"><NavLink className={navLinkClass} to="/events">Events</NavLink></li>
            {token && user?.role !== 'attendee' ? <li className="nav-item"><NavLink className={navLinkClass} to="/dashboard">Dashboard</NavLink></li> : null}
            {user?.role === 'admin' ? <li className="nav-item"><NavLink className={navLinkClass} to="/admin">Admin</NavLink></li> : null}
            {user?.role === 'admin' ? <li className="nav-item"><NavLink className={navLinkClass} to="/admin/users">Users</NavLink></li> : null}
            {user?.role === 'organizer' || user?.role === 'admin' ? <li className="nav-item"><NavLink className={navLinkClass} to="/organizer/events">My Events</NavLink></li> : null}
          </ul>

          <div className="d-flex gap-2 align-items-center">
            <button
              className="theme-toggle"
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            {token && user ? (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/profile">{user?.name?.split(' ')[0]}</Link>
                <button className="btn btn-info btn-sm fw-semibold" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link className="btn btn-outline-light btn-sm" to="/login">Login</Link>
                <Link className="btn btn-info btn-sm fw-semibold" to="/register">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
