import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, KeyRound, ArrowRight, Lock, ArrowLeft } from 'lucide-react';

export const AdminLoginPage = () => {
  const { adminLogin, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await adminLogin(username, password);
      if (res.success) {
        navigate('/admin/dashboard');
      } else {
        setErrorMsg(res.error || 'Invalid credentials');
      }
    } catch (err) {
      setErrorMsg('Failed to connect to backend server');
    } finally {
      setIsSubmitting(false);
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
      <div className="card-literary p-4 p-md-5 max-w-md w-100 shadow-2xl" style={{ maxWidth: '440px', background: '#1c1517', border: '1px solid rgba(255,255,255,0.1)' }}>
        
        {/* Header */}
        <div className="text-center mb-4">
          <div className="d-inline-flex p-3 rounded-circle mb-3" style={{ background: 'rgba(200, 162, 122, 0.15)', color: '#C8A27A' }}>
            <Shield size={32} />
          </div>
          <h2 className="font-editorial fw-bold text-white mb-1">
            Admin Portal
          </h2>
          <p className="small text-muted mb-0">
            Suchetha Kapuarachchi Portfolio Management
          </p>
        </div>

        {errorMsg && (
          <div className="alert alert-danger py-2 small mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small text-muted fw-bold">Admin Username</label>
            <input 
              type="text" 
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="form-control bg-dark text-white border-secondary py-2"
              placeholder="Username"
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label small text-muted fw-bold">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-control bg-dark text-white border-secondary py-2"
              placeholder="••••••••"
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn btn-literary w-100 py-3 rounded-pill justify-content-center"
          >
            <Lock size={16} />
            <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
          </button>
        </form>

        <div className="mt-4 pt-3 border-top border-secondary text-center">
          <Link to="/home" className="text-muted small text-decoration-none d-inline-flex align-items-center gap-1">
            <ArrowLeft size={14} />
            <span>Return to Public Sanctuary</span>
          </Link>
        </div>

      </div>
    </div>
  );
};
