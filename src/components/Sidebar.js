import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const linkClasses = ({ isActive }) =>
    `block transition-colors ${
      isActive
        ? "bg-blue-500 text-white"
        : "text-gray-800 dark:text-gray-200"
    }`;

  return (
    <div className="sidebar bg-gray-200 dark:bg-gray-900 w-64">
      <ul className="space-y-2">
        <li>
          <NavLink to="/admin/dashboard" className={linkClasses}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/categories" className={linkClasses}>
            Categories
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/sub-categories" className={linkClasses}>
            Sub-Categories
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/quizzes" className={linkClasses}>
            Quizzes
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/live-quiz" className={linkClasses}>
            Live Quizzes
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/questions" className={linkClasses}>
            Questions
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/students" className={linkClasses}>
            Students
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
