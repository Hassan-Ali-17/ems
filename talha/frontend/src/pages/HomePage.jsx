import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/eventService';
import Loading from '../components/common/Loading';
import EventCard from '../components/events/EventCard';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await getEvents({ limit: 3, featured: true, sort: '-date' });
        setEvents(response.data.events);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <>
      <section className="hero-section">
        <div className="container py-5 py-lg-6">
          <div className="row align-items-center g-5">
            <div className="col-lg-7">
              <div className="hero-pill mb-3">Event management for modern campuses and communities</div>
              <h1 className="display-4 fw-black hero-title mb-3">Plan events, register attendees, and manage tickets in one place.</h1>
              <p className="lead text-light-emphasis mb-4">
                EMS gives admins, organizers, and attendees a clean workflow for creating events, handling registrations, and generating downloadable tickets.
              </p>
              <div className="d-flex flex-wrap gap-3">
                <Link to="/events" className="btn btn-info btn-lg fw-semibold px-4">Browse events</Link>
                <Link to="/register" className="btn btn-outline-light btn-lg fw-semibold px-4">Create account</Link>
              </div>
            </div>
            <div className="col-lg-5">
              <div className="hero-panel p-4 p-lg-5 rounded-5 shadow-soft">
                <div className="d-flex justify-content-between mb-3">
                  <span className="badge text-bg-info">Live registrations</span>
                  <span className="text-muted">Mobile ready</span>
                </div>
                <div className="stats-grid">
                  <div><div className="stat-value">Admin</div><div className="stat-label">full control</div></div>
                  <div><div className="stat-value">Organizer</div><div className="stat-label">event workflow</div></div>
                  <div><div className="stat-value">Attendee</div><div className="stat-label">browse and book</div></div>
                  <div><div className="stat-value">Tickets</div><div className="stat-label">PDF + QR ready</div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-4">
          <div>
            <div className="section-eyebrow">Featured</div>
            <h2 className="fw-bold mb-0">Highlighted events</h2>
          </div>
          <Link to="/events" className="btn btn-outline-info fw-semibold">View all</Link>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="row g-4">
            {events.map((event) => (
              <div className="col-md-6 col-xl-4" key={event._id}><EventCard event={event} /></div>
            ))}
            {!events.length ? <div className="col-12 text-muted">No featured events yet.</div> : null}
          </div>
        )}
      </section>
    </>
  );
}