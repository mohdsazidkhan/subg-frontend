import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MdClose,
  MdDarkMode,
  MdDashboard,
  MdLightMode,
  MdLogout,
  MdMenu,
  MdPerson4,
  MdPersonAdd,
} from "react-icons/md";
import { toggleSidebar } from "../store/sidebarSlice";
import { useDispatch, useSelector } from "react-redux";
import { BsPersonCircle } from "react-icons/bs";
import { secureLogout, getCurrentUser } from "../utils/authUtils";
import { hasActiveSubscription } from "../utils/subscriptionUtils";
import { isAdmin, hasAdminPrivileges } from "../utils/adminUtils";
import logoimage from "../assets/logo.png";
import { FaCreditCard, FaCalendarAlt } from "react-icons/fa";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      if (savedTheme) return savedTheme;
      if (window.matchMedia("(prefers-color-scheme: dark)").matches)
        return "dark";
    }
    return "light";
  });
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");
  const handleLogout = () => secureLogout(navigate);

  // Navbar links for students
  const studentLinks = (
    <>
      <Link
        title={hasActiveSubscription() ? "My Subscription" : "Subscribe Now"}
        to="/subscription"
        className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-md transition-all duration-200 text-white text-sm bg-gradient-to-r ${
          hasActiveSubscription()
            ? "from-green-500 to-green-700 hover:from-green-600 hover:to-green-800"
            : "from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800"
        } scale-95 hover:scale-100`}
      >
        <span className="text-lg flex items-center">
          {hasActiveSubscription() ? <FaCalendarAlt /> : <FaCreditCard />}
        </span>
        <span className="hidden sm:inline">
          {hasActiveSubscription() ? "Active" : "Subscribe"}
        </span>
      </Link>
      <Link
        title="My Profile"
        to="/profile"
        className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-1 shadow-lg hover:scale-105 transition-transform border-2 border-white dark:border-gray-800"
      >
        <BsPersonCircle className="text-2xl text-white" />
      </Link>
    </>
  );

  // Navbar links for admin
  const adminLinks = (
    <Link
      title="Admin Dashboard"
      to="/admin/dashboard"
      className="px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-md transition-all duration-200 text-white text-sm bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 scale-95 hover:scale-100"
    >
      <MdDashboard />
      <span className="hidden sm:inline">Admin</span>
    </Link>
  );

  // Auth links for guests
  const guestLinks = (
    <>
      <Link
        to="/login"
        title="Login"
        className="px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-md transition-all duration-200 text-white text-sm bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 scale-95 hover:scale-100"
      >
        <MdPerson4 /> Login
      </Link>
      <Link
        title="Register"
        to="/register"
        className="px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-md transition-all duration-200 text-white text-sm bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 scale-95 hover:scale-100"
      >
        <MdPersonAdd /> Register
      </Link>
    </>
  );

  // Main navbar content
  return (
    <nav className="backdrop-blur-xl bg-gradient-to-r from-blue-50/80 via-purple-50/80 to-indigo-50/80 dark:from-gray-900/80 dark:via-blue-900/80 dark:to-purple-900/80 border-b border-white/30 dark:border-gray-800 shadow-xl fixed top-0 left-0 w-full z-50 transition-all">
      <div className="container-fluid mx-auto px-4 sm:px-4 flex justify-between items-center h-16 relative">
        {/* Logo */}
        <Link
          to={
            user && isAdmin() && hasAdminPrivileges() ? "/admin/dashboard" : "/"
          }
          className="flex items-center gap-2 group"
        >
          <img
            src={logoimage}
            alt="SUBG QUIZ"
            title="SUBG QUIZ"
            className="logo"
          />
        </Link>

        {/* Desktop Links */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            className="rounded-full p-2 bg-gradient-to-r from-yellow-400 to-yellow-600 dark:from-blue-700 dark:to-purple-700 shadow-lg border-2 border-white dark:border-gray-800 hover:scale-110 transition-all duration-200"
          >
            {theme === "dark" ? (
              <MdLightMode className="text-white text-xl" />
            ) : (
              <MdDarkMode className="text-yellow-700 text-xl" />
            )}
          </button>
          {user ? (
            <>
              {user.role === "student" && studentLinks}
              {isAdmin() && hasAdminPrivileges() && adminLinks}
              <button
                title="Logout"
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-md transition-all duration-200 text-white text-sm bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 scale-95 hover:scale-100"
              >
                <MdLogout />
              </button>
              {isAdmin() && hasAdminPrivileges() && (
                <button
                  title="Toggle Admin Menu"
                  onClick={() => dispatch(toggleSidebar())}
                  className="px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-md transition-all duration-200 text-white text-sm bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 scale-95 hover:scale-100"
                >
                  {isOpen ? <MdClose /> : <MdMenu />}
                  <span className="hidden sm:inline">Menu</span>
                </button>
              )}
            </>
          ) : (
            guestLinks
          )}
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenu && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-gradient-to-br from-blue-50/95 via-purple-50/95 to-indigo-50/95 dark:from-gray-900/95 dark:via-blue-900/95 dark:to-purple-900/95 shadow-2xl border-b border-white/30 dark:border-gray-800 animate-fade-in-down z-40">
          <div className="flex flex-col items-center gap-4 py-6">
            {user ? (
              <>
                {user.role === "student" && studentLinks}
                {isAdmin() && hasAdminPrivileges() && adminLinks}
                <button
                  title="Logout"
                  onClick={() => {
                    setMobileMenu(false);
                    handleLogout();
                  }}
                  className="px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-md transition-all duration-200 text-white text-sm bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 scale-95 hover:scale-100"
                >
                  <MdLogout /> Logout
                </button>
                {isAdmin() && hasAdminPrivileges() && (
                  <button
                    title="Toggle Admin Menu"
                    onClick={() => {
                      setMobileMenu(false);
                      dispatch(toggleSidebar());
                    }}
                    className="px-4 py-2 rounded-xl font-semibold flex items-center gap-2 shadow-md transition-all duration-200 text-white text-sm bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 scale-95 hover:scale-100"
                  >
                    {isOpen ? <MdClose /> : <MdMenu />}
                    <span className="hidden sm:inline">Menu</span>
                  </button>
                )}
              </>
            ) : (
              guestLinks
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
