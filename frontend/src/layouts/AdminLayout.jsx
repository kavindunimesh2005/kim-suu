import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, BookOpen, FileText, Feather, Image, 
  User, Mail, Settings, LogOut, ExternalLink, Shield, Menu, X 
} from 'lucide-react';

export const AdminLayout = () => {
  const { adminUser, adminLogout, isAuthenticated, isVerifyingAdmin } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isVerifyingAdmin && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, isVerifyingAdmin, navigate]);

  if (isVerifyingAdmin) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-dark text-white">
        <div className="spinner-border text-light" role="status" />
      </div>
    );
  }

  const handleLogout = async () => {
    await adminLogout();
    navigate('/admin/login');
  };

  const navItems = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/admin/books', icon: BookOpen, label: 'Books Management' },
    { to: '/admin/blogs', icon: FileText, label: 'Blogs Management' },
    { to: '/admin/gallery', icon: Image, label: 'Gallery Management' },
    { to: '/admin/author', icon: User, label: 'Author Profile' },
    { to: '/admin/messages', icon: Mail, label: 'Messages Inbox' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  const sidebarContent = (
    <div className="d-flex flex-column justify-content-between h-100">
      <div>
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between px-2 py-3 mb-3 border-bottom border-secondary">
          <div className="d-flex align-items-center gap-2">
            <Shield size={24} style={{ color: '#C8A27A' }} />
            <div>
              <h5 className="font-editorial fw-bold mb-0 text-white">Admin Hub</h5>
              <span className="small text-muted" style={{ fontSize: '0.75rem' }}>Suchetha Kapuarachchi</span>
            </div>
          </div>
          {/* Mobile close button */}
          <button 
            onClick={() => setMobileOpen(false)}
            className="d-lg-none btn btn-sm text-white p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="d-flex flex-column gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin/dashboard'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span className="small fw-semibold">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Sidebar with User & Actions */}
      <div className="pt-3 border-top border-secondary mt-4">
        <div className="px-2 mb-3">
          <span className="d-block small text-white fw-bold">{adminUser?.name || 'Kavii Admin'}</span>
          <span className="d-block text-muted" style={{ fontSize: '0.75rem' }}>{adminUser?.username || 'admin'}</span>
        </div>

        <div className="d-flex flex-column gap-2">
          <Link 
            to="/home" 
            target="_blank" 
            className="btn btn-sm btn-outline-light d-flex align-items-center justify-content-center gap-2 rounded-pill py-2"
            style={{ fontSize: '0.8rem' }}
          >
            <ExternalLink size={14} />
            <span>View Live Website</span>
          </Link>

          <button 
            onClick={handleLogout}
            className="btn btn-sm btn-danger d-flex align-items-center justify-content-center gap-2 rounded-pill py-2"
            style={{ fontSize: '0.8rem' }}
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="d-flex flex-column flex-lg-row min-vh-100" style={{ background: '#f5f5f7' }}>
      
      {/* Mobile Topbar */}
      <div className="d-lg-none bg-dark text-white px-3 py-2 d-flex align-items-center justify-content-between sticky-top z-3 border-bottom border-secondary">
        <div className="d-flex align-items-center gap-2">
          <button 
            onClick={() => setMobileOpen(true)}
            className="btn btn-sm text-white p-1 border-0"
            aria-label="Toggle menu"
          >
            <Menu size={22} />
          </button>
          <div className="d-flex align-items-center gap-2">
            <Shield size={18} style={{ color: '#C8A27A' }} />
            <span className="fw-bold small font-editorial">Admin Hub</span>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-secondary text-white small" style={{ fontSize: '0.7rem' }}>
            {adminUser?.username || 'admin'}
          </span>
          <button 
            onClick={handleLogout}
            className="btn btn-sm btn-outline-danger p-1 rounded-circle"
            title="Log Out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

      {/* Mobile Slide-Over Drawer */}
      {mobileOpen && (
        <div className="d-lg-none position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1050 }}>
          {/* Backdrop */}
          <div 
            className="position-absolute w-100 h-100 bg-black bg-opacity-75"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer Content */}
          <aside 
            className="admin-sidebar position-relative p-3 h-100 shadow-lg animate-fade-in"
            style={{ width: '280px', maxWidth: '85vw', zIndex: 1060, overflowY: 'auto' }}
          >
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="admin-sidebar p-3 d-none d-lg-flex flex-column flex-shrink-0" style={{ width: '260px', height: '100vh', position: 'sticky', top: 0, overflowY: 'auto' }}>
        {sidebarContent}
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow-1 p-3 p-sm-4 p-md-5 overflow-auto" style={{ minWidth: 0 }}>
        <Outlet />
      </main>

    </div>
  );
};
