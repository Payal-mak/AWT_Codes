const ReadUser = require('../../application/use-cases/user/ReadUser');
const UpdateUser = require('../../application/use-cases/user/UpdateUser');
const DeleteUser = require('../../application/use-cases/user/DeleteUser');
const RegisterUser = require('../../application/use-cases/RegisterUser');
const { validationResult } = require('express-validator');

class UserController {
  static async create(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, email, password, role } = req.body;
      const newUser = await RegisterUser.execute({ name, email, password, role });
      res.status(201).json({ success: true, message: 'User created', data: newUser });
    } catch (error) {
      if (error.message === 'User already exists with this email') {
        return res.status(409).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  static async getAll(req, res, next) {
    try {
      const users = await ReadUser.execute();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      next(error);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await ReadUser.execute(id);
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  static async update(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { id } = req.params;
      const updateData = req.body;
      const updatedUser = await UpdateUser.execute(id, updateData);
      res.status(200).json({ success: true, message: 'User updated', data: updatedUser });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params;
      const deletedUser = await DeleteUser.execute(id);
      res.status(200).json({ success: true, message: 'User deleted', data: deletedUser });
    } catch (error) {
      if (error.message === 'User not found') {
        return res.status(404).json({ success: false, message: error.message });
      }
      next(error);
    }
  }
}

module.exports = UserController;
