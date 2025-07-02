import { Navigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../utils/authUtils';
import { hasActiveSubscription } from '../utils/subscriptionUtils';
import { toast } from 'react-toastify';

/**
 * Route component that requires active subscription
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} props.redirectTo - Where to redirect if no subscription (default: '/subscription')
 * @param {boolean} props.showToast - Whether to show error toast (default: true)
 */
const SubscriptionRoute = ({ children, redirectTo = '/subscription', showToast = true }) => {
  // First check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Then check if user has active subscription
  if (!hasActiveSubscription()) {
    if (showToast) {
      toast.error('This feature requires an active subscription!');
    }
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default SubscriptionRoute; 