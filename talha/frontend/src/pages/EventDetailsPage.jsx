import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageHeader from '../components/common/PageHeader';
import Loading from '../components/common/Loading';
import useAuth from '../hooks/useAuth';
import { formatCurrency, formatDateTime } from '../utils/format';
import { getEvent, registerForEvent, downloadTicket } from '../services/eventService';

export default function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await getEvent(id);
        setEvent(response.data.event);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const submitRegister = async () => {
    setSubmitting(true);
    try {
      const response = await registerForEvent(id);
      setRegistration(response.data.registration);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const downloadRegisteredTicket = async () => {
    if (!registration) return;
    const response = await downloadTicket(registration._id);
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${registration.ticketId}.pdf`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return <Loading />;
  }

  if (!event) {
    return <div className="container py-5 text-center text-muted">Event not found.</div>;
  }

  return (
    <section className="container py-5">
      <PageHeader
        eyebrow={event.category}
        title={event.title}
        description={`${formatDateTime(event.date)} • ${event.location}`}
        action={user ? null : <Link to="/login" className="btn btn-outline-info">Login to register</Link>}
      />

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card border-0 shadow-soft mb-4">
            <div className="card-body p-4">
              {event.image ? <img src={event.image} alt={event.title} className="img-fluid rounded-4 mb-4 event-hero-image" /> : null}
              <p className="text-light-emphasis lh-lg">{event.description}</p>
              <div className="row g-3 mt-4">
                <div className="col-md-6"><strong>Date:</strong> {formatDateTime(event.date)}</div>
                <div className="col-md-6"><strong>Price:</strong> {event.price > 0 ? formatCurrency(event.price) : 'Free'}</div>
                <div className="col-md-6"><strong>Capacity:</strong> {event.capacity}</div>
                <div className="col-md-6"><strong>Seats left:</strong> {Math.max(event.capacity - event.registeredCount, 0)}</div>
                <div className="col-md-6"><strong>Venue:</strong> {event.venue || 'N/A'}</div>
                <div className="col-md-6"><strong>Organizer:</strong> {event.organizer?.name || 'EMS'}</div>
              </div>
            </div>
          </div>

          <div className="card border-0 shadow-soft">
            <div className="card-body p-4">
              <h4 className="fw-bold mb-3">Schedule</h4>
              {event.schedule?.length ? (
                <div className="timeline">
                  {event.schedule.map((item, index) => (
                    <div key={`${item.time}-${index}`} className="timeline-item">
                      <div className="timeline-time">{item.time}</div>
                      <div>
                        <h6 className="fw-bold mb-1">{item.title}</h6>
                        <div className="text-muted small mb-1">{item.speaker}</div>
                        <p className="mb-0 text-muted">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted">No schedule has been published for this event.</div>
              )}
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card border-0 shadow-soft sticky-panel">
            <div className="card-body p-4">
              <h5 className="fw-bold">Registration</h5>
              <div className="d-flex justify-content-between mb-2"><span className="text-muted">Status</span><span className="badge text-bg-success">{event.status}</span></div>
              <div className="d-flex justify-content-between mb-2"><span className="text-muted">Registered</span><span>{event.registeredCount}</span></div>
              <div className="d-grid gap-2 mt-3">
                {!user ? (
                  <Link className="btn btn-info fw-semibold" to="/login">Login to register</Link>
                ) : registration ? (
                  <>
                    <button className="btn btn-info fw-semibold" onClick={downloadRegisteredTicket}>Download ticket</button>
                    <button className="btn btn-outline-light" onClick={() => navigate('/profile')}>Go to profile</button>
                  </>
                ) : (
                  <button className="btn btn-info fw-semibold" onClick={submitRegister} disabled={submitting}>{submitting ? 'Registering...' : 'Register now'}</button>
                )}
              </div>
              <hr className="border-secondary-subtle my-4" />
              <div className="text-muted small">By registering you agree to receive event updates and ticket notifications inside EMS.</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}