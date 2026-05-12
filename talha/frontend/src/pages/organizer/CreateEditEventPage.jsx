import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageHeader from '../../components/common/PageHeader';
import Loading from '../../components/common/Loading';
import EventForm from '../../components/events/EventForm';
import { createEvent, getEvent, updateEvent } from '../../services/eventService';

export default function CreateEditEventPage({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState(null);
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode !== 'edit') return;

    const fetchEvent = async () => {
      try {
        const response = await getEvent(id);
        setInitialValues(response.data.event);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, mode]);

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (mode === 'edit') {
        await updateEvent(id, payload);
        toast.success('Event updated successfully.');
      } else {
        await createEvent(payload);
        toast.success('Event created successfully.');
      }
      navigate('/organizer/events');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to save event.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <section className="container py-5">
      <PageHeader eyebrow="Organizer" title={mode === 'edit' ? 'Edit event' : 'Create event'} description="Fill in the event details, schedule, and registration settings." />
      <EventForm initialValues={initialValues} onSubmit={handleSubmit} loading={saving} submitLabel={mode === 'edit' ? 'Update event' : 'Create event'} />
    </section>
  );
}