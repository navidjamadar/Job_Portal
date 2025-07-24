import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api';

function AddJobForm({ initialValues, onSubmit, isEdit = false }) {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialValues || { title: '', description: '', companyName: '', location: '', salaryMin: '', salaryMax: '', type: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showToast, setShowToast] = useState(false);
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowToast(false);
    try {
      if (onSubmit) {
        await onSubmit(form, { setError, setSuccess, setShowToast, navigate, setForm });
      } else {
        const token = localStorage.getItem('jwt');
        const res = await fetch(`${API_BASE}/job`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            title: form.title,
            description: form.description,
            companyName: form.companyName,
            location: form.location,
            salaryRange: { min: Number(form.salaryMin), max: Number(form.salaryMax) },
            type: form.type
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Job creation failed');
        setSuccess('Job added!');
        setForm({ title: '', description: '', companyName: '', location: '', salaryMin: '', salaryMax: '', type: '' });
        setShowToast(true);
        setTimeout(() => navigate('/'), 1000);
      }
    } catch (err) {
      setError(err.message);
      setShowToast(true);
    }
  };
  if (localStorage.getItem('role') !== 'admin') {
    return <div className="container-fluid mt-5"><div className="alert alert-danger">Admin access required.</div></div>;
  }
  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="col-12 col-md-10 col-lg-8">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-5">
            <h2 className="card-title text-center mb-4 fw-bold">
              <i className={`bi ${isEdit ? 'bi-pencil-square text-warning' : 'bi-plus-circle-fill text-success'} me-2`}></i>
              {isEdit ? 'Edit Job' : 'Add Job (Admin Only)'}
            </h2>
            <form onSubmit={handleSubmit} autoComplete="on">
              <div className="mb-4">
                <label htmlFor="jobTitle" className="form-label fw-semibold">
                  <i className="bi bi-briefcase me-2"></i>Title
                </label>
                <input className="form-control form-control-lg" name="title" id="jobTitle" placeholder="Title" value={form.title} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label htmlFor="jobDescription" className="form-label fw-semibold">
                  <i className="bi bi-card-text me-2"></i>Description
                </label>
                <textarea className="form-control form-control-lg" name="description" id="jobDescription" placeholder="Description" rows={3} value={form.description} onChange={handleChange} required style={{height: '100px'}} />
              </div>
              <div className="mb-4">
                <label htmlFor="companyName" className="form-label fw-semibold">
                  <i className="bi bi-building me-2"></i>Company Name
                </label>
                <input className="form-control form-control-lg" name="companyName" id="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label htmlFor="jobLocation" className="form-label fw-semibold">
                  <i className="bi bi-geo-alt me-2"></i>Location
                </label>
                <input className="form-control form-control-lg" name="location" id="jobLocation" placeholder="Location" value={form.location} onChange={handleChange} required />
              </div>
              <div className="row g-2 mb-4">
                <div className="col">
                  <label htmlFor="salaryMin" className="form-label fw-semibold">
                    <i className="bi bi-currency-rupee me-2"></i>Salary Min
                  </label>
                  <input className="form-control form-control-lg" name="salaryMin" id="salaryMin" type="number" placeholder="Salary Min" value={form.salaryMin} onChange={handleChange} required />
                </div>
                <div className="col">
                  <label htmlFor="salaryMax" className="form-label fw-semibold">
                    <i className="bi bi-currency-rupee me-2"></i>Salary Max
                  </label>
                  <input className="form-control form-control-lg" name="salaryMax" id="salaryMax" type="number" placeholder="Salary Max" value={form.salaryMax} onChange={handleChange} required />
                </div>
              </div>
              <div className="mb-4">
                <label htmlFor="jobType" className="form-label fw-semibold">
                  <i className="bi bi-clock me-2"></i>Type
                </label>
                <select className="form-select form-select-lg" name="type" id="jobType" value={form.type} onChange={handleChange} required>
                  <option value="">Select Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                </select>
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className={`btn btn-${isEdit ? 'warning' : 'success'} btn-lg shadow-sm`}>
                  <i className={`bi me-2 ${isEdit ? 'bi-pencil-square' : 'bi-plus-circle'}`}></i>{isEdit ? 'Update Job' : 'Add Job'}
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

export default AddJobForm; 