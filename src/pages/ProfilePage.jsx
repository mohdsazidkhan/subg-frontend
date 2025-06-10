import { useEffect, useState } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [playedQuizzes, setPlayedQuizzes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileAndQuizzes = async () => {
      try {
        const profileRes = await API.get('/student/profile');
        setStudent(profileRes.data);

        const quizzesRes = await API.get(`/live-quizzes/played/${profileRes.data._id}`);
        setPlayedQuizzes(quizzesRes.data?.data || []);
      } catch (err) {
        console.error(err);
        setError('Failed to load profile or quizzes');
      }
    };

    fetchProfileAndQuizzes();
  }, []);

  const showResult = (quiz) => {
    navigate("/quiz-result", {state: {quizResult: quiz}})
  }

  if (error)
    return <div className="p-4 text-red-600 dark:text-red-400">{error}</div>;

  if (!student)
    return <div className="p-4 text-gray-700 dark:text-gray-300">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-900 dark:text-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        🎓 Profile
      </h2>
      {/* Profile Details */}
      <div className="space-y-4 mb-4">
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

      {/* Played Quizzes */}
      <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">🧠 Played Quizzes</h3>
      {playedQuizzes?.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400">No quizzes played yet.</p>
      ) : (
        <div className="space-y-4">
          {playedQuizzes?.map((item, idx) => (
            <div onClick={()=>showResult(item)} key={item._id || idx} className=" cursor-pointer p-4 border rounded bg-gray-100 dark:bg-gray-800">
              <div className='font-medium'>{item?.liveQuiz?.quiz?.title || 'Untitled Quiz'}</div>
              <div><span className='font-medium'>Rank:</span> {item.rank}</div>
              <div><span className='font-medium'>Score:</span> {item.score}</div>
              <div><span className='font-medium'>Coins Earned:</span> {item.coinsEarned}</div>
              <div><span className='font-medium'>Status:</span> {item.completed ? '✅ Completed' : '⏳ In Progress'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
