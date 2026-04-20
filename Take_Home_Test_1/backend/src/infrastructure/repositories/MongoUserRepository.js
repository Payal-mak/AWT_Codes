const User = require('../database/schemas/UserSchema');
const logger = require('../logging/logger');

class MongoUserRepository {
  async findAll() {
    try {
      return await User.find({}).select('-password');
    } catch (error) {
      logger.error(`Error finding all users: ${error.message}`);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await User.findById(id).select('-password');
    } catch (error) {
      logger.error(`Error finding user by id: ${error.message}`);
      throw error;
    }
  }

  async findByEmail(email, includePassword = false) {
    try {
      let query = User.findOne({ email });
      if (!includePassword) {
        query = query.select('-password');
      }
      return await query.exec();
    } catch (error) {
      logger.error(`Error finding user by email: ${error.message}`);
      throw error;
    }
  }

  async create(userData) {
    try {
      const user = new User(userData);
      return await user.save();
    } catch (error) {
      logger.error(`Error creating user: ${error.message}`);
      throw error;
    }
  }

  async update(id, userData) {
    try {
      return await User.findByIdAndUpdate(id, userData, { new: true, runValidators: true }).select('-password');
    } catch (error) {
      logger.error(`Error updating user: ${error.message}`);
      throw error;
    }
  }

  async delete(id) {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      logger.error(`Error deleting user: ${error.message}`);
      throw error;
    }
  }
}

module.exports = MongoUserRepository;
