const authUseCases = require('../../application/use-cases/authUseCases');
const logger = require('../../infrastructure/logging/logger');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await authUseCases.register(name, email, password, role);
    logger.info(`User registered: ${user.email}`);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    logger.error(`Registration error: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authUseCases.login(email, password);
    logger.info(`User logged in: ${email}`);
    res.json(result);
  } catch (err) {
    logger.error(`Login error: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

module.exports = { register, login };
