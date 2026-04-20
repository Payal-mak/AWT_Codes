const { users } = require('../../infrastructure/repositories/MockRepositories');

const getUsers = () => users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }));

const getUserById = (id) => {
  const user = users.find(u => u.id === id);
  if (!user) throw new Error('User not found');
  return { id: user.id, name: user.name, email: user.email, role: user.role };
};

const updateUser = (id, data) => {
  const user = users.find(u => u.id === id);
  if (!user) throw new Error('User not found');
  if (data.name) user.name = data.name;
  if (data.role) user.role = data.role;
  return { id: user.id, name: user.name, email: user.email, role: user.role };
};

const deleteUser = (id) => {
  const index = users.findIndex(u => u.id === id);
  if (index === -1) throw new Error('User not found');
  const user = users.splice(index, 1)[0];
  return { id: user.id, name: user.name, email: user.email, role: user.role };
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };
