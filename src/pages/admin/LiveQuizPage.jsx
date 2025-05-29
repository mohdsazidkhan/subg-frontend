import { useEffect, useState } from 'react';
import API from '../../utils/api';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

const LiveQuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAllQuizzes();
    fetchLiveQuizzes();
  }, []);

  const fetchAllQuizzes = async () => {
    try {
      const { data } = await API.get('/admin/quizzes');
      setQuizList(data);
    } catch (err) {
      console.error('Failed to fetch quizzes', err);
    }
  };

  const fetchLiveQuizzes = async () => {
    try {
      const { data } = await API.get('/live-quizzes/all');
      setQuizzes(data);
    } catch (err) {
      console.error('Failed to fetch live quizzes', err);
    }
  };

  const createLiveQuiz = async (e) => {
    e.preventDefault();
    try {
      await API.post('/live-quizzes', { quizId: selectedQuiz });
      setMessage('Live quiz created!');
      setSelectedQuiz('');
      fetchLiveQuizzes();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Error creating live quiz');
    }
  };

  const startQuiz = async (quizId) => {
    try {
      await API.post(`/live-quizzes/${quizId}/start`);
      alert('Quiz started!');
      fetchLiveQuizzes();
    } catch (err) {
      alert('Failed to start quiz');
    }
  };

  const endQuiz = async (quizId) => {
    try {
      await API.post(`/live-quizzes/${quizId}/end`);
      alert('Quiz ended!');
      fetchLiveQuizzes();
    } catch (err) {
      alert('Failed to end quiz');
    }
  };
  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  return (
    <div className='adminPanel'>
      {user?.role === 'admin' && isAdminRoute && <Sidebar />}
    <div className="adminContent p-4 w-full text-gray-900 dark:text-white">
      <h2 className="text-xl font-bold mb-4">Live Quiz Management</h2>

      <form onSubmit={createLiveQuiz} className="mb-6 space-y-4">
        {message && <p className="text-green-600 dark:text-green-400">{message}</p>}
        <select
          value={selectedQuiz}
          onChange={(e) => setSelectedQuiz(e.target.value)}
          className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white w-full p-2 rounded"
          required
        >
          <option value="">Select a quiz</option>
          {quizList.map((quiz) => (
            <option key={quiz._id} value={quiz._id}>
              {quiz.title}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Create Live Quiz
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-2">Live Quizzes</h3>
      <ul className="space-y-3">
        {quizzes.map((quiz) => (
          <li
            key={quiz._id}
            className="border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 p-4 rounded flex justify-between items-center"
          >
            <div>
              <h4 className="font-semibold">{quiz.quiz?.title || 'Untitled'}</h4>
              <p>
                Status:{' '}
                <span
                  className={`font-medium ${quiz.isActive ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'
                    }`}
                >
                  {quiz.isActive ? 'Live' : 'Ended'}
                </span>
              </p>
            </div>
            <div className="space-x-2">
              {!quiz.isActive ? (
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                  onClick={() => startQuiz(quiz._id)}
                >
                  Start
                </button>
              ) : (
                <button
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  onClick={() => endQuiz(quiz._id)}
                >
                  End
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default LiveQuizPage;
