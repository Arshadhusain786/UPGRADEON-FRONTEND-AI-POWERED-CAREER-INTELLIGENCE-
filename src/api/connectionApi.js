import axiosInstance from './axiosInstance';

export const sendRequest = (postId, message) =>
  axiosInstance.post('/api/connections/send', { postId, message });

export const respondRequest = (connectionId, action, posterNote) =>
  axiosInstance.post(`/api/connections/${connectionId}/respond`, { action, posterNote });

export const cancelRequest = (id) =>
  axiosInstance.post(`/api/connections/${id}/cancel`);

export const markHired = (id) =>
  axiosInstance.post(`/api/connections/${id}/mark-hired`);

export const getSentRequests = (page = 0, size = 10) =>
  axiosInstance.get('/api/connections/sent', { params: { page, size } });

export const getReceivedRequests = (page = 0, size = 10) =>
  axiosInstance.get('/api/connections/received', { params: { page, size } });

export const getJobDashboard = () =>
  axiosInstance.get('/api/connections/dashboard');
