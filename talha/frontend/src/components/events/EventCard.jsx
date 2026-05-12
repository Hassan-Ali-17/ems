import { Link } from 'react-router-dom';
import { formatCurrency, formatDateTime } from '../../utils/format';

export default function EventCard({ event }) {
  return (
    <div className="card event-card h-100 border-0 shadow-soft">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
          <div>
            <span className="badge rounded-pill text-bg-dark mb-2">{event.category}</span>
            <h5 className="card-title fw-bold mb-1">{event.title}</h5>
            <div className="text-muted small">{formatDateTime(event.date)}</div>
          </div>
          <div className="text-end">
            <div className="fw-bold text-info">{event.price > 0 ? formatCurrency(event.price) : 'Free'}</div>
            <div className="small text-muted">{event.remainingSeats ?? Math.max(event.capacity - event.registeredCount, 0)} seats left</div>
          </div>
        </div>
        <p className="text-muted flex-grow-1">{event.description.slice(0, 140)}{event.description.length > 140 ? '...' : ''}</p>
        <div className="d-flex justify-content-between align-items-center mt-auto">
          <div className="small text-muted">{event.location}</div>
          <Link to={`/events/${event._id}`} className="btn btn-outline-info btn-sm fw-semibold">View details</Link>
        </div>
      </div>
    </div>
  );
}