import apiClient from './apiClient';

/**
 * Auth Service — wraps all /auth endpoints.
 * Add more methods (forgotPassword, refreshToken, etc.) as needed.
 */
const authService = {
  login: (credentials) => apiClient.post('/auth/login', credentials),
  register: (userData) => apiClient.post('/auth/register', userData),
  logout: () => apiClient.post('/auth/logout'),
  getProfile: () => apiClient.get('/auth/me'),
};

export default authService;
