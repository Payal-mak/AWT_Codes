const jobModel = require('../models/jobModel');
const AppError = require('../utils/AppError');

const jobService = {
  async getJobs(filters) {
    // Clamp limit to prevent abuse
    const limit = Math.min(Math.max(parseInt(filters.limit, 10) || 10, 1), 50);
    const page = Math.max(parseInt(filters.page, 10) || 1, 1);

    return jobModel.findAll({ ...filters, page, limit });
  },

  async getJobById(id) {
    const job = await jobModel.findById(id);
    if (!job) {
      throw new AppError('Job not found', 404);
    }
    return job;
  },

  async createJob(jobData, userId) {
    return jobModel.create({ ...jobData, created_by: userId });
  },

  async updateJob(id, jobData) {
    const job = await jobModel.update(id, jobData);
    if (!job) {
      throw new AppError('Job not found', 404);
    }
    return job;
  },

  async deleteJob(id) {
    const job = await jobModel.delete(id);
    if (!job) {
      throw new AppError('Job not found', 404);
    }
    return job;
  },
};

module.exports = jobService;
