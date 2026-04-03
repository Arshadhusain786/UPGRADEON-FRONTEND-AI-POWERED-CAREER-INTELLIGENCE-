import axios from 'axios';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../utils/tokenStorage';

const API_BASE_URL = 'http://localhost:8080'; // Default Spring Boot port

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Standardize data and handle 401
axiosInstance.interceptors.response.use(
  (response) => {
    // Return only the data part of the response
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle Token Refresh on 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new Error('No refresh token');

        // Note: use axios directly here to avoid interceptor loop
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refreshToken,
        });

        // Backend returns ApiResponse<TokenResponse> -> response.data.data
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        setTokens(accessToken, newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Standardize error structure for components
    const errorResponse = {
      message: error.response?.data?.message || 'Something went wrong',
      status: error.response?.status,
      data: error.response?.data?.data || null,
    };

    return Promise.reject(errorResponse);
  }
);

export default axiosInstance;
