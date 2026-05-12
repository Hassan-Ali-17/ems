import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import Loading from '../components/common/Loading';
import EventCard from '../components/events/EventCard';
import EventFilters from '../components/events/EventFilters';
import { getEvents } from '../services/eventService';

const defaultFilters = { search: '', category: '', location: '', dateFrom: '', dateTo: '', minPrice: '', maxPrice: '', sort: '-date' };

export default function EventsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(defaultFilters);
  const [events, setEvents] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);

  const loadEvents = async (page = 1, currentFilters = filters) => {
    setLoading(true);
    try {
      const response = await getEvents({ ...currentFilters, page, limit: 9 });
      setEvents(response.data.events);
      setPagination({ page: response.data.pagination.page, totalPages: response.data.pagination.totalPages });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const page = Number(searchParams.get('page') || 1);
    const nextFilters = { ...defaultFilters };

    Object.keys(defaultFilters).forEach((key) => {
      const value = searchParams.get(key);
      if (value) nextFilters[key] = value;
    });

    setFilters(nextFilters);
    loadEvents(page, nextFilters);
  }, [searchParams]);

  const queryParams = useMemo(() => ({ ...filters, page: pagination.page }), [filters, pagination.page]);

  const handleFiltersChange = (nextFilters) => {
    setFilters(nextFilters);
    const params = new URLSearchParams();
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    params.set('page', '1');
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', String(page));
    setSearchParams(params);
  };

  return (
    <section className="container py-5">
      <PageHeader eyebrow="Discover" title="Browse events" description="Search by category, location, date, or price. Public listings show only published events." />
      <EventFilters value={queryParams} onChange={handleFiltersChange} onReset={() => { setFilters(defaultFilters); setSearchParams({ page: '1' }); }} />
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="row g-4">
            {events.map((event) => (
              <div className="col-md-6 col-xl-4" key={event._id}><EventCard event={event} /></div>
            ))}
            {!events.length ? <div className="col-12 text-muted">No events match your filters.</div> : null}
          </div>
          <div className="d-flex justify-content-center gap-2 mt-4">
            <button className="btn btn-outline-light" onClick={() => handlePageChange(Math.max(pagination.page - 1, 1))} disabled={pagination.page <= 1}>Previous</button>
            <span className="btn btn-info disabled">Page {pagination.page} of {pagination.totalPages}</span>
            <button className="btn btn-outline-light" onClick={() => handlePageChange(Math.min(pagination.page + 1, pagination.totalPages))} disabled={pagination.page >= pagination.totalPages}>Next</button>
          </div>
        </>
      )}
    </section>
  );
}