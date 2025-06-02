import { useEffect, useState } from 'react';
import API from '../../utils/api';
import { Link, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';
const DashboardPage = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    API.get('/admin/stats').then((res) => setStats(res.data));
  }, []);

  const cards = [
    { title: 'Categories', count: stats.categories, link: '/admin/categories' },
    { title: 'Subcategories', count: stats.subcategories, link: '/admin/subcategories' },
    { title: 'Quizzes', count: stats.quizzes, link: '/admin/quizzes' },
    { title: 'Questions', count: stats.questions, link: '/admin/questions' },
    { title: 'Students', count: stats.students, link: '/admin/students' },
  ];
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  const isOpen = useSelector((state) => state.sidebar.isOpen);
  return (
    <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
      {user?.role === 'admin' && isAdminRoute && <Sidebar />}
      <div className="adminContent p-4 w-full text-gray-900 dark:text-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {cards.map((card) => (
            <Link key={card.title} to={card.link}>
              <div className="flex justify-between items-center gap-1 bg-white dark:bg-gray-800 py-2 px-4 rounded-lg shadow hover:shadow-md transition">
                <h2 className="text-xl font-semibold">{card.title}</h2>
                <p className="text-2xl mt-2 text-blue-600 dark:text-blue-400">{card.count ?? '-'}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
