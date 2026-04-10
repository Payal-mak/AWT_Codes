-- Job Portal Database Schema

CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  role        VARCHAR(10) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS jobs (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(200) NOT NULL,
  company      VARCHAR(200) NOT NULL,
  location     VARCHAR(200),
  type         VARCHAR(50) CHECK (type IN ('full-time', 'part-time', 'contract', 'internship', 'remote')),
  description  TEXT,
  salary_min   INTEGER,
  salary_max   INTEGER,
  keywords     TEXT[],
  created_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
  created_at   TIMESTAMP DEFAULT NOW()
);

-- Indexes for fast filtering
CREATE INDEX IF NOT EXISTS idx_jobs_location ON jobs (location);
CREATE INDEX IF NOT EXISTS idx_jobs_type     ON jobs (type);
CREATE INDEX IF NOT EXISTS idx_jobs_salary   ON jobs (salary_min, salary_max);
CREATE INDEX IF NOT EXISTS idx_jobs_created  ON jobs (created_at DESC);
