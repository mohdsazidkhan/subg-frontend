import { useEffect, useState } from 'react';
import API from '../utils/api';

const ProfilePage = () => {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/student/profile');
        setStudent(res.data);
      } catch (err) {
        setError('Failed to load profile');
      }
    };

    fetchProfile();
  }, []);

  if (error)
    return <div className="p-4 text-red-600 dark:text-red-400">{error}</div>;
  if (!student)
    return <div className="p-4 text-gray-700 dark:text-gray-300">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white dark:bg-gray-900 dark:text-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        🎓 Profile
      </h2>
      <div className="space-y-4">
        <div>
          <strong className="text-gray-700 dark:text-gray-300">Name:</strong> {student.name}
        </div>
        <div>
          <strong className="text-gray-700 dark:text-gray-300">Email:</strong> {student.email}
        </div>
        <div>
          <strong className="text-gray-700 dark:text-gray-300">Phone:</strong> {student.phone}
        </div>
        <div>
          <strong className="text-gray-700 dark:text-gray-300">Coins:</strong> 💰{student.coins || 0}
        </div>
        <div>
          <strong className="text-gray-700 dark:text-gray-300">Balance:</strong> ₹ {student.balance || 0}
        </div>
        <div>
          <strong className="text-gray-700 dark:text-gray-300">Badges:</strong>{' '}
          {student.badges && student.badges.length > 0
            ? student.badges.join(', ')
            : 'No badges yet'}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
