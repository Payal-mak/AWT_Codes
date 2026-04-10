import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Job not found');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await api.delete(`/jobs/${id}`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete job');
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return null;
    const fmt = (n) => {
      if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
      if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
      return `₹${n}`;
    };
    if (min && max) return `${fmt(min)} - ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    return `Up to ${fmt(max)}`;
  };

  if (loading) {
    return (
      <div className="job-details-page">
        <div className="skeleton-detail" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="job-details-page">
        <div className="error-state">
          <h2>Error</h2>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary">Back to Jobs</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="job-details-page">
      <Link to="/" className="back-link">← Back to Jobs</Link>

      <div className="job-details-card">
        <div className="job-details-header">
          <div>
            <h1 className="job-details-title">{job.title}</h1>
            <p className="job-details-company">{job.company}</p>
          </div>

          {user?.role === 'admin' && (
            <div className="job-details-actions">
              <button onClick={handleDelete} className="btn btn-danger btn-sm">
                Delete Job
              </button>
            </div>
          )}
        </div>

        <div className="job-details-meta">
          {job.location && (
            <div className="detail-chip">
              <span>📍</span> {job.location}
            </div>
          )}
          {job.type && (
            <div className="detail-chip">
              <span>💼</span> {job.type}
            </div>
          )}
          {formatSalary(job.salary_min, job.salary_max) && (
            <div className="detail-chip">
              <span>💰</span> {formatSalary(job.salary_min, job.salary_max)}
            </div>
          )}
          <div className="detail-chip">
            <span>📅</span>{' '}
            {new Date(job.created_at).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </div>
        </div>

        {job.keywords && job.keywords.length > 0 && (
          <div className="job-details-keywords">
            <h3>Skills & Keywords</h3>
            <div className="keywords-list">
              {job.keywords.map((kw) => (
                <span key={kw} className="keyword-tag">{kw}</span>
              ))}
            </div>
          </div>
        )}

        <div className="job-details-description">
          <h3>Job Description</h3>
          <p>{job.description}</p>
        </div>

        {job.creator_name && (
          <div className="job-details-posted">
            Posted by <strong>{job.creator_name}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
