import axiosInstance from './axiosInstance';

/**
 * Get referral statistics for the authenticated user.
 */
export const getReferralStats = () => axiosInstance.get('/api/referrals/stats');

/**
 * Get paginated list of referrals for the authenticated user.
 */
export const getReferralsList = (page = 0, size = 10) =>
  axiosInstance.get('/api/referrals/list', { params: { page, size } });
