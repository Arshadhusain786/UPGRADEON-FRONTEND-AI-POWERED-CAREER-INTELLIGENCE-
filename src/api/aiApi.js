import axiosInstance from './axiosInstance';

export const generateRoadmap = async (payload) => {
  // payload: { currentSkills: string, targetRole: string, experienceLevel: string }
  return await axiosInstance.post('/api/ai/roadmap', payload);
};

export const analyzeSkillGap = async (payload) => {
  // payload: { currentSkills: string, targetRole: string }
  return await axiosInstance.post('/api/ai/skill-gap', payload);
};

export const scoreResume = async (payload) => {
  // payload: { resumeText: string }
  return await axiosInstance.post('/api/ai/resume-score', payload);
};
