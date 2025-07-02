import { Navigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../utils/authUtils';
import { hasSubscriptionPlan } from '../utils/subscriptionUtils';
import { toast } from 'react-toastify';

/**
 * Route component that requires specific subscription plan
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render
 * @param {string} props.requiredPlan - Required subscription plan (basic, premium, pro)
 * @param {string} props.redirectTo - Where to redirect if no subscription (default: '/subscription')
 * @param {boolean} props.showToast - Whether to show error toast (default: true)
 */
const PlanRoute = ({ children, requiredPlan, redirectTo = '/subscription', showToast = true }) => {
  // First check if user is authenticated
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Then check if user has required subscription plan
  if (!hasSubscriptionPlan(requiredPlan)) {
    if (showToast) {
      toast.error(`This feature requires a ${requiredPlan} subscription!`);
    }
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default PlanRoute; 