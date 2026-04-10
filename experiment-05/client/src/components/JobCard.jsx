import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
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

  const typeColors = {
    'full-time': 'type-fulltime',
    'part-time': 'type-parttime',
    'contract': 'type-contract',
    'internship': 'type-internship',
    'remote': 'type-remote',
  };

  return (
    <Link to={`/jobs/${job.id}`} className="job-card">
      <div className="job-card-header">
        <h3 className="job-card-title">{job.title}</h3>
        <span className={`badge ${typeColors[job.type] || ''}`}>
          {job.type}
        </span>
      </div>

      <p className="job-card-company">{job.company}</p>

      <div className="job-card-meta">
        {job.location && (
          <span className="meta-item">
            <span className="meta-icon">📍</span>
            {job.location}
          </span>
        )}
        {formatSalary(job.salary_min, job.salary_max) && (
          <span className="meta-item">
            <span className="meta-icon">💰</span>
            {formatSalary(job.salary_min, job.salary_max)}
          </span>
        )}
      </div>

      {job.keywords && job.keywords.length > 0 && (
        <div className="job-card-keywords">
          {job.keywords.slice(0, 4).map((kw) => (
            <span key={kw} className="keyword-tag">{kw}</span>
          ))}
          {job.keywords.length > 4 && (
            <span className="keyword-tag keyword-more">+{job.keywords.length - 4}</span>
          )}
        </div>
      )}

      <div className="job-card-footer">
        <span className="job-card-date">
          {new Date(job.created_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>
    </Link>
  );
}
