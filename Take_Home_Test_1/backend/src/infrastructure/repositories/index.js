const MongoBookRepository = require('./MongoBookRepository');
const MongoUserRepository = require('./MongoUserRepository');
const MongoTransactionRepository = require('./MongoTransactionRepository');

module.exports = {
  books: new MongoBookRepository(),
  users: new MongoUserRepository(),
  transactions: new MongoTransactionRepository()
};
