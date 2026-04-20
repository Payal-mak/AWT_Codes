const UserRepository = require('../../../infrastructure/repositories/UserRepository');
const logger = require('../../../infrastructure/logger/winston');

class DeleteUser {
  static async execute(id) {
    try {
      const deletedUser = await UserRepository.delete(id);
      if (!deletedUser) {
        throw new Error('User not found');
      }

      logger.info(`User UseCase [DeleteUser]: Deleted user ID ${id}`);
      
      const { password, ...userWithoutPassword } = deletedUser;
      return userWithoutPassword;
    } catch (error) {
      logger.error(`User Error [DeleteUser] on ID ${id}: ${error.message}`);
      throw error;
    }
  }
}

module.exports = DeleteUser;
