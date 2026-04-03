import axiosInstance from './axiosInstance';

export const registerUser = (userData) => {
  return axiosInstance.post('/api/auth/register', userData);
};

export const loginUser = (credentials) => {
  return axiosInstance.post('/api/auth/login', credentials);
};

export const refreshToken = (refreshToken) => {
  return axiosInstance.post('/api/auth/refresh', { refreshToken });
};

export const getCurrentUser = () => {
  return axiosInstance.get('/api/auth/me');
};

export const updateProfile = (userData) => {
  return axiosInstance.put('/api/auth/profile', userData);
};

export const changePassword = (passwordData) => {
  // passwordData: { currentPassword, newPassword }
  return axiosInstance.put('/api/auth/password', passwordData);
};
