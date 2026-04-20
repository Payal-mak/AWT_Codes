const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { users } = require('../../infrastructure/repositories');

const register = async (name, email, password, role) => {
  const existingUser = await users.findByEmail(email);
  if (existingUser) throw new Error('User already exists');
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await users.create({ name, email, password: hashedPassword, role });
  return user;
};

const login = async (email, password) => {
  const user = await users.findByEmail(email, true); // true to include password
  if (!user) throw new Error('Invalid credentials');
  
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error('Invalid credentials');
  
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
  return { user: { id: user._id, name: user.name, email: user.email, role: user.role }, token };
};

module.exports = { register, login };