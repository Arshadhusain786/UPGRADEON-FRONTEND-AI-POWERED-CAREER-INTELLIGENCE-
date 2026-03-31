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
