import axiosInstance from './axiosInstance';

/** Get the current user's profile */
export const getProfile = () => axiosInstance.get('/api/users/profile');

/** Update the current user's profile */
export const updateProfile = (payload) => axiosInstance.put('/api/users/profile', payload);

/** Get user's AI connection summary */
export const getAiConnectionSummary = (resumeText, postTitle, seekerName) =>
  axiosInstance.post('/api/connections/ai-summary', { resumeText, postTitle, seekerName });
