import { Link } from 'react-router-dom';

function getInitials(companyName) {
  if (!companyName) return '?';
  return companyName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function JobCard({ job, isAdmin = false, onDelete }) {
  return (
    <div className="card h-100 shadow-sm border-0 rounded-4 p-3 d-flex flex-column align-items-center" style={{ minWidth: 320, maxWidth: 400, margin: '0 auto', background: '#fff' }}>
      <div className="d-flex flex-column align-items-center w-100 mb-2">
        <div className="job-avatar mb-2 d-flex align-items-center justify-content-center bg-primary bg-opacity-10" style={{ width: 56, height: 56, borderRadius: '50%', fontSize: '1.7rem', color: '#4f46e5', fontWeight: 700, boxShadow: '0 2px 8px rgba(79,70,229,0.08)' }}>
          {getInitials(job.companyName)}
        </div>
        <h5 className="card-title mb-1 fw-bold text-center" style={{ fontSize: '1.3rem' }}>{job.title}</h5>
        <div className="text-muted text-center mb-1" style={{ fontSize: '1rem' }}>{job.companyName}</div>
        <div className="fw-semibold text-primary-emphasis text-center mb-2" style={{ fontSize: '1.05rem' }}>
          {job.location} <span className="mx-1">|</span> {job.type}
        </div>
      </div>
      <p className="card-text text-center mb-2" style={{ minHeight: 48 }}>{job.description}</p>
      <div className="mb-2 text-center"><strong>Salary:</strong> ₹{job.salaryRange?.min} - ₹{job.salaryRange?.max}</div>
      <div className="mb-2 d-flex justify-content-center flex-wrap gap-2">
        <span className="badge bg-primary px-3 py-2" style={{ fontSize: '1em' }}>{job.type}</span>
        {job.location.toLowerCase().includes('remote') && <span className="badge bg-info text-dark px-3 py-2" style={{ fontSize: '1em' }}>Remote</span>}
        {job.type === 'Internship' && <span className="badge bg-warning text-dark px-3 py-2" style={{ fontSize: '1em' }}>Urgent</span>}
      </div>
      <div className="mb-3 text-muted text-center" style={{ fontSize: '0.95em' }}>Posted: {formatDate(job.postedDate)}</div>
      <div className="mt-auto w-100">
        {isAdmin ? (
          <div className="d-flex gap-2">
            <button className="btn btn-outline-danger btn-sm w-100" title="Delete Job" onClick={() => onDelete && onDelete(job._id)}>
              <i className="bi bi-trash"></i> Delete
            </button>
          </div>
        ) : (
          <Link className="btn btn-outline-primary w-100" to={`/apply?jobId=${job._id}`}>Apply</Link>
        )}
      </div>
    </div>
  );
}

export default JobCard; 