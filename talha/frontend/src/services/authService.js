import api from './api';

export const register = (payload) => api.post('/auth/register', payload);
export const login = (payload) => api.post('/auth/login', payload);
export const me = () => api.get('/auth/me');
export const updateProfile = (payload) => api.put('/auth/profile', payload);
export const changePassword = (payload) => api.put('/auth/change-password', payload);