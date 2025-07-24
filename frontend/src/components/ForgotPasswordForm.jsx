import { useState } from 'react';

function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };
  return (
    <div className="container min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="col-12 col-md-8 col-lg-5">
        <div className="card shadow-lg border-0 rounded-4">
          <div className="card-body p-5">
            <h2 className="card-title text-center mb-4 fw-bold">
              <i className="bi bi-key-fill me-2 text-primary"></i>
              Forgot Password
            </h2>
            {submitted ? (
              <div className="alert alert-info d-flex align-items-center">
                <i className="bi bi-info-circle me-2"></i>
                If this email exists, a reset link will be sent.
              </div>
            ) : (
              <form onSubmit={handleSubmit} autoComplete="on">
                <div className="mb-4">
                  <label htmlFor="forgotEmail" className="form-label fw-semibold">
                    <i className="bi bi-envelope me-2"></i>Email
                  </label>
                  <input type="email" className="form-control form-control-lg" id="forgotEmail" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div className="d-grid gap-2">
                  <button type="submit" className="btn btn-primary btn-lg shadow-sm">
                    <i className="bi bi-send me-2"></i>Send Reset Link
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordForm; 