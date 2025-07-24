import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:5000/api';

function LoginForm({ setIsLoggedIn, setIsAdmin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setShowToast(false);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      localStorage.setItem('jwt', data.token);
      localStorage.setItem('role', data.user.role);
      localStorage.setItem('userId', data.user.id);
      setShowToast(true);
      if (setIsLoggedIn) setIsLoggedIn(true);
      if (setIsAdmin) setIsAdmin(data.user.role === 'admin');
      setTimeout(() => navigate('/'), 1000);
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
              <i className="bi bi-box-arrow-in-right me-2 text-primary"></i>
              Login
            </h2>
            <form onSubmit={handleLogin} autoComplete="on">
              <div className="mb-4">
                <label htmlFor="loginEmail" className="form-label fw-semibold">
                  <i className="bi bi-envelope me-2"></i>Email
                </label>
                <input type="email" className="form-control form-control-lg" id="loginEmail" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="mb-4">
                <label htmlFor="loginPassword" className="form-label fw-semibold">
                  <i className="bi bi-lock me-2"></i>Password
                </label>
                <input type="password" className="form-control form-control-lg" id="loginPassword" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              <div className="d-grid gap-2 mb-3">
                <button type="submit" className="btn btn-primary btn-lg shadow-sm">
                  <i className="bi bi-box-arrow-in-right me-2"></i>Login
                </button>
              </div>
            </form>
            <div className="form-text mt-2 text-center">Use your registered email and password</div>
            <div className="mt-2 text-end">
              <a href="/forgot-password" className="link-primary" style={{ cursor: 'pointer' }}>Forgot Password?</a>
            </div>
            {(error || showToast) && (
              <div className={`alert mt-4 ${error ? 'alert-danger' : 'alert-success'} d-flex align-items-center`} role="alert">
                <i className={`bi me-2 ${error ? 'bi-x-circle' : 'bi-check-circle'}`}></i>
                <div>{error ? error : 'Login successful! Redirecting...'}</div>
                <button type="button" className="btn-close ms-auto" aria-label="Close" onClick={() => { setError(''); setShowToast(false); }}></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginForm; 