import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MdDarkMode,
  MdDashboard,
  MdLightMode,
  MdLogout,
  MdPerson4,
  MdPersonAdd,
} from "react-icons/md";
import { toggleSidebar } from "../store/sidebarSlice";
import { useDispatch, useSelector } from "react-redux";
import { BsPersonCircle, BsSearch } from "react-icons/bs";
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
        title="Search"
        to="/search"
        className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 p-2 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
      >
        <BsSearch className="text-lg text-white" />
      </Link>
      <Link
        title="Rewards"
        to="/rewards"
        className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-600 p-2 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
      >
        <span className="text-lg text-white">🏆</span>
      </Link>
      <Link
        title={hasActiveSubscription() ? "My Subscription" : "Subscribe Now"}
        to="/subscription"
        className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 p-2 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
      >
        <span className="text-lg text-white">
          {hasActiveSubscription() ? <FaCalendarAlt /> : <FaCreditCard />}
        </span>
      </Link>
      <Link
        title="My Profile"
        to="/profile"
        className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-red-500 p-2 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
      >
        <BsPersonCircle className="text-lg text-white" />
      </Link>
    </>
  );

  // Navbar links for admin
  const adminLinks = (
    <Link
      title="Admin Dashboard"
      to="/admin/dashboard"
      className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-600 p-2 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
    >
      <MdDashboard className="text-lg text-white" />
    </Link>
  );

  // Auth links for guests
  const guestLinks = (
    <>
      <Link
        to="/login"
        title="Login"
        className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 p-2 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
      >
        <MdPerson4 className="text-lg text-white" />
      </Link>
      <Link
        title="Register"
        to="/register"
        className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-red-600 p-2 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
      >
        <MdPersonAdd className="text-lg text-white" />
      </Link>
    </>
  );

  // Main navbar content
  return (
  <nav className="bg-subg-light dark:bg-subg-dark shadow-xl fixed top-0 left-0 w-full z-50 border-b dark:border-gray-500 duration-300 transition-all">
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
        <div className="flex items-center gap-2">
          
          <button
            onClick={toggleTheme}
            aria-label="Toggle Dark Mode"
            title={theme === "dark" ? "Light Mode" : "Dark Mode"}
            className="w-8 h-8 rounded-full p-2 bg-gradient-to-r from-yellow-400 to-yellow-600 dark:from-yellow-700 dark:to-red-700 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
          >
            {theme === "dark" ? (
              <MdLightMode className="text-white text-lg" />
            ) : (
              <MdDarkMode className="text-white text-lg" />
            )}
          </button>
          {user ? (
            <>
              {user.role === "student" && studentLinks}
              {isAdmin() && hasAdminPrivileges() && adminLinks}
              <button
                title="Logout"
                onClick={handleLogout}
                className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-700 p-2 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
              >
                <MdLogout className="text-lg text-white" />
              </button>
              {isAdmin() && hasAdminPrivileges() && (
                <button
                  title="Toggle Admin Menu"
                  onClick={() => dispatch(toggleSidebar())}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-700 p-2 shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
                >
                  <span className="text-lg text-white">☰</span>
                </button>
              )}
            </>
          ) : (
            guestLinks
          )}
        </div>

      </div>
    </nav>
  );
}
