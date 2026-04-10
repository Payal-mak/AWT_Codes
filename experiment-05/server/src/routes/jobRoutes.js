const express = require('express');
const Joi = require('joi');
const jobController = require('../controllers/jobController');
const authenticate = require('../middlewares/auth');
const requireRole = require('../middlewares/roleCheck');
const validate = require('../middlewares/validate');

const router = express.Router();

// Validation schemas
const createJobSchema = {
  body: Joi.object({
    title: Joi.string().min(2).max(200).required(),
    company: Joi.string().min(2).max(200).required(),
    location: Joi.string().max(200).allow('', null),
    type: Joi.string()
      .valid('full-time', 'part-time', 'contract', 'internship', 'remote')
      .required(),
    description: Joi.string().allow('', null),
    salary_min: Joi.number().integer().min(0).allow(null),
    salary_max: Joi.number().integer().min(0).allow(null),
    keywords: Joi.array().items(Joi.string()).allow(null),
  }),
};

const updateJobSchema = {
  body: Joi.object({
    title: Joi.string().min(2).max(200),
    company: Joi.string().min(2).max(200),
    location: Joi.string().max(200).allow('', null),
    type: Joi.string().valid('full-time', 'part-time', 'contract', 'internship', 'remote'),
    description: Joi.string().allow('', null),
    salary_min: Joi.number().integer().min(0).allow(null),
    salary_max: Joi.number().integer().min(0).allow(null),
    keywords: Joi.array().items(Joi.string()).allow(null),
  }),
};

const listJobsSchema = {
  query: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(50).default(10),
    search: Joi.string().max(200).allow('', null),
    location: Joi.string().max(200).allow('', null),
    type: Joi.string().valid('full-time', 'part-time', 'contract', 'internship', 'remote').allow('', null),
    salary_min: Joi.number().integer().min(0).allow(null),
    salary_max: Joi.number().integer().min(0).allow(null),
    keywords: Joi.string().max(500).allow('', null),
  }),
};

// Public routes
router.get('/', validate(listJobsSchema), jobController.getJobs);
router.get('/:id', jobController.getJob);

// Admin-only routes
router.post('/', authenticate, requireRole('admin'), validate(createJobSchema), jobController.createJob);
router.put('/:id', authenticate, requireRole('admin'), validate(updateJobSchema), jobController.updateJob);
router.delete('/:id', authenticate, requireRole('admin'), jobController.deleteJob);

module.exports = router;
