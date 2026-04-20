const User = require('../../domain/entities/User');

// In-memory mock database for users
const usersDb = [];

class UserRepository {
  static async findByEmail(email) {
    const user = usersDb.find(u => u.email === email);
    if (!user) return null;
    return new User(user);
  }

  static async save(user) {
    usersDb.push(user);
    return new User(user);
  }
}

module.exports = UserRepository;
