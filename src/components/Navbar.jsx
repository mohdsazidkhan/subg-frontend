import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { MdClose, MdDarkMode, MdDashboard, MdLightMode, MdLogout, MdMenu, MdPerson4, MdPersonAdd } from 'react-icons/md';
import { toggleSidebar } from '../store/sidebarSlice';
import { useDispatch, useSelector } from 'react-redux';
import { BiWallet } from 'react-icons/bi';
import { BsPersonCircle, } from 'react-icons/bs';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.sidebar.isOpen);
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
    <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white p-2 flex justify-between items-center fixed top-0 w-full z-50 shadow-md">
      <div className="text-xl font-bold">
        <Link to={'/'} className="hover:text-blue-600 dark:hover:text-blue-400 transition">
          <img className='logo' alt='logo' title='SUBG QUIZ' src={'./logo.png'}/>
        </Link>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={toggleTheme}
          aria-label="Toggle Dark Mode"
          title={`${theme === 'dark' ? "Light Mode" : "Dark Mode"}`}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded hover:text-white transition"
        >
          {theme === 'dark' ? <MdLightMode /> : <MdDarkMode/>}
        </button>
        {user ? (
          <>
            
            {user?.role === 'student' && (
              <>
                <Link 
                title='My Wallet' 
                to="/wallet" 
                className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-700 hover:text-white dark:hover:text-white transition">
                  <BiWallet />
                </Link>
                <Link
                  title='My Profile'
                  to="/student/profile"
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 hover:text-white dark:hover:text-white transition"
                >
                  <BsPersonCircle />
                </Link>
              </>
            )}
             {user.role === "admin" &&
            
             <Link
                  title='Dashboard'
                  to="/admin/dashboard"
                  className="bg-blue-600 text-white px-3 py-1 rounded hover:text-blue-600 dark:hover:text-blue-400 transition"
                >
                  <MdDashboard />
                </Link>
             }
            <button
              title="Logout"
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
            >
              <MdLogout/>
            </button>
            {user.role === "admin" &&
            <button
              title="Toggle Menu"
              onClick={() => dispatch(toggleSidebar())}
              className="toggleMenu bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition"
            >
              {isOpen ? <MdClose /> : <MdMenu/>}
            </button>
            }
            
          </>
        ) : (
          <>
            <Link
              to="/login"
              title='Login'
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
            >
              <MdPerson4/>
            </Link>
            <Link
              title='Register'
              to="/register"
              className="bg-pink-600 text-white px-3 py-1 rounded hover:bg-pink-700 transition"
            >
             <MdPersonAdd/> 
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
