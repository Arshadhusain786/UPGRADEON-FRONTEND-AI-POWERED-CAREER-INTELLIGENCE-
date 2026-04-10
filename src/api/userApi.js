import axiosInstance from './axiosInstance';

/** Get the current user's profile */
export const getProfile = () => axiosInstance.get('/api/users/profile');

/** Update the current user's profile */
export const updateProfile = (payload) => axiosInstance.put('/api/users/profile', payload);
