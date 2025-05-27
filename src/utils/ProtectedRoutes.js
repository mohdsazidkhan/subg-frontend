import { Navigate } from 'react-router-dom';

export const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  return user?.role === 'admin' ? children : <Navigate to="/login" />;
};

export const StudentRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  return user?.role === 'student' ? children : <Navigate to="/login" />;
};
