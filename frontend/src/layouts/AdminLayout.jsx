import React from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, BookOpen, FileText, Feather, Image, 
  User, Mail, Settings, LogOut, ExternalLink, Shield 
} from 'lucide-react';

export const AdminLayout = () => {
  const { adminUser, adminLogout, isAuthenticated, isVerifyingAdmin } = useAuth();
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
    { to: '/admin/stories', icon: Feather, label: 'Stories & Poems' },
    { to: '/admin/gallery', icon: Image, label: 'Gallery Management' },
    { to: '/admin/author', icon: User, label: 'Author Profile' },
    { to: '/admin/messages', icon: Mail, label: 'Messages Inbox' },
    { to: '/admin/settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="d-flex min-vh-100" style={{ background: '#f5f5f7' }}>
      
      {/* Sidebar */}
      <aside className="admin-sidebar p-3 d-flex flex-column justify-content-between" style={{ width: '260px' }}>
        <div>
          {/* Header */}
          <div className="d-flex align-items-center gap-2 px-2 py-3 mb-3 border-bottom border-secondary">
            <Shield size={24} style={{ color: '#C8A27A' }} />
            <div>
              <h5 className="font-editorial fw-bold mb-0 text-white">Admin Hub</h5>
              <span className="small text-muted" style={{ fontSize: '0.75rem' }}>Suchetha Kapuarachchi</span>
            </div>
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
        <div className="pt-3 border-top border-secondary">
          <div className="px-2 mb-3">
            <span className="d-block small text-white fw-bold">{adminUser?.name || 'Kavii Admin'}</span>
            <span className="d-block text-muted" style={{ fontSize: '0.75rem' }}>{adminUser?.username || 'Kavii'}</span>
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
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow-1 p-4 p-md-5 overflow-auto" style={{ maxHeight: '100vh' }}>
        <Outlet />
      </main>

    </div>
  );
};
