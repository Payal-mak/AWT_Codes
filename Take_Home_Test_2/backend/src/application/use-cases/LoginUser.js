const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../../infrastructure/repositories/UserRepository');
const logger = require('../../infrastructure/logger/winston');

class LoginUser {
  static async execute({ email, password }) {
    try {
      // Find user
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        throw new Error('Invalid credentials');
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new Error('Invalid credentials');
      }

      // Generate JWT
      const payload = {
        id: user.id,
        role: user.role,
        email: user.email
      };

      const secret = process.env.JWT_SECRET || 'fallback_secret_key';
      const token = jwt.sign(payload, secret, { expiresIn: '1h' });

      logger.info(`Auth Event: User logged in. Email: ${email}, Role: ${user.role}`);

      // Return user context and token
      const { password: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token };
    } catch (error) {
      logger.error(`Auth Error [LoginUser]: ${error.message}`);
      throw error;
    }
  }
}

module.exports = LoginUser;
