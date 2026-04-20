const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../../infrastructure/repositories/MockRepositories');
const User = require('../../domain/entities/User');

const register = async (name, email, password, role) => {
  if (users.find(u => u.email === email)) throw new Error('User already exists');
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User(Date.now().toString(), name, email, hashedPassword, role);
  users.push(newUser);
  return newUser;
};

const login = async (email, password) => {
  const user = users.find(u => u.email === email);
  if (!user) throw new Error('Invalid credentials');
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');
  
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
};

module.exports = { register, login };
