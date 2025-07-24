import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

function ApplyForm() {
  const params = new URLSearchParams(window.location.search);
  const jobId = params.get('jobId');
  const [form, setForm] = useState({ coverLetter: '' });
  const [job, setJob] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [uploadedFilePath, setUploadedFilePath] = useState('');

  useEffect(() => {
    if (jobId) {
      fetch(`${API_BASE}/job/${jobId}`)
        .then(res => res.json())
        .then(data => setJob(data))
        .catch(() => setJob(null));
    }
  }, [jobId]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    setUploadedFileName('');
    try {
      const token = localStorage.getItem('jwt');
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'File upload failed');
      setUploadedFilePath(data.path);
      setUploadedFileName(file.name);
    } catch (err) {
      setUploadError(err.message);
      setUploadedFilePath('');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowToast(false);
    if (!uploadedFilePath) {
      setError('Please upload your resume.');
      setShowToast(true);
      return;
    }
    try {
      const token = localStorage.getItem('jwt');
      const res = await fetch(`${API_BASE}/application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ jobId, resumeLink: uploadedFilePath, coverLetter: form.coverLetter })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Application failed');
      setSuccess('Application submitted!');
      setForm({ coverLetter: '' });
      setUploadedFileName('');
      setUploadedFilePath('');
      setShowToast(true);
    } catch (err) {
      setError(err.message);
      setShowToast(true);
    }
  };

  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-5">
            <h2 className="card-title text-center mb-4 fw-bold">
              <i className="bi bi-briefcase-fill me-2 text-primary"></i>
              Apply for {job ? job.title : 'Job'}
            </h2>
            <form onSubmit={handleSubmit} autoComplete="on">
              <div className="mb-4">
                <label htmlFor="resumeFile" className="form-label fw-semibold">
                  <i className="bi bi-upload me-2"></i>Resume <span className="text-muted">(PDF/DOC)</span>
                </label>
                <input
                  type="file"
                  className="form-control form-control-lg"
                  id="resumeFile"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  disabled={uploading}
                />
                {uploading && <div className="form-text text-info mt-1"><i className="bi bi-arrow-repeat me-1"></i>Uploading...</div>}
                {uploadError && <div className="alert alert-danger mt-2 py-2 px-3"><i className="bi bi-exclamation-triangle me-2"></i>{uploadError}</div>}
                {uploadedFileName && <div className="alert alert-success mt-2 py-2 px-3"><i className="bi bi-check-circle me-2"></i>Uploaded: {uploadedFileName}</div>}
              </div>
              <div className="mb-4">
                <label htmlFor="coverLetter" className="form-label fw-semibold">
                  <i className="bi bi-card-text me-2"></i>Cover Letter
                </label>
                <textarea
                  className="form-control form-control-lg"
                  name="coverLetter"
                  id="coverLetter"
                  placeholder="Write your cover letter here..."
                  rows={5}
                  value={form.coverLetter}
                  onChange={handleChange}
                  style={{ resize: 'vertical', minHeight: '120px' }}
                />
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary btn-lg shadow-sm" disabled={uploading}>
                  <i className="bi bi-send me-2"></i>Submit Application
                </button>
              </div>
            </form>
            {(error || success) && (
              <div className={`alert mt-4 ${error ? 'alert-danger' : 'alert-success'} d-flex align-items-center`} role="alert">
                <i className={`bi me-2 ${error ? 'bi-x-circle' : 'bi-check-circle'}`}></i>
                <div>{error ? error : success}</div>
                <button type="button" className="btn-close ms-auto" aria-label="Close" onClick={() => { setError(''); setSuccess(''); }}></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ApplyForm; 