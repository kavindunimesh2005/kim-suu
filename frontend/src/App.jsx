import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout Components
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AdminLayout } from './layouts/AdminLayout';
import { MusicProvider } from './components/music/MusicProvider';
import { MusicButton } from './components/music/MusicButton';

// Public Pages
import { InvitationPage } from './pages/InvitationPage';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { BooksPage } from './pages/BooksPage';
import { BookDetailPage } from './pages/BookDetailPage';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { GalleryPage } from './pages/GalleryPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminBooksPage } from './pages/admin/AdminBooksPage';
import { AdminBlogsPage } from './pages/admin/AdminBlogsPage';
import { AdminStoriesPage } from './pages/admin/AdminStoriesPage';
import { AdminGalleryPage } from './pages/admin/AdminGalleryPage';
import { AdminAuthorPage } from './pages/admin/AdminAuthorPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Layout wrapper for Public Pages
const PublicLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
      <MusicButton />
    </div>
  );
};

// Root Route handler:
// If visitor hasn't unsealed the invitation, shows InvitationPage!
// Once unsealed, redirects to /home.
const RootEntry = () => {
  const { isInvitationUnlocked } = useAuth();
  if (!isInvitationUnlocked) {
    return <InvitationPage />;
  }
  return <Navigate to="/home" replace />;
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <MusicProvider>
            <Router>
              <Routes>
              {/* Initial Welcome / Cinematic Invitation Experience */}
              <Route path="/" element={<RootEntry />} />
              <Route path="/invitation" element={<InvitationPage />} />

              {/* Public Portfolio Sanctuary */}
              <Route element={<PublicLayout />}>
                <Route path="/home" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/books/:slug" element={<BookDetailPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogDetailPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/contact" element={<ContactPage />} />
              </Route>

              {/* Admin Portal */}
              <Route path="/admin/login" element={<AdminLoginPage />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="books" element={<AdminBooksPage />} />
                <Route path="blogs" element={<AdminBlogsPage />} />
                <Route path="stories" element={<AdminStoriesPage />} />
                <Route path="gallery" element={<AdminGalleryPage />} />
                <Route path="author" element={<AdminAuthorPage />} />
                <Route path="messages" element={<AdminMessagesPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
              </Route>

              {/* 404 Fallback */}
              <Route element={<PublicLayout />}>
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </Router>
        </MusicProvider>
      </LanguageProvider>
    </ThemeProvider>
  </AuthProvider>
  );
}

export default App;
