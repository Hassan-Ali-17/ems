import { useEffect, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Loading from '../../components/common/Loading';
import { getDashboardStats } from '../../services/adminService';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getDashboardStats();
        setData(response.data);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <Loading />;

  const stats = data?.stats || {};

  return (
    <section className="container py-5">
      <PageHeader eyebrow="Admin" title="Control center" description="Manage users, events, registrations, and system activity." />
      <div className="row g-3 mb-4">
        {[
          ['Users', stats.totalUsers],
          ['Events', stats.totalEvents],
          ['Registrations', stats.totalRegistrations],
          ['Upcoming', stats.upcomingEvents]
        ].map(([label, value]) => (
          <div className="col-md-6 col-xl-3" key={label}><div className="stat-card"><div className="stat-label">{label}</div><div className="stat-number">{value ?? 0}</div></div></div>
        ))}
      </div>
      <div className="row g-4">
        <div className="col-lg-6">
          <div className="card border-0 shadow-soft h-100"><div className="card-body p-4"><h5 className="fw-bold mb-3">Users by role</h5><div className="d-grid gap-2"><div className="d-flex justify-content-between"><span>Attendee</span><strong>{stats.usersByRole?.attendee ?? 0}</strong></div><div className="d-flex justify-content-between"><span>Organizer</span><strong>{stats.usersByRole?.organizer ?? 0}</strong></div><div className="d-flex justify-content-between"><span>Admin</span><strong>{stats.usersByRole?.admin ?? 0}</strong></div></div></div></div>
        </div>
        <div className="col-lg-6">
          <div className="card border-0 shadow-soft h-100"><div className="card-body p-4"><h5 className="fw-bold mb-3">Recent activity</h5><div className="small text-muted mb-2">Recent users</div><div className="d-grid gap-2 mb-3">{data?.recentUsers?.map((item) => (<div key={item._id} className="d-flex justify-content-between align-items-center border-bottom py-2"><span>{item.name}</span><span className="text-muted small">{item.role}</span></div>))}</div><div className="small text-muted mb-2">Recent events</div><div className="d-grid gap-2">{data?.recentEvents?.map((item) => (<div key={item._id} className="d-flex justify-content-between align-items-center border-bottom py-2"><span>{item.title}</span><span className="text-muted small">{item.status}</span></div>))}</div></div></div>
        </div>
      </div>
    </section>
  );
}