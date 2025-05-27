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

  if (error) return <div className="p-4 text-red-600">{error}</div>;
  if (!student) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Student Profile</h2>
      <div className="space-y-4">
        <div>
          <strong>Name:</strong> {student.name}
        </div>
        <div>
          <strong>Email:</strong> {student.email}
        </div>
        <div>
          <strong>Phone:</strong> {student.phone}
        </div>
        <div>
          <strong>Coins:</strong> {student.coins || 0}
        </div>
        <div>
          <strong>Badges:</strong>{' '}
          {student.badges && student.badges.length > 0
            ? student.badges.join(', ')
            : 'No badges yet'}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
