import { useEffect, useState } from 'react';
import API from '../../utils/api';
import { Link } from 'react-router-dom';

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

  return (
    <div className="p-6 w-full text-gray-900 dark:text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
        {cards.map((card) => (
          <Link key={card.title} to={card.link}>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow hover:shadow-md transition">
              <h2 className="text-xl font-semibold">{card.title}</h2>
              <p className="text-2xl mt-2 text-blue-600 dark:text-blue-400">{card.count ?? '-'}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardPage;
