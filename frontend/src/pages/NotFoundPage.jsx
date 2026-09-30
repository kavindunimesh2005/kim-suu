import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="py-5 text-center container my-5">
      <img src="/assets/pink-lotus.png" alt="Lotus" style={{ width: '64px', height: '64px' }} className="mb-3" />
      <h1 className="font-editorial display-3 fw-bold" style={{ color: 'var(--color-primary)' }}>404</h1>
      <h3 className="font-sinhala-title fs-3 mb-3">පිටුව සොයාගත නොහැකි විය</h3>
      <p className="text-muted small mb-4">The literary page you are looking for has drifted away or does not exist.</p>
      <Link to="/home" className="btn btn-literary rounded-pill px-4">
        <Home size={18} />
        <span>Return to Home Sanctuary</span>
      </Link>
    </div>
  );
};
