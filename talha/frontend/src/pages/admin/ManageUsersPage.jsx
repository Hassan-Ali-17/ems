import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Loading from '../../components/common/Loading';
import { deactivateUser, getUsers, updateUser } from '../../services/adminService';
import { toast } from 'react-toastify';

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', role: '' });

  const fetchUsers = async (currentFilters = filters) => {
    setLoading(true);
    try {
      const response = await getUsers(currentFilters);
      setUsers(response.data.users);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    await updateUser(id, { role });
    toast.success('User role updated.');
    fetchUsers();
  };

  const handleDeactivate = async (id) => {
    await deactivateUser(id);
    toast.success('User deactivated.');
    fetchUsers();
  };

  return (
    <section className="container py-5">
      <PageHeader eyebrow="Admin" title="Manage users" description="Search users, update roles, and deactivate accounts." />
      <div className="card border-0 shadow-soft mb-4"><div className="card-body"><div className="row g-3"><div className="col-md-6"><input className="form-control" placeholder="Search name, email, or organization" value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} /></div><div className="col-md-3"><select className="form-select" value={filters.role} onChange={(event) => setFilters({ ...filters, role: event.target.value })}><option value="">All roles</option><option value="admin">Admin</option><option value="organizer">Organizer</option><option value="attendee">Attendee</option></select></div><div className="col-md-3 d-grid"><button className="btn btn-info fw-semibold" onClick={() => fetchUsers(filters)}>Apply filters</button></div></div></div></div>
      {loading ? (
        <Loading />
      ) : (
        <div className="card border-0 shadow-soft">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Status</th><th className="text-end">Actions</th></tr></thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td style={{ minWidth: 150 }}>
                      <select className="form-select form-select-sm" value={user.role} onChange={(event) => handleRoleChange(user._id, event.target.value)}>
                        <option value="admin">Admin</option><option value="organizer">Organizer</option><option value="attendee">Attendee</option>
                      </select>
                    </td>
                    <td><span className={`badge ${user.isActive ? 'text-bg-success' : 'text-bg-secondary'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="text-end"><button className="btn btn-outline-danger btn-sm" onClick={() => handleDeactivate(user._id)} disabled={!user.isActive}>Deactivate</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}