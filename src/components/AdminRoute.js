import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  return user && user.role === 'admin' ? children : <Navigate to="/" />;
};

export default AdminRoute;
