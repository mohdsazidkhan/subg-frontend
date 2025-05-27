const Sidebar = () => {
  return (
    <div className="sidebar">
      <div>
        <ul className="p-4 space-y-2">
          <li><a href="/admin/dashboard" className="hover:text-blue-300">Dashboard</a></li>
          <li><a href="/admin/categories" className="hover:text-blue-300">Categories</a></li>
          <li><a href="/admin/sub-categories" className="hover:text-blue-300">Sub-Categories</a></li>
          <li><a href="/admin/quizzes" className="hover:text-blue-300">Quizzes</a></li>
          <li><a href="/admin/live-quiz" className="hover:text-blue-300">Live Quizzes</a></li>
          <li><a href="/admin/questions" className="hover:text-blue-300">Questions</a></li>
          <li><a href="/admin/students" className="hover:text-blue-300">Students</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
