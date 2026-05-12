import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import Loading from '../../components/common/Loading';
import { deleteEvent, getMyEvents } from '../../services/eventService';
import { formatDateTime } from '../../utils/format';

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await getMyEvents();
      setEvents(response.data.events);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    await deleteEvent(id);
    toast.success('Event removed.');
    fetchEvents();
  };

  return (
    <section className="container py-5">
      <PageHeader eyebrow="Organizer" title="My events" description="Create and manage the events you own." action={<Link to="/organizer/events/new" className="btn btn-info fw-semibold">Create event</Link>} />
      {loading ? (
        <Loading />
      ) : (
        <div className="card border-0 shadow-soft">
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead><tr><th>Title</th><th>Date</th><th>Status</th><th>Capacity</th><th className="text-end">Actions</th></tr></thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event._id}>
                    <td>{event.title}</td>
                    <td>{formatDateTime(event.date)}</td>
                    <td>{event.status}</td>
                    <td>{event.registeredCount}/{event.capacity}</td>
                    <td className="text-end d-flex gap-2 justify-content-end flex-wrap">
                      <Link className="btn btn-outline-info btn-sm" to={`/organizer/events/${event._id}/edit`}>Edit</Link>
                      <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(event._id)}>Delete</button>
                    </td>
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