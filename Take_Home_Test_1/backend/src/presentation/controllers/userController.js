const userUseCases = require('../../application/use-cases/userUseCases');
const logger = require('../../infrastructure/logging/logger');

const getUsers = async (req, res) => {
  try {
    const users = await userUseCases.getUsers();
    res.json(users);
  } catch (err) {
    logger.error(`Error fetching users: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await userUseCases.getUserById(req.user.id);
    res.json(user);
  } catch (err) {
    logger.error(`Error fetching profile: ${err.message}`);
    res.status(404).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const sanitizedData = {
      name: req.body.name?.trim(),
      role: req.body.role?.trim()
    };
    const user = await userUseCases.updateUser(req.params.id, sanitizedData);
    logger.info(`User updated: ${user.id || user._id}`);
    res.json(user);
  } catch (err) {
    logger.error(`Error updating user: ${err.message}`);
    res.status(404).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userUseCases.deleteUser(req.params.id);
    logger.info(`User deleted: ${user.id || user._id}`);
    res.json(user);
  } catch (err) {
    logger.error(`Error deleting user: ${err.message}`);
    res.status(404).json({ error: err.message });
  }
};

module.exports = { getUsers, getProfile, updateUser, deleteUser };
