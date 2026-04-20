const UserRepository = require('../../../infrastructure/repositories/UserRepository');
const logger = require('../../../infrastructure/logger/winston');

class ReadUser {
  static async execute(id) {
    try {
      if (id) {
        const user = await UserRepository.findById(id);
        if (!user) {
          throw new Error('User not found');
        }
        
        const { password, ...userWithoutPassword } = user;
        logger.info(`User UseCase [ReadUser]: Read user ID ${id}`);
        return userWithoutPassword;
      }
      
      const users = await UserRepository.findAll();
      logger.info(`User UseCase [ReadUser]: Retrieved all users`);
      return users.map(({ password, ...u }) => u);
    } catch (error) {
      logger.error(`User Error [ReadUser]: ${error.message}`);
      throw error;
    }
  }
}

module.exports = ReadUser;
