import { useState, useEffect } from 'react';
import API from '../../utils/api';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    API.get('/admin/students').then(res => setStudents(res.data));
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Students</h2>
      <table className="table-auto w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Coins</th>
            <th>Badges</th>
          </tr>
        </thead>
        <tbody>
          {students.map(s => (
            <tr key={s._id} className="text-center border-t">
              <td className="py-2">{s.name}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td>{s.coins}</td>
              <td>{(s.badges || []).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentsPage;
