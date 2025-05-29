import { useState, useEffect } from 'react';
import API from '../../utils/api';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    API.get('/admin/students').then(res => setStudents(res.data));
  }, []);
const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <div className='adminPanel'>
      {user?.role === 'admin' && isAdminRoute && <Sidebar />}
    <div className="adminContent p-4 w-full text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Students</h2>
      <table className="table-auto w-full border border-gray-300 dark:border-gray-600">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">Name</th>
            <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">Email</th>
            <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">Phone</th>
            <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">Coins</th>
            <th className="px-4 py-2 border border-gray-300 dark:border-gray-600">Badges</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr
              key={s._id}
              className="text-center border-t border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <td className="py-2 border border-gray-300 dark:border-gray-600">{s.name}</td>
              <td className="border border-gray-300 dark:border-gray-600">{s.email}</td>
              <td className="border border-gray-300 dark:border-gray-600">{s.phone}</td>
              <td className="border border-gray-300 dark:border-gray-600">{s.coins}</td>
              <td className="border border-gray-300 dark:border-gray-600">{(s.badges || []).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default StudentsPage;
