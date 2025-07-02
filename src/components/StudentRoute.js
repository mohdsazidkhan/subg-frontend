import { Navigate } from 'react-router-dom';
import { isAuthenticated, getCurrentUser } from '../utils/authUtils';

const StudentRoute = ({ children }) => {
  const user = getCurrentUser();
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // Allow both students and admins to access student pages
  if (user?.role !== 'student' && user?.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default StudentRoute;
