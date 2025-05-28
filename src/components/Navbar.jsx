import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));

  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-3 flex justify-between items-center fixed top-0 w-full z-50 shadow-md">
      <div className="text-xl font-bold">
        <Link to={user?.role === 'admin' ? '/admin/dashboard' : '/'} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
          SUBG
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
          className="border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded px-3 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>

        {user ? (
          <>
            <span className="hidden sm:inline">Welcome, {user.name}</span>
            {user.role === 'student' && (
              <Link
                to="/student/profile"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition"
              >
                Profile
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
