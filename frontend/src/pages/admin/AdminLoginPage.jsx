import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { loginAdmin, isAuthenticated } = useAuth();
  
  const [username, setUsername] = useState('Kavii');
  const [password, setPassword] = useState('Kavii@2005');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const res = await loginAdmin(username, password);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setIsError(true);
        setMessage(res.message || 'Invalid administrative credentials.');
      }
    } catch (err) {
      setIsError(true);
      setMessage('Failed to authenticate. Please verify backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center p-3"
      style={{
        background: 'radial-gradient(circle at center, #241C1E 0%, #120A0E 100%)',
        color: '#F8F3EE'
      }}
    >
      <div
        className="card-literary p-4 p-md-5 w-100 shadow-2xl"
        style={{
          maxWidth: '440px',
          background: '#1C1517',
          border: '1px solid rgba(200, 162, 122, 0.3)'
        }}
      >
        {/* Back Link */}
        <div className="mb-4">
          <Link
            to="/home"
            className="text-decoration-none d-inline-flex align-items-center gap-2 small text-muted hover-text-white"
          >
            <ArrowLeft size={16} />
            <span>Return to Portfolio</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-4">
          <div
            className="d-inline-flex p-3 rounded-circle mb-3"
            style={{ background: 'rgba(200, 162, 122, 0.15)', color: '#C8A27A' }}
          >
            <Shield size={32} />
          </div>
          <h2 className="font-editorial fw-bold text-white mb-1">
            Admin Sanctuary
          </h2>
          <p className="small text-muted mb-0">
            Suchetha Kapuarachchi Portfolio Administration
          </p>
        </div>

        {/* Status / Error Banner */}
        {message && (
          <div
            className={`alert ${isError ? 'alert-danger' : 'alert-info'} py-2 small mb-4 d-flex align-items-center gap-2`}
            role="alert"
          >
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-semibold text-muted">Admin Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-control"
              style={{
                background: '#2A2024',
                borderColor: 'rgba(200, 162, 122, 0.4)',
                color: '#FFFFFF'
              }}
              required
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-semibold text-muted">Secret Passcode</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-control"
              style={{
                background: '#2A2024',
                borderColor: 'rgba(200, 162, 122, 0.4)',
                color: '#FFFFFF'
              }}
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-literary w-100 py-3 justify-content-center shadow"
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
            ) : (
              <>
                <span>Sign In to Sanctuary</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-4 pt-3 border-top border-secondary border-opacity-25 text-center">
          <span className="small text-muted" style={{ fontSize: '0.75rem' }}>
            Secured via JWT & Werkzeug scrypt hashing • Suchetha Kapuarachchi Portfolio
          </span>
        </div>
      </div>
    </div>
  );
};
