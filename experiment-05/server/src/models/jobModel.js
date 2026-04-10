const pool = require('../config/db');

const jobModel = {
  /**
   * Find jobs with dynamic filters and pagination.
   * Builds WHERE clause dynamically to avoid fetching unnecessary data.
   */
  async findAll(filters = {}) {
    const {
      search,
      location,
      type,
      salary_min,
      salary_max,
      keywords,
      page = 1,
      limit = 10,
    } = filters;

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    // Full-text search on title
    if (search) {
      conditions.push(`title ILIKE $${paramIndex}`);
      params.push(`%${search}%`);
      paramIndex++;
    }

    // Location filter
    if (location) {
      conditions.push(`location ILIKE $${paramIndex}`);
      params.push(`%${location}%`);
      paramIndex++;
    }

    // Type filter
    if (type) {
      conditions.push(`type = $${paramIndex}`);
      params.push(type);
      paramIndex++;
    }

    // Salary range
    if (salary_min) {
      conditions.push(`salary_max >= $${paramIndex}`);
      params.push(parseInt(salary_min, 10));
      paramIndex++;
    }

    if (salary_max) {
      conditions.push(`salary_min <= $${paramIndex}`);
      params.push(parseInt(salary_max, 10));
      paramIndex++;
    }

    // Keywords filter (PostgreSQL array overlap)
    if (keywords) {
      const keywordArr = keywords.split(',').map((k) => k.trim().toLowerCase());
      conditions.push(`keywords && $${paramIndex}`);
      params.push(keywordArr);
      paramIndex++;
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total matching rows
    const countQuery = `SELECT COUNT(*) FROM jobs ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count, 10);

    // Fetch paginated results
    const offset = (page - 1) * limit;
    const dataQuery = `
      SELECT j.*, u.name as creator_name
      FROM jobs j
      LEFT JOIN users u ON j.created_by = u.id
      ${whereClause}
      ORDER BY j.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    params.push(limit, offset);

    const dataResult = await pool.query(dataQuery, params);

    return {
      data: dataResult.rows,
      pagination: {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async findById(id) {
    const result = await pool.query(
      `SELECT j.*, u.name as creator_name
       FROM jobs j
       LEFT JOIN users u ON j.created_by = u.id
       WHERE j.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  },

  async create(jobData) {
    const {
      title,
      company,
      location,
      type,
      description,
      salary_min,
      salary_max,
      keywords,
      created_by,
    } = jobData;

    const result = await pool.query(
      `INSERT INTO jobs (title, company, location, type, description, salary_min, salary_max, keywords, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [title, company, location, type, description, salary_min || null, salary_max || null, keywords || [], created_by]
    );
    return result.rows[0];
  },

  async update(id, jobData) {
    const {
      title,
      company,
      location,
      type,
      description,
      salary_min,
      salary_max,
      keywords,
    } = jobData;

    const result = await pool.query(
      `UPDATE jobs
       SET title = COALESCE($1, title),
           company = COALESCE($2, company),
           location = COALESCE($3, location),
           type = COALESCE($4, type),
           description = COALESCE($5, description),
           salary_min = COALESCE($6, salary_min),
           salary_max = COALESCE($7, salary_max),
           keywords = COALESCE($8, keywords)
       WHERE id = $9
       RETURNING *`,
      [title, company, location, type, description, salary_min, salary_max, keywords, id]
    );
    return result.rows[0] || null;
  },

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM jobs WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rows[0] || null;
  },
};

module.exports = jobModel;
