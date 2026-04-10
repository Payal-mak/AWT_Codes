const authService = require('../services/authService');
const userModel = require('../models/userModel');

const authController = {
  async signup(req, res, next) {
    try {
      const { name, email, password } = req.body;
      const result = await authService.signup(name, email, password);
      res.status(201).json({
        status: 'success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (err) {
      next(err);
    }
  },

  async getMe(req, res, next) {
    try {
      const user = await userModel.findById(req.user.id);
      res.status(200).json({
        status: 'success',
        data: { user },
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = authController;
