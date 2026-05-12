import { useEffect, useState } from 'react';

const categories = ['Technology', 'Business', 'Education', 'Entertainment', 'Sports', 'Health & Wellness', 'Arts & Culture', 'Food & Drink', 'Music', 'Networking', 'Other'];

const emptyScheduleItem = { time: '', title: '', description: '', speaker: '' };

const emptyForm = {
  title: '',
  description: '',
  category: 'Technology',
  date: '',
  endDate: '',
  location: '',
  venue: '',
  isOnline: false,
  onlineLink: '',
  image: '',
  price: 0,
  capacity: 1,
  status: 'published',
  featured: false,
  tagsText: '',
  schedule: [emptyScheduleItem]
};

export default function EventForm({ initialValues, onSubmit, loading, submitLabel = 'Save Event' }) {
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    if (initialValues) {
      setFormData({
        ...emptyForm,
        ...initialValues,
        date: initialValues.date ? new Date(initialValues.date).toISOString().slice(0, 16) : '',
        endDate: initialValues.endDate ? new Date(initialValues.endDate).toISOString().slice(0, 16) : '',
        tagsText: Array.isArray(initialValues.tags) ? initialValues.tags.join(', ') : '',
        schedule: initialValues.schedule?.length ? initialValues.schedule : [emptyScheduleItem]
      });
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleScheduleChange = (index, key, value) => {
    setFormData((current) => ({
      ...current,
      schedule: current.schedule.map((item, scheduleIndex) => (scheduleIndex === index ? { ...item, [key]: value } : item))
    }));
  };

  const addScheduleItem = () => setFormData((current) => ({ ...current, schedule: [...current.schedule, emptyScheduleItem] }));
  const removeScheduleItem = (index) => setFormData((current) => ({ ...current, schedule: current.schedule.filter((_, scheduleIndex) => scheduleIndex !== index) }));

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tagsText.split(',').map((tag) => tag.trim()).filter(Boolean),
      schedule: formData.schedule.filter((item) => item.time && item.title),
      price: Number(formData.price),
      capacity: Number(formData.capacity)
    };
    delete payload.tagsText;
    onSubmit(payload);
  };

  return (
    <form className="card border-0 shadow-soft" onSubmit={handleSubmit}>
      <div className="card-body p-4">
        <div className="row g-3">
          <div className="col-md-8">
            <label className="form-label">Title</label>
            <input name="title" value={formData.title} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Category</label>
            <select name="category" value={formData.category} onChange={handleChange} className="form-select">
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} className="form-control" rows="5" required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Date and time</label>
            <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-4">
            <label className="form-label">End date and time</label>
            <input type="datetime-local" name="endDate" value={formData.endDate} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Status</label>
            <select name="status" value={formData.status} onChange={handleChange} className="form-select">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Location</label>
            <input name="location" value={formData.location} onChange={handleChange} className="form-control" required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Venue</label>
            <input name="venue" value={formData.venue} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Price</label>
            <input type="number" name="price" value={formData.price} onChange={handleChange} className="form-control" min="0" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Capacity</label>
            <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} className="form-control" min="1" required />
          </div>
          <div className="col-md-4">
            <label className="form-label">Image URL</label>
            <input name="image" value={formData.image} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Online event link</label>
            <input name="onlineLink" value={formData.onlineLink} onChange={handleChange} className="form-control" disabled={!formData.isOnline} />
          </div>
          <div className="col-md-6 d-flex align-items-end gap-4 flex-wrap">
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="isOnline" name="isOnline" checked={formData.isOnline} onChange={handleChange} />
              <label className="form-check-label" htmlFor="isOnline">Online event</label>
            </div>
            <div className="form-check form-switch">
              <input className="form-check-input" type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleChange} />
              <label className="form-check-label" htmlFor="featured">Featured</label>
            </div>
          </div>
          <div className="col-12">
            <label className="form-label">Tags</label>
            <input name="tagsText" value={formData.tagsText} onChange={handleChange} className="form-control" placeholder="Technology, Meetup, Startup" />
          </div>
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <label className="form-label mb-0">Schedule</label>
              <button type="button" className="btn btn-outline-info btn-sm" onClick={addScheduleItem}>Add item</button>
            </div>
            <div className="schedule-stack">
              {formData.schedule.map((item, index) => (
                <div className="schedule-item p-3 rounded-4 mb-3" key={`${index}-${item.time}-${item.title}`}>
                  <div className="row g-3">
                    <div className="col-md-3"><input className="form-control" placeholder="09:00 AM" value={item.time} onChange={(event) => handleScheduleChange(index, 'time', event.target.value)} /></div>
                    <div className="col-md-4"><input className="form-control" placeholder="Session title" value={item.title} onChange={(event) => handleScheduleChange(index, 'title', event.target.value)} /></div>
                    <div className="col-md-3"><input className="form-control" placeholder="Speaker" value={item.speaker} onChange={(event) => handleScheduleChange(index, 'speaker', event.target.value)} /></div>
                    <div className="col-md-2 d-grid"><button type="button" className="btn btn-outline-danger" onClick={() => removeScheduleItem(index)} disabled={formData.schedule.length === 1}>Remove</button></div>
                    <div className="col-12"><textarea className="form-control" rows="2" placeholder="Short description" value={item.description} onChange={(event) => handleScheduleChange(index, 'description', event.target.value)} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-12 d-grid d-md-flex justify-content-md-end">
            <button className="btn btn-info btn-lg px-4 fw-semibold" type="submit" disabled={loading}>{loading ? 'Saving...' : submitLabel}</button>
          </div>
        </div>
      </div>
    </form>
  );
}