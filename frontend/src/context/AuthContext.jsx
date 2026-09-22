import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Visitor Invitation State
  const [isInvitationUnlocked, setIsInvitationUnlocked] = useState(() => {
    return sessionStorage.getItem('invitation_unlocked') === 'true';
  });

  // Admin Authentication State
  const [adminUser, setAdminUser] = useState(null);
  const [token, setToken] = useState(() => {
    return localStorage.getItem('admin_token') || null;
  });
  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(true);

  // Check admin session validity on load
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setIsVerifyingAdmin(false);
        return;
      }
      try {
        const res = await fetch('/api/admin/verify', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setAdminUser(data.user);
        } else {
          // Token expired or invalid
          setToken(null);
          setAdminUser(null);
          localStorage.removeItem('admin_token');
        }
      } catch (err) {
        console.error("Token verification error:", err);
      } finally {
        setIsVerifyingAdmin(false);
      }
    };
    verifyToken();
  }, [token]);

  // Visitor Invitation Verification
  const verifyInvitation = (username, password) => {
    const cleanUser = (username || '').trim();
    const cleanPass = (password || '').trim();
    
    // Invitation credentials specified in the prompt:
    // Username: Kim Suu Ah
    // Password: 20-09-2026
    if (cleanUser.toLowerCase() === 'kim suu ah' && cleanPass === '20-09-2026') {
      sessionStorage.setItem('invitation_unlocked', 'true');
      setIsInvitationUnlocked(true);
      return { success: true };
    }
    return { success: false, message: 'ආරාධනා අක්තපත්‍ර වැරදියි. කරුණාකර නැවත උත්සාහ කරන්න.' };
  };

  const lockInvitation = () => {
    sessionStorage.removeItem('invitation_unlocked');
    setIsInvitationUnlocked(false);
  };

  // Admin Login via Backend API
  const adminLogin = async (username, password) => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.auth.token);
        setAdminUser(data.auth);
        localStorage.setItem('admin_token', data.auth.token);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (err) {
      return { success: false, error: 'Could not connect to backend server' };
    }
  };

  // Admin Logout
  const adminLogout = async () => {
    if (token) {
      try {
        await fetch('/api/admin/logout', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (e) {
        // Ignore network errors on logout
      }
    }
    setToken(null);
    setAdminUser(null);
    localStorage.removeItem('admin_token');
  };

  return (
    <AuthContext.Provider value={{
      isInvitationUnlocked,
      verifyInvitation,
      lockInvitation,
      adminUser,
      token,
      isAuthenticated: !!token && !!adminUser,
      isVerifyingAdmin,
      adminLogin,
      adminLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
