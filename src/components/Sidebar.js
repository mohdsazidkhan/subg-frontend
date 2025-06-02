import { NavLink } from "react-router-dom";
import { toggleSidebar } from '../store/sidebarSlice';
import { useDispatch, useSelector } from 'react-redux';
const Sidebar = () => {
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const dispatch = useDispatch();

  const linkClasses = ({ isActive }) =>
    `block transition-colors ${
      isActive
        ? "bg-blue-500 text-white"
        : "text-gray-800 dark:text-gray-200"
    }`;

  return (
    <div className={`sidebar bg-gray-200 dark:bg-gray-900 w-64 ${
        isOpen ? 'showSidebar' : 'hideSidebar'
      }`}>
      <ul className="space-y-2">
        <li>
          <NavLink onClick={()=>dispatch(toggleSidebar())} to="/admin/dashboard" className={linkClasses}>
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink onClick={()=>dispatch(toggleSidebar())} to="/admin/categories" className={linkClasses}>
            Categories
          </NavLink>
        </li>
        <li>
          <NavLink onClick={()=>dispatch(toggleSidebar())} to="/admin/sub-categories" className={linkClasses}>
            Sub-Categories
          </NavLink>
        </li>
        <li>
          <NavLink onClick={()=>dispatch(toggleSidebar())} to="/admin/quizzes" className={linkClasses}>
            Quizzes
          </NavLink>
        </li>
        <li>
          <NavLink onClick={()=>dispatch(toggleSidebar())} to="/admin/live-quiz" className={linkClasses}>
            Live Quizzes
          </NavLink>
        </li>
        <li>
          <NavLink onClick={()=>dispatch(toggleSidebar())} to="/admin/questions" className={linkClasses}>
            Questions
          </NavLink>
        </li>
        <li>
          <NavLink onClick={()=>dispatch(toggleSidebar())} to="/admin/students" className={linkClasses}>
            Students
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
