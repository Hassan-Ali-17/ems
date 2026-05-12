import api from './api';

export const getDashboardStats = () => api.get('/admin/dashboard');
export const getUsers = (params = {}) => api.get('/admin/users', { params });
export const updateUser = (id, payload) => api.put(`/admin/users/${id}`, payload);
export const deactivateUser = (id) => api.delete(`/admin/users/${id}`);