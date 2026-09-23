import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Visitor Invitation Unlocked State
  const [isInvitationUnlocked, setIsInvitationUnlocked] = useState(() => {
    return sessionStorage.getItem('invitation_unlocked') === 'true';
  });

  // Admin Session State
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [isVerifyingAdmin, setIsVerifyingAdmin] = useState(false);

  // Computed authentication status
  const isAuthenticated = Boolean(adminUser && localStorage.getItem('admin_token'));

  // Visitor Invitation Verification
  const verifyInvitation = (username, password) => {
    const cleanUser = (username || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Required credentials:
    // Username: Kim Suu Ah
    // Password: 20-09-2026
    if (cleanUser === 'kim suu ah' && cleanPass === '20-09-2026') {
      sessionStorage.setItem('invitation_unlocked', 'true');
      setIsInvitationUnlocked(true);
      return { success: true };
    }

    return {
      success: false,
      message: 'The invitation does not recognize these details.'
    };
  };

  const unlockInvitationDirectly = () => {
    sessionStorage.setItem('invitation_unlocked', 'true');
    setIsInvitationUnlocked(true);
  };

  // Real Admin Login calling Flask REST API
  const loginAdmin = async (username, password) => {
    try {
      const res = await api.admin.login(username, password);
      if (res && res.success && res.token) {
        localStorage.setItem('admin_token', res.token);
        localStorage.setItem('admin_user', JSON.stringify(res.user));
        setAdminUser(res.user);
        return { success: true, user: res.user };
      }
      return {
        success: false,
        message: res?.error || 'Invalid administrative credentials.'
      };
    } catch (err) {
      console.error('Admin login error:', err);
      return {
        success: false,
        message: 'Could not connect to authentication server. Please ensure the backend is running.'
      };
    }
  };

  // Admin Logout
  const logoutAdmin = async () => {
    try {
      await api.admin.logout();
    } catch (e) {
      // Ignore network errors on logout
    }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_mock_user');
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isInvitationUnlocked,
        verifyInvitation,
        unlockInvitationDirectly,
        adminUser,
        isAuthenticated,
        isVerifyingAdmin,
        loginAdmin,
        adminLogin: loginAdmin,
        logoutAdmin,
        adminLogout: logoutAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
