import apiClient from './apiClient';

/**
 * Auth Service — Mocked for frontend testing.
 * Uses localStorage to simulate a database.
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const authService = {
  login: async (credentials) => {
    await delay(600); // simulate network latency
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    const user = users.find((u) => u.email === credentials.email && u.password === credentials.password);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const { password, ...userWithoutPassword } = user;
    return {
      token: `mock-jwt-token-${Date.now()}`,
      user: userWithoutPassword,
    };
  },

  register: async (userData) => {
    await delay(600);
    const users = JSON.parse(localStorage.getItem('mock_users') || '[]');
    
    if (users.some((u) => u.email === userData.email)) {
      throw new Error('User with this email already exists');
    }

    const newUser = {
      ...userData,
      _id: `user_${Date.now()}`,
      isActive: true, // Used in librarian dashboard
    };

    users.push(newUser);
    localStorage.setItem('mock_users', JSON.stringify(users));

    const { password, ...userWithoutPassword } = newUser;
    return {
      token: `mock-jwt-token-${Date.now()}`,
      user: userWithoutPassword,
    };
  },

  logout: async () => {
    await delay(300);
    return { success: true };
  },

  getProfile: async () => {
    await delay(400);
    // Since we're mocking, we normally get user details from local storage Context instead.
    // We'll just return a mock response that forces a re-login if needed.
    throw new Error('Session expired, please log in again.');
  },
};

export default authService;
