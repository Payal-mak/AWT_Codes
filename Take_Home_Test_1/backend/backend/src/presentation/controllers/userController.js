const userUseCases = require('../../application/use-cases/userUseCases');
const logger = require('../../infrastructure/logging/logger');

const getUsers = (req, res) => {
  res.json(userUseCases.getUsers());
};

const getProfile = (req, res) => {
  try {
    const user = userUseCases.getUserById(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const updateUser = (req, res) => {
  try {
    // Basic sanitization
    const sanitizedData = {
      name: req.body.name?.trim(),
      role: req.body.role?.trim()
    };
    const user = userUseCases.updateUser(req.params.id, sanitizedData);
    logger.info(`User updated: ${user.id}`);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

const deleteUser = (req, res) => {
  try {
    const user = userUseCases.deleteUser(req.params.id);
    logger.info(`User deleted: ${user.id}`);
    res.json(user);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

module.exports = { getUsers, getProfile, updateUser, deleteUser };
