import { useState, useEffect } from 'react';
import API from '../../utils/api';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';
const StudentsPage = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    API.get('/admin/students').then(res => setStudents(res.data));
  }, []);
const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
 const isOpen = useSelector((state) => state.sidebar.isOpen);
  return (
    <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
      {user?.role === 'admin' && isAdminRoute && <Sidebar />}
    <div className="adminContent p-4 w-full text-gray-900 dark:text-white">
      <h2 className="text-2xl font-bold mb-4">Students</h2>
      <div className=' overflow-x-scroll'>
      <table className="table-auto w-full min-w-[600px] border border-gray-300 dark:border-gray-600">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Name</th>
            <th className="p-2 border border-gray-300 dark:border-gray-600 text-left">Email</th>
            <th className="p-2 border border-gray-300 dark:border-gray-600">Phone</th>
            <th className="p-2 border border-gray-300 dark:border-gray-600">Coins</th>
            <th className="p-2 border border-gray-300 dark:border-gray-600">Badges</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr
              key={s._id}
              className="text-center border-t border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <td className="p-2 border border-gray-300 dark:border-gray-600 text-left">{s.name}</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600 text-left">{s.email}</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">{s.phone}</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">{s.coins}</td>
              <td className="p-2 border border-gray-300 dark:border-gray-600">{(s.badges || []).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
    </div>
  );
};

export default StudentsPage;
