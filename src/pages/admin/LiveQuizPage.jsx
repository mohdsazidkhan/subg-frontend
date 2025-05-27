import { useEffect, useState } from 'react';
import API from '../../utils/api';

const LiveQuizPage = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAllQuizzes(); // For creating live quizzes
    fetchLiveQuizzes(); // For managing live quizzes
  }, []);

  const fetchAllQuizzes = async () => {
    try {
      const { data } = await API.get('/admin/quizzes'); // replace with your quiz list endpoint
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

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Live Quiz Management</h2>

      <form onSubmit={createLiveQuiz} className="mb-6 space-y-4">
        {message && <p className="text-green-600">{message}</p>}
        <select
          value={selectedQuiz}
          onChange={(e) => setSelectedQuiz(e.target.value)}
          className="border w-full p-2"
          required
        >
          <option value="">Select a quiz</option>
          {quizList.map((quiz) => (
            <option key={quiz._id} value={quiz._id}>
              {quiz.title}
            </option>
          ))}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Create Live Quiz
        </button>
      </form>

      <h3 className="text-lg font-semibold mb-2">Live Quizzes</h3>
      <ul className="space-y-3">
        {quizzes.map((quiz) => (
          <li key={quiz._id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <h4 className="font-semibold">{quiz.quiz?.title || 'Untitled'}</h4>
              <p>
                Status:{' '}
                <span className="font-medium text-green-700">
                  {quiz.isActive ? 'Live' : 'Ended'}
                </span>
              </p>
            </div>
            <div className="space-x-2">
              {!quiz.isActive ? (
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded"
                  onClick={() => startQuiz(quiz._id)}
                >
                  Start
                </button>
              ) : (
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
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
  );
};

export default LiveQuizPage;
