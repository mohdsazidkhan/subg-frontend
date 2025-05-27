import { Navigate } from 'react-router-dom';

const StudentRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  return user && user.role === 'student' ? children : <Navigate to="/login" />;
};

export default StudentRoute;
