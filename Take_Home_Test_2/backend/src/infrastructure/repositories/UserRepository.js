const User = require('../../domain/entities/User');

// In-memory mock database for users
const usersDb = [];

class UserRepository {
  static async findAll() {
    return usersDb.map(u => new User(u));
  }

  static async findById(id) {
    const user = usersDb.find(u => u.id === id);
    if (!user) return null;
    return new User(user);
  }

  static async findByEmail(email) {
    const user = usersDb.find(u => u.email === email);
    if (!user) return null;
    return new User(user);
  }

  static async save(user) {
    const index = usersDb.findIndex(u => u.id === user.id);
    if (index !== -1) {
      usersDb[index] = user;
    } else {
      usersDb.push(user);
    }
    return new User(user);
  }

  static async delete(id) {
    const index = usersDb.findIndex(u => u.id === id);
    if (index !== -1) {
      const deletedUser = usersDb.splice(index, 1)[0];
      return new User(deletedUser);
    }
    return null;
  }
}

module.exports = UserRepository;
