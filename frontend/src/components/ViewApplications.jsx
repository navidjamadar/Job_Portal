import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api';
const BACKEND_BASE = 'http://localhost:5000';

function ViewApplications() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchApplications() {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('jwt');
        const res = await fetch(`${API_BASE}/application/job/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch applications');
        setApplications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchApplications();
  }, [jobId]);

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div></div>;
  if (error) return <div className="alert alert-danger mt-5">{error}</div>;
  return (
    <div className="container min-vh-100 py-5">
      <h2 className="text-center mb-4 fw-bold">
        <i className="bi bi-people me-2 text-info"></i>Applications for Job
      </h2>
      {applications.length === 0 ? (
        <div className="alert alert-info text-center">No applications found for this job.</div>
      ) : (
        <div className="row g-4">
          {applications.map(app => (
            <div key={app._id} className="col-12 col-md-6 col-lg-4">
              <div className="card shadow-sm border-0 rounded-4 p-3 h-100">
                <div className="mb-2"><strong>Candidate:</strong> {app.candidateId?.name} ({app.candidateId?.email})</div>
                <div className="mb-2"><strong>Resume:</strong> <a href={BACKEND_BASE + app.resumeLink} target="_blank" rel="noopener noreferrer">View Resume</a></div>
                <div className="mb-2"><strong>Cover Letter:</strong><br />{app.coverLetter || <span className="text-muted">(none)</span>}</div>
                <div className="text-muted" style={{ fontSize: '0.95em' }}>Applied: {new Date(app.appliedDate).toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewApplications; 