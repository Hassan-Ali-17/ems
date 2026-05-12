import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleRoute from './components/common/RoleRoute';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import ManageUsersPage from './pages/admin/ManageUsersPage';
import ManageEventsPage from './pages/admin/ManageEventsPage';
import OrganizerDashboardPage from './pages/organizer/OrganizerDashboardPage';
import OrganizerEventsPage from './pages/organizer/OrganizerEventsPage';
import CreateEditEventPage from './pages/organizer/CreateEditEventPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/admin" element={<RoleRoute roles={["admin"]}><AdminDashboardPage /></RoleRoute>} />
        <Route path="/admin/users" element={<RoleRoute roles={["admin"]}><ManageUsersPage /></RoleRoute>} />
        <Route path="/admin/events" element={<RoleRoute roles={["admin"]}><ManageEventsPage /></RoleRoute>} />
        <Route path="/organizer" element={<RoleRoute roles={["organizer", "admin"]}><OrganizerDashboardPage /></RoleRoute>} />
        <Route path="/organizer/events" element={<RoleRoute roles={["organizer", "admin"]}><OrganizerEventsPage /></RoleRoute>} />
        <Route path="/organizer/events/new" element={<RoleRoute roles={["organizer", "admin"]}><CreateEditEventPage mode="create" /></RoleRoute>} />
        <Route path="/organizer/events/:id/edit" element={<RoleRoute roles={["organizer", "admin"]}><CreateEditEventPage mode="edit" /></RoleRoute>} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}