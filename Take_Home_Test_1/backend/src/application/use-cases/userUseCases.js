const { users } = require('../../infrastructure/repositories');

const getUsers = async () => {
  const allUsers = await users.findAll();
  return allUsers.map(u => ({ id: u._id || u.id, name: u.name, email: u.email, role: u.role }));
};

const getUserById = async (id) => {
  const user = await users.findById(id);
  if (!user) throw new Error('User not found');
  return { id: user._id || user.id, name: user.name, email: user.email, role: user.role };
};

const updateUser = async (id, data) => {
  const user = await users.findById(id);
  if (!user) throw new Error('User not found');
  
  const updateData = {};
  if (data.name) updateData.name = data.name;
  if (data.role) updateData.role = data.role;
  
  const updatedUser = await users.update(id, updateData);
  return { id: updatedUser._id || updatedUser.id, name: updatedUser.name, email: updatedUser.email, role: updatedUser.role };
};

const deleteUser = async (id) => {
  const deleted = await users.delete(id);
  if (!deleted) throw new Error('User not found');
  return { id: deleted._id || deleted.id, name: deleted.name, email: deleted.email, role: deleted.role };
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };
