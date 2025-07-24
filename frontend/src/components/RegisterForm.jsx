import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api';

function RegisterForm() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'candidate' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setShowToast(false);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      setSuccess('Registration successful! Redirecting to login...');
      setShowToast(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message);
      setShowToast(true);
    }
  };
  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="col-12 col-md-8 col-lg-5">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-5">
            <h2 className="card-title text-center mb-4 fw-bold">
              <i className="bi bi-person-plus-fill me-2 text-primary"></i>
              Register
            </h2>
            <form onSubmit={handleSubmit} autoComplete="on">
              <div className="mb-4">
                <label htmlFor="registerName" className="form-label fw-semibold">
                  <i className="bi bi-person me-2"></i>Name
                </label>
                <input className="form-control form-control-lg" name="name" id="registerName" placeholder="Name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label htmlFor="registerEmail" className="form-label fw-semibold">
                  <i className="bi bi-envelope me-2"></i>Email
                </label>
                <input type="email" className="form-control form-control-lg" name="email" id="registerEmail" placeholder="Email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label htmlFor="registerPassword" className="form-label fw-semibold">
                  <i className="bi bi-lock me-2"></i>Password
                </label>
                <input type="password" className="form-control form-control-lg" name="password" id="registerPassword" placeholder="Password" value={form.password} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label htmlFor="registerRole" className="form-label fw-semibold">
                  <i className="bi bi-person-badge me-2"></i>Role
                </label>
                <select className="form-select form-select-lg" name="role" id="registerRole" value={form.role} onChange={handleChange} required>
                  <option value="candidate">Candidate</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="d-grid gap-2">
                <button type="submit" className="btn btn-primary btn-lg shadow-sm">
                  <i className="bi bi-person-plus me-2"></i>Register
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

export default RegisterForm; 