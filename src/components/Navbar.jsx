// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-2 flex justify-between items-center fixed top-0 w-full">
      <div className="text-lg font-bold">
        <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/'}>SUBG</Link>
      </div>
      <div className="space-x-4">
        {user ? (
          <>
<span className="hidden sm:inline">Welcome, {user?.name}</span>
            {user.role === 'student' && (
              <>
                <Link to="/student/profile">Profile</Link>
              </>
            )}
            <button onClick={handleLogout} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
