import axiosInstance from './axiosInstance';

export const registerUser = async (userData) => {
  // userData: { name, email, password, role }
  const response = await axiosInstance.post('/api/auth/register', userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  // credentials: { email, password }
  const response = await axiosInstance.post('/api/auth/login', credentials);
  return response.data;
};

export const refreshToken = async (refreshToken) => {
  const response = await axiosInstance.post('/api/auth/refresh', { refreshToken });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await axiosInstance.get('/api/auth/me');
  return response.data;
};
