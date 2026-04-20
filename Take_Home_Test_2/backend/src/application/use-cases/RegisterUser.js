const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('crypto'); // Built-in crypto module for uuid
const User = require('../../domain/entities/User');
const UserRepository = require('../../infrastructure/repositories/UserRepository');
const logger = require('../../infrastructure/logger/winston');
const crypto = require('crypto');

class RegisterUser {
  static async execute({ name, email, password, role }) {
    try {
      // Check if user already exists
      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create new user entity
      // Node v14.17.0+ supports crypto.randomUUID(), fallback if needed
      const id = crypto.randomUUID ? crypto.randomUUID() : 'id_' + Date.now();
      
      const user = new User({
        id,
        name,
        email,
        password: hashedPassword,
        role: role || 'student', // Assign default role or specific role
      });

      // Save user
      const savedUser = await UserRepository.save(user);
      
      logger.info(`Auth Event: User registered. Email: ${email}, Role: ${savedUser.role}`);
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = savedUser;
      return userWithoutPassword;
    } catch (error) {
      logger.error(`Auth Error [RegisterUser]: ${error.message}`);
      throw error;
    }
  }
}

module.exports = RegisterUser;
