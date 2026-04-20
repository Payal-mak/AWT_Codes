const bcrypt = require('bcryptjs');
const User = require('../../../domain/entities/User');
const UserRepository = require('../../../infrastructure/repositories/UserRepository');
const logger = require('../../../infrastructure/logger/winston');

class UpdateUser {
  static async execute(id, updateData) {
    try {
      const existingUser = await UserRepository.findById(id);
      if (!existingUser) {
        throw new Error('User not found');
      }

      // Merge data
      const mergedData = { ...existingUser, ...updateData };

      // Re-hash password if it's being updated
      if (updateData.password && updateData.password !== existingUser.password) {
        const salt = await bcrypt.genSalt(10);
        mergedData.password = await bcrypt.hash(updateData.password, salt);
      }

      const updatedUser = new User(mergedData);
      const savedUser = await UserRepository.save(updatedUser);
      
      logger.info(`User UseCase [UpdateUser]: Updated user ID ${id}`);
      
      const { password, ...userWithoutPassword } = savedUser;
      return userWithoutPassword;
    } catch (error) {
      logger.error(`User Error [UpdateUser] on ID ${id}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = UpdateUser;
