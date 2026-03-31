import axiosInstance from './axiosInstance';

/**
 * Get current credit balance for the authenticated user.
 */
export const getBalance = () => axiosInstance.get('/api/credits/balance');

/**
 * Get paginated credit transaction history.
 */
export const getHistory = (page = 0, size = 10) =>
  axiosInstance.get(`/api/credits/history?page=${page}&size=${size}`);

/**
 * Get list of available credit packages.
 */
export const getPackages = () => axiosInstance.get('/api/credits/packages');

/**
 * Create a Razorpay order for a specific credit package.
 */
export const createOrder = (packageName) =>
  axiosInstance.post('/api/credits/purchase/order', { packageName });

/**
 * Verify Razorpay payment and add credits to account.
 */
export const verifyPayment = (razorpayOrderId, razorpayPaymentId, razorpaySignature) =>
  axiosInstance.post('/api/credits/purchase/verify', {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature
  });
