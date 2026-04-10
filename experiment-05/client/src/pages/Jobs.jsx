import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import SearchBar from '../components/SearchBar';
import Pagination from '../components/Pagination';

const JOB_TYPES = ['full-time', 'part-time', 'contract', 'internship', 'remote'];

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 8, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [keywords, setKeywords] = useState('');

  const fetchJobs = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');

    try {
      const params = { page, limit: 8 };
      if (search) params.search = search;
      if (location) params.location = location;
      if (type) params.type = type;
      if (salaryMin) params.salary_min = salaryMin;
      if (salaryMax) params.salary_max = salaryMax;
      if (keywords) params.keywords = keywords;

      const res = await api.get('/jobs', { params });
      setJobs(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      setError('Failed to load jobs. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, location, type, salaryMin, salaryMax, keywords]);

  useEffect(() => {
    fetchJobs(1);
  }, [fetchJobs]);

  const handlePageChange = (page) => {
    fetchJobs(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSearch('');
    setLocation('');
    setType('');
    setSalaryMin('');
    setSalaryMax('');
    setKeywords('');
  };

  const hasFilters = search || location || type || salaryMin || salaryMax || keywords;

  return (
    <div className="jobs-page">
      <div className="jobs-header">
        <h1>Find Your Next Role</h1>
        <p className="jobs-count">
          {pagination.total} job{pagination.total !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Filters Section */}
      <div className="filters-section">
        <SearchBar value={search} onChange={setSearch} placeholder="Search by job title..." />

        <div className="filters-row">
          <div className="filter-group">
            <label className="filter-label">Location</label>
            <input
              type="text"
              className="filter-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Mumbai"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Job Type</label>
            <select
              className="filter-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">All Types</option>
              {JOB_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Min Salary (₹)</label>
            <input
              type="number"
              className="filter-input"
              value={salaryMin}
              onChange={(e) => setSalaryMin(e.target.value)}
              placeholder="e.g. 500000"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Max Salary (₹)</label>
            <input
              type="number"
              className="filter-input"
              value={salaryMax}
              onChange={(e) => setSalaryMax(e.target.value)}
              placeholder="e.g. 2000000"
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Keywords</label>
            <input
              type="text"
              className="filter-input"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="react,node,python"
            />
          </div>
        </div>

        {hasFilters && (
          <button className="btn btn-outline btn-sm" onClick={clearFilters}>
            Clear All Filters
          </button>
        )}
      </div>

      {/* Error */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Job Listing */}
      {loading ? (
        <div className="loading-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">📭</p>
          <h3>No jobs found</h3>
          <p>Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && jobs.length > 0 && (
        <Pagination pagination={pagination} onPageChange={handlePageChange} />
      )}
    </div>
  );
}
