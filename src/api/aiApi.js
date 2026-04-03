import axiosInstance from './axiosInstance';

export const generateRoadmap = (payload) => {
  return axiosInstance.post('/api/ai/roadmap', payload);
};

export const analyzeSkillGap = (payload) => {
  return axiosInstance.post('/api/ai/skill-gap', payload);
};

export const scoreResume = (payload) => {
  return axiosInstance.post('/api/ai/resume-score', payload);
};

export const uploadResume = (file, targetRole) => {
  const formData = new FormData();
  formData.append('file', file);
  if (targetRole) formData.append('targetRole', targetRole);
  return axiosInstance.post('/api/ai/resume-upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const chatPublic = (message) =>
  axiosInstance.post('/api/chat/public', { message });

export const chatAuthenticated = (message) =>
  axiosInstance.post('/api/chat/message', { message });
