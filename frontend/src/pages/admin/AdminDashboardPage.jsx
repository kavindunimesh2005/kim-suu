import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  BookOpen, FileText, Feather, Image, Mail, Sparkles, 
  TrendingUp, CheckCircle, Clock, ArrowRight 
} from 'lucide-react';

export const AdminDashboardPage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await api.admin.getDashboard();
        setDashboardData(data);
      } catch (err) {
        console.error("Error fetching admin dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentMessages = dashboardData?.recent_messages || [];

  return (
    <div>
      {/* Title */}
      <div className="mb-4">
        <h1 className="font-editorial fw-bold fs-2 mb-1" style={{ color: '#241C1E' }}>
          Portfolio Administration Overview
        </h1>
        <p className="text-muted small">
          Welcome back, Kavii. Manage Suchetha Kapuarachchi's books, publications, and reader correspondence.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="row g-3 mb-4">
        
        {/* Books */}
        <div className="col-sm-6 col-xl-3">
          <div className="admin-stat-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-bold d-block">Published Books</span>
              <span className="fs-2 fw-bold text-dark">{stats.published_books} / {stats.total_books}</span>
              <span className="d-block small text-success">Hulu Aththa & Arungal</span>
            </div>
            <div className="p-3 rounded-circle bg-primary bg-opacity-10 text-primary">
              <BookOpen size={24} />
            </div>
          </div>
        </div>

        {/* Blogs */}
        <div className="col-sm-6 col-xl-3">
          <div className="admin-stat-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-bold d-block">Journal Articles</span>
              <span className="fs-2 fw-bold text-dark">{stats.total_blogs}</span>
              <span className="d-block small text-muted">{stats.published_blogs} Live • {stats.draft_blogs} Drafts</span>
            </div>
            <div className="p-3 rounded-circle bg-success bg-opacity-10 text-success">
              <FileText size={24} />
            </div>
          </div>
        </div>

        {/* Stories */}
        <div className="col-sm-6 col-xl-3">
          <div className="admin-stat-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-bold d-block">Stories & Poetry</span>
              <span className="fs-2 fw-bold text-dark">{stats.total_stories}</span>
              <span className="d-block small text-muted">Excerpts & Poems</span>
            </div>
            <div className="p-3 rounded-circle bg-info bg-opacity-10 text-info">
              <Feather size={24} />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="col-sm-6 col-xl-3">
          <div className="admin-stat-card d-flex align-items-center justify-content-between">
            <div>
              <span className="text-muted small fw-bold d-block">Reader Inquiries</span>
              <span className="fs-2 fw-bold text-dark">{stats.total_messages}</span>
              <span className="d-block small text-danger fw-bold">{stats.new_messages} Unread</span>
            </div>
            <div className="p-3 rounded-circle bg-warning bg-opacity-10 text-warning">
              <Mail size={24} />
            </div>
          </div>
        </div>

      </div>

      {/* Quick Action Cards */}
      <div className="row g-4 mb-4">
        
        {/* Books Quick Link */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Signature Novels</h5>
              <Link to="/admin/books" className="small text-decoration-none fw-bold">Manage &rarr;</Link>
            </div>
            <div className="d-flex flex-column gap-2">
              {dashboardData?.books_summary?.map((b) => (
                <div key={b.id} className="p-3 rounded-3 border d-flex justify-content-between align-items-center bg-light">
                  <div>
                    <span className="fw-bold d-block font-sinhala-title">{b.title_si}</span>
                    <span className="small text-muted">{b.title_en}</span>
                  </div>
                  <span className="badge bg-success small">{b.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Reader Inquiries */}
        <div className="col-md-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="fw-bold mb-0">Recent Inquiries</h5>
              <Link to="/admin/messages" className="small text-decoration-none fw-bold">View All &rarr;</Link>
            </div>
            {recentMessages.length === 0 ? (
              <p className="text-muted small">No inquiries received yet.</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {recentMessages.map((msg) => (
                  <div key={msg.id} className="p-3 rounded-3 border bg-light d-flex justify-content-between align-items-center">
                    <div>
                      <span className="fw-bold d-block small">{msg.name}</span>
                      <span className="text-muted small text-truncate d-block" style={{ maxWidth: '240px' }}>{msg.subject}</span>
                    </div>
                    <span className={`badge ${msg.status === 'new' ? 'bg-danger' : 'bg-secondary'} small text-uppercase`}>
                      {msg.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
