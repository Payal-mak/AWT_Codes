import apiClient from './apiClient';

/**
 * User Service — Mocked for frontend testing using localStorage.
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredUsers = () => {
  return JSON.parse(localStorage.getItem('mock_users') || '[]');
};

const userService = {
  getAll: async (params = {}) => {
    await delay(400);
    let users = getStoredUsers();
    if (params.search) {
      const q = params.search.toLowerCase();
      users = users.filter((u) => (u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)));
    }
    return { users };
  },

  getById: async (id) => {
    await delay(200);
    const user = getStoredUsers().find((u) => u._id === id);
    if (!user) throw new Error('User not found');
    return user;
  },

  update: async (id, data) => {
    await delay(400);
    const users = getStoredUsers();
    const idx = users.findIndex((u) => u._id === id);
    if (idx === -1) throw new Error('User not found');
    users[idx] = { ...users[idx], ...data };
    localStorage.setItem('mock_users', JSON.stringify(users));
    return users[idx];
  },

  remove: async (id) => {
    await delay(400);
    let users = getStoredUsers();
    users = users.filter((u) => u._id !== id);
    localStorage.setItem('mock_users', JSON.stringify(users));
    return { success: true };
  },
};

export default userService;
