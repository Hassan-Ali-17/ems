import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../../components/common/PageHeader';
import Loading from '../../components/common/Loading';
import { getMyEvents, getEventRegistrations } from '../../services/eventService';

export default function OrganizerDashboardPage() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ totalEvents: 0, totalRegistrations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsResponse = await getMyEvents();
        setEvents(eventsResponse.data.events);

        let totalRegistrations = 0;
        for (const event of eventsResponse.data.events.slice(0, 5)) {
          const registrationsResponse = await getEventRegistrations(event._id).catch(() => ({ data: { registrations: [] } }));
          totalRegistrations += registrationsResponse.data.registrations.length;
        }

        setStats({ totalEvents: eventsResponse.data.events.length, totalRegistrations });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <Loading />;

  return (
    <section className="container py-5">
      <PageHeader eyebrow="Organizer" title="Event dashboard" description="Create events, monitor registrations, and update your schedule." action={<Link to="/organizer/events/new" className="btn btn-info fw-semibold">Create event</Link>} />
      <div className="row g-3 mb-4">
        <div className="col-md-6 col-xl-3"><div className="stat-card"><div className="stat-label">My events</div><div className="stat-number">{stats.totalEvents}</div></div></div>
        <div className="col-md-6 col-xl-3"><div className="stat-card"><div className="stat-label">Registrations</div><div className="stat-number">{stats.totalRegistrations}</div></div></div>
      </div>
      <div className="card border-0 shadow-soft"><div className="card-body p-4"><h5 className="fw-bold mb-3">Recent events</h5><div className="d-grid gap-2">{events.slice(0, 5).map((event) => (<div key={event._id} className="d-flex justify-content-between align-items-center border-bottom py-2"><div><div className="fw-semibold">{event.title}</div><div className="small text-muted">{event.status}</div></div><Link to={`/organizer/events/${event._id}/edit`} className="btn btn-outline-info btn-sm">Edit</Link></div>))}</div></div></div>
    </section>
  );
}