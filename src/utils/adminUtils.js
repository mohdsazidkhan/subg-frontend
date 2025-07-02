import { getCurrentUser, isAuthenticated } from './authUtils';
import { toast } from 'react-toastify';

/**
 * Check if current user is admin
 * @returns {boolean}
 */
export const isAdmin = () => {
  try {
    const user = getCurrentUser();
    return user?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

/**
 * Check if current user has admin privileges
 * @returns {boolean}
 */
export const hasAdminPrivileges = () => {
  try {
    if (!isAuthenticated()) return false;
    
    const user = getCurrentUser();
    if (!user) return false;
    
    // Check admin role
    if (user.role !== 'admin') return false;
    
    // Check if user is active
    if (user.status === 'inactive' || user.isBlocked) return false;
    
    return true;
  } catch (error) {
    console.error('Error checking admin privileges:', error);
    return false;
  }
};

/**
 * Require admin privileges for access
 * @param {Function} navigate - React Router navigate function
 * @param {string} redirectTo - Where to redirect if not admin
 * @returns {boolean} - true if has admin privileges, false otherwise
 */
export const requireAdmin = (navigate, redirectTo = '/') => {
  if (!hasAdminPrivileges()) {
    toast.error('Access denied. Admin privileges required.');
    if (navigate) {
      navigate(redirectTo);
    }
    return false;
  }
  return true;
};

/**
 * Check if user can perform specific admin action
 * @param {string} action - Admin action (create, update, delete, view)
 * @returns {boolean}
 */
export const canPerformAdminAction = (action) => {
  try {
    const user = getCurrentUser();
    if (!hasAdminPrivileges()) return false;
    
    // Check specific permissions if they exist
    if (user.permissions) {
      return user.permissions.includes(action);
    }
    
    // Default: admin can perform all actions
    return true;
  } catch (error) {
    console.error('Error checking admin action permission:', error);
    return false;
  }
};

/**
 * Log admin action for security monitoring
 * @param {string} action - Action performed
 * @param {string} resource - Resource affected
 * @param {Object} details - Additional details
 */
export const logAdminAction = (action, resource, details = {}) => {
  try {
    const user = getCurrentUser();
    const logEntry = {
      timestamp: new Date().toISOString(),
      adminEmail: user?.email,
      adminId: user?._id,
      action,
      resource,
      details,
      userAgent: navigator.userAgent,
      ip: 'client-side' // Will be captured by server
    };
    
    console.log('Admin Action Log:', logEntry);
    
    // You can send this to your logging service
    // API.post('/admin/logs', logEntry);
    
  } catch (error) {
    console.error('Error logging admin action:', error);
  }
};

/**
 * Get admin user info
 * @returns {Object|null}
 */
export const getAdminUser = () => {
  try {
    const user = getCurrentUser();
    if (hasAdminPrivileges()) {
      return user;
    }
    return null;
  } catch (error) {
    console.error('Error getting admin user:', error);
    return null;
  }
};

/**
 * Check if admin session is valid
 * @returns {boolean}
 */
export const isAdminSessionValid = () => {
  try {
    if (!isAuthenticated()) return false;
    
    const user = getCurrentUser();
    if (!user || user.role !== 'admin') return false;
    
    // Check if admin account is still active
    if (user.status === 'inactive' || user.isBlocked) return false;
    
    return true;
  } catch (error) {
    console.error('Error checking admin session:', error);
    return false;
  }
};

/**
 * Admin permissions configuration
 */
export const ADMIN_PERMISSIONS = {
  DASHBOARD: 'view_dashboard',
  USERS: 'manage_users',
  CATEGORIES: 'manage_categories',
  QUIZZES: 'manage_quizzes',
  QUESTIONS: 'manage_questions',
  SUBSCRIPTIONS: 'manage_subscriptions',
  REPORTS: 'view_reports',
  SETTINGS: 'manage_settings',
  LOGS: 'view_logs'
};

/**
 * Check if admin has specific permission
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const hasAdminPermission = (permission) => {
  try {
    const user = getCurrentUser();
    if (!hasAdminPrivileges()) return false;
    
    // If user has specific permissions array, check it
    if (user.permissions && Array.isArray(user.permissions)) {
      return user.permissions.includes(permission);
    }
    
    // Default: admin has all permissions
    return true;
  } catch (error) {
    console.error('Error checking admin permission:', error);
    return false;
  }
}; 