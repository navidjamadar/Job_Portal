import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import JobList from './components/JobList';
import LoginForm from './components/LoginForm';
import ApplyForm from './components/ApplyForm';
import AddJobForm from './components/AddJobForm';
import RegisterForm from './components/RegisterForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';

function LogoutButton({ setIsLoggedIn, setIsAdmin }) {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setIsAdmin(false);
    navigate('/login');
  };
  return <button className="btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button>;
}

function PrivateRoute({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwt'));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('role') === 'admin');
  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(!!localStorage.getItem('jwt'));
      setIsAdmin(localStorage.getItem('role') === 'admin');
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">Job Portal</Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link" to="/">View Jobs</Link>
              </li>
              {isAdmin && (
                <li className="nav-item">
                  <Link className="nav-link" to="/add-job">Add Job</Link>
                </li>
              )}
              {!isAdmin && (
                <li className="nav-item">
                  <Link className="nav-link" to="/apply">Apply for Job</Link>
                </li>
              )}
            </ul>
            <div className="d-flex">
              {!isLoggedIn && <Link className="btn btn-outline-light me-2" to="/login">Login</Link>}
              {!isLoggedIn && <Link className="btn btn-outline-light" to="/register">Register</Link>}
              {isLoggedIn && <LogoutButton setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />}
            </div>
          </div>
        </div>
      </nav>
      <div className="container-fluid py-4 px-lg-5">
        <Routes>
          {isAdmin ? (
            <>
              <Route path="/" element={<PrivateRoute isLoggedIn={isLoggedIn}><JobList isAdmin={true} /></PrivateRoute>} />
              <Route path="/add-job" element={<PrivateRoute isLoggedIn={isLoggedIn}><AddJobForm /></PrivateRoute>} />
              <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            </>
          ) : (
            <>
              <Route path="/" element={<PrivateRoute isLoggedIn={isLoggedIn}><JobList isAdmin={false} /></PrivateRoute>} />
              <Route path="/login" element={<LoginForm setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} />} />
              <Route path="/register" element={<RegisterForm />} />
              <Route path="/apply" element={<PrivateRoute isLoggedIn={isLoggedIn}><ApplyForm /></PrivateRoute>} />
              <Route path="/add-job" element={<PrivateRoute isLoggedIn={isLoggedIn}><AddJobForm /></PrivateRoute>} />
              <Route path="/forgot-password" element={<ForgotPasswordForm />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
