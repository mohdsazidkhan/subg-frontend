import { Navigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../utils/authUtils';
import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';

const AdminRoute = ({ children }) => {
  const [authState, setAuthState] = useState({
    isLoading: true,
    allowAccess: false,
    redirect: null
  });

  useEffect(() => {
    const checkAuth = () => {
      console.log('🔍 AdminRoute Debug:', {
        isAuthenticated: isAuthenticated(),
        user: getCurrentUser(),
        userRole: getCurrentUser()?.role,
        userStatus: getCurrentUser()?.status,
        userIsBlocked: getCurrentUser()?.isBlocked
      });

      // Default: allow access
      let access = true;
      let redirectComponent = null;

      if (!isAuthenticated()) {
        console.warn('AdminRoute: User not authenticated, redirecting to login');
        toast.error('Please login to access admin panel');
        access = false;
        redirectComponent = <Navigate to="/login" replace />;
      } else {
        const user = getCurrentUser();
        if (!user) {
          console.warn('AdminRoute: No user data found, redirecting to login');
          toast.error('User session invalid, please login again');
          access = false;
          redirectComponent = <Navigate to="/login" replace />;
        } else if (user.role !== 'admin') {
          console.warn(`AdminRoute: Unauthorized access attempt by user ${user?.email} with role ${user?.role}`);
          toast.error('Access denied. Admin privileges required.');
          access = false;
          redirectComponent = <Navigate to="/" replace />;
        } else if (user.status === 'inactive' || user.isBlocked) {
          console.warn(`AdminRoute: Blocked/inactive user ${user?.email} attempted admin access`);
          toast.error('Your account has been deactivated. Please contact support.');
          access = false;
          redirectComponent = <Navigate to="/login" replace />;
        }
      }
      
      console.log('🔍 AdminRoute Decision:', { access, redirectComponent: redirectComponent ? 'Will redirect' : 'Will allow access' });
      
      setAuthState({
        isLoading: false,
        allowAccess: access,
        redirect: redirectComponent
      });
      
      // Log successful admin access
      if (access && getCurrentUser() && getCurrentUser().email) {
        console.log(`AdminRoute: Admin ${getCurrentUser().email} accessed admin panel at ${new Date().toISOString()}`);
      }
    };

    // Small delay to prevent race conditions
    const timer = setTimeout(checkAuth, 100);
    return () => clearTimeout(timer);
  }, []);

  if (authState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!authState.allowAccess) return authState.redirect;
  return children;
};

// Access Denied Component for better UX
export const AdminAccessDenied = ({ reason = "Access denied" }) => {
  return (
    <div className="admin-access-denied">
      <h2>🚫 Admin Access Denied</h2>
      <p>{reason}</p>
      <p className="text-sm text-gray-500">
        If you believe this is an error, please contact the system administrator.
      </p>
    </div>
  );
};

export default AdminRoute;
