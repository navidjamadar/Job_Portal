import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import JobCard from './JobCard';

const API_BASE = 'http://localhost:5000/api';

function JobList({ isAdmin = false }) {
  const [jobs, setJobs] = useState([]);
  const [filter, setFilter] = useState({ title: '', location: '', type: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      setError('');
      try {
        const params = [];
        if (filter.location) params.push(`location=${encodeURIComponent(filter.location)}`);
        if (filter.type) params.push(`type=${encodeURIComponent(filter.type)}`);
        if (filter.title) params.push(`keyword=${encodeURIComponent(filter.title)}`);
        const url = `${API_BASE}/job${params.length ? '?' + params.join('&') : ''}`;
        const res = await fetch(url);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch jobs');
        setJobs(data.jobs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [filter]);
  const handleChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };
  const locations = [...new Set(jobs.map(j => j.location))];
  const types = [...new Set(jobs.map(j => j.type))];
  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${API_BASE}/job/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Failed to delete job');
      setJobs(jobs.filter(j => j._id !== jobId));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    } catch (err) {
      alert(err.message);
    }
  };
  return (
    <div className="container min-vh-100 py-5">
      <h2 className="text-center mb-4 fw-bold">
        <i className="bi bi-list-ul me-2 text-primary"></i>Job Listings
      </h2>
      <div className="row justify-content-center mb-4">
        <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-sm border-0 rounded-4 mb-3">
            <div className="card-body p-4">
              <form className="row g-3 align-items-end">
                <div className="col-12 col-md-4">
                  <label htmlFor="filterTitle" className="form-label fw-semibold">
                    <i className="bi bi-search me-2"></i>Title
                  </label>
                  <input className="form-control form-control-lg" id="filterTitle" placeholder="Title" name="title" value={filter.title} onChange={handleChange} />
                </div>
                <div className="col-12 col-md-4">
                  <label htmlFor="filterLocation" className="form-label fw-semibold">
                    <i className="bi bi-geo-alt me-2"></i>Location
                  </label>
                  <select className="form-select form-select-lg" id="filterLocation" name="location" value={filter.location} onChange={handleChange}>
                    <option value="">All Locations</option>
                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>
                <div className="col-12 col-md-4">
                  <label htmlFor="filterType" className="form-label fw-semibold">
                    <i className="bi bi-briefcase me-2"></i>Type
                  </label>
                  <select className="form-select form-select-lg" id="filterType" name="type" value={filter.type} onChange={handleChange}>
                    <option value="">All Types</option>
                    {types.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {loading ? <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div> : error ? <div className="alert alert-danger text-center">{error}</div> : (
        <div className="row g-4">
          {jobs.map(job => (
            <div key={job._id} className="col-12 col-md-6 col-lg-4 d-flex">
              <JobCard job={job} isAdmin={isAdmin} onDelete={handleDelete} />
            </div>
          ))}
          {jobs.length === 0 && <div className="text-center text-muted py-5">No jobs found.</div>}
        </div>
      )}
      <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 11 }}>
        <div className={`toast align-items-center text-bg-success border-0 show ${showToast ? '' : 'd-none'}`} role="alert" aria-live="assertive" aria-atomic="true">
          <div className="d-flex">
            <div className="toast-body">
              Job deleted successfully!
            </div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" aria-label="Close" onClick={() => setShowToast(false)}></button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobList; 