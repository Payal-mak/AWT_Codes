const jobService = require('../services/jobService');

const jobController = {
  async getJobs(req, res, next) {
    try {
      const result = await jobService.getJobs(req.query);
      res.status(200).json({
        status: 'success',
        ...result,
      });
    } catch (err) {
      next(err);
    }
  },

  async getJob(req, res, next) {
    try {
      const job = await jobService.getJobById(req.params.id);
      res.status(200).json({
        status: 'success',
        data: job,
      });
    } catch (err) {
      next(err);
    }
  },

  async createJob(req, res, next) {
    try {
      const job = await jobService.createJob(req.body, req.user.id);
      res.status(201).json({
        status: 'success',
        data: job,
      });
    } catch (err) {
      next(err);
    }
  },

  async updateJob(req, res, next) {
    try {
      const job = await jobService.updateJob(req.params.id, req.body);
      res.status(200).json({
        status: 'success',
        data: job,
      });
    } catch (err) {
      next(err);
    }
  },

  async deleteJob(req, res, next) {
    try {
      await jobService.deleteJob(req.params.id);
      res.status(200).json({
        status: 'success',
        message: 'Job deleted successfully',
      });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = jobController;
