require('dotenv').config();

const app = require('./app');
const pool = require('./config/db');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const PORT = process.env.PORT || 5000;

/**
 * Initialize database tables and seed data.
 */
async function initDB() {
  try {
    // Run migrations
    const initSQL = fs.readFileSync(
      path.join(__dirname, '..', 'migrations', 'init.sql'),
      'utf-8'
    );
    await pool.query(initSQL);
    console.log('✅ Database tables created');

    // Check if admin exists
    const adminCheck = await pool.query(
      "SELECT id FROM users WHERE email = 'admin@jobportal.com'"
    );

    if (adminCheck.rows.length === 0) {
      // Seed admin user with properly hashed password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      await pool.query(
        `INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)`,
        ['Admin', 'admin@jobportal.com', hashedPassword, 'admin']
      );
      console.log('✅ Admin user seeded (admin@jobportal.com / admin123)');

      // Seed jobs
      const seedSQL = fs.readFileSync(
        path.join(__dirname, '..', 'migrations', 'seed.sql'),
        'utf-8'
      );
      await pool.query(seedSQL);
      console.log('✅ Sample jobs seeded (20 jobs)');
    } else {
      console.log('ℹ️  Admin user already exists, skipping seed');
    }
  } catch (err) {
    console.error('❌ Database initialization failed:', err.message);
    process.exit(1);
  }
}

async function start() {
  await initDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📋 API Health: http://localhost:${PORT}/api/health`);
  });
}

start();
