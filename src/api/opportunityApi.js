import axiosInstance from './axiosInstance';

export const getPosts = (page = 0, size = 10, search = '', type = '') =>
  axiosInstance.get('/api/opportunities', {
    params: {
      page,
      size,
      search: search || undefined,
      type: type || undefined,
    },
  });

export const getPost = (id) => axiosInstance.get(`/api/opportunities/${id}`);

export const createPost = (data) => axiosInstance.post('/api/opportunities', data);

export const updatePost = (id, data) => axiosInstance.put(`/api/opportunities/${id}`, data);

export const closePost = (id) => axiosInstance.delete(`/api/opportunities/${id}`);

export const getMyPosts = (page = 0, size = 10) =>
  axiosInstance.get('/api/opportunities/my-posts', { params: { page, size } });

export const boostPost = (id) => axiosInstance.post(`/api/opportunities/${id}/boost`);
