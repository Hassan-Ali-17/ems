import api from './api';

export const getEvents = (params = {}) => api.get('/events', { params });
export const getEvent = (id) => api.get(`/events/${id}`);
export const createEvent = (payload) => api.post('/events', payload);
export const updateEvent = (id, payload) => api.put(`/events/${id}`, payload);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const getMyEvents = () => api.get('/events/my');
export const registerForEvent = (id) => api.post(`/events/${id}/register`);
export const getEventRegistrations = (id) => api.get(`/events/${id}/registrations`);
export const getMyRegistrations = () => api.get('/registrations/me');
export const cancelRegistration = (id) => api.delete(`/registrations/${id}`);
export const downloadTicket = (id) => api.get(`/registrations/${id}/ticket`, { responseType: 'blob' });