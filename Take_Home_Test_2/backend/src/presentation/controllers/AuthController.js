const RegisterUser = require('../../application/use-cases/RegisterUser');
const LoginUser = require('../../application/use-cases/LoginUser');
const { validationResult } = require('express-validator');

class AuthController {
  static async register(req, res, next) {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { name, email, password, role } = req.body;
      const user = await RegisterUser.execute({ name, email, password, role });
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
      });
    } catch (error) {
      if (error.message === 'User already exists with this email') {
        return res.status(409).json({ success: false, message: error.message });
      }
      next(error);
    }
  }

  static async login(req, res, next) {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const { email, password } = req.body;
      const result = await LoginUser.execute({ email, password });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      if (error.message === 'Invalid credentials') {
        return res.status(401).json({ success: false, message: error.message });
      }
      next(error);
    }
  }
}

module.exports = AuthController;
