import { useEffect, useState } from 'react';
import API from '../../utils/api';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-toastify';

const LiveQuizPage = () => {

  const [quizzes, setQuizzes] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [accessType, setAccessType] = useState('free');
  const [coinsToPlay, setCoinsToPlay] = useState('');
  const [startTime, setStartTime] = useState(null); // Use null for empty Date
  const [endTime, setEndTime] = useState(null);

  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

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

  // Format Date object to HH:mm string
  const formatTime = (date) => {
    if (!date) return '';
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const createLiveQuiz = async (e) => {
    e.preventDefault();

    if (!startTime || !endTime) {
      toast.error('Please select both start and end time');
      return;
    }

    try {
      const response = await API.post('/admin/live-quiz/create', {
        quizId: selectedQuiz,
        isPro: accessType === 'pro',
        coinsToPlay: accessType === 'pro' ? Number(coinsToPlay) : 0,
        startTime: formatTime(startTime),
        endTime: formatTime(endTime),
      });
      if(response.status === 201){
        toast.success(response?.data.message || 'Live quiz created!');
        setSelectedQuiz('');
        setAccessType('free');
        setCoinsToPlay('');
        setStartTime(null);
        setEndTime(null);
        fetchLiveQuizzes();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error creating live quiz');
    }
  };

  const handleStartQuiz = async (quizId) => {
    try {
      const response = await API.patch(`/admin/live-quiz/start/${quizId}`);
      if(response?.status === 200){
        toast.success(response.data?.message || 'Quiz Started');
        fetchLiveQuizzes();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error Starting Quiz');
    }
  };

  const handleEndQuiz = async (quizId) => {
    try {
      const response = await API.patch(`/admin/live-quiz/end/${quizId}`);
      if(response?.status === 200){
        toast.success(response.data?.message || 'Quiz Ended');
        fetchLiveQuizzes();
      }
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error ending quiz');
    }
  };

  return (
    <div className='adminPanel'>
      {user?.role === 'admin' && isAdminRoute && <Sidebar />}
      <div className="adminContent p-4 w-full text-gray-900 dark:text-white">
        <h2 className="text-xl font-bold mb-4">Live Quiz Management</h2>

        <form onSubmit={createLiveQuiz} className="mb-6 flex flex-wrap items-center gap-4">

          <select
            value={selectedQuiz}
            onChange={(e) => setSelectedQuiz(e.target.value)}
            className="border bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded flex-grow min-w-[100px]"
            required
          >
            <option value="">Select a quiz</option>
            {quizList.map((quiz) => (
              <option key={quiz._id} value={quiz._id}>
                {quiz.title}
              </option>
            ))}
          </select>

          <select
            value={accessType}
            onChange={(e) => setAccessType(e.target.value)}
            className="border bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded min-w-[100px]"
          >
            <option value="free">Free</option>
            <option value="pro">Pro</option>
          </select>

          {accessType === 'pro' && (
            <input
              type="number"
              placeholder="Coins to Play"
              value={coinsToPlay}
              onChange={(e) => setCoinsToPlay(e.target.value)}
              className="border bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded w-24"
              min={1}
              required
            />
          )}

          <DatePicker
            selected={startTime}
            onChange={setStartTime}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
            placeholderText="Start Time"
            className="border bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded w-28"
            required
          />

          <DatePicker
            selected={endTime}
            onChange={setEndTime}
            showTimeSelect
            showTimeSelectOnly
            timeIntervals={15}
            timeCaption="Time"
            dateFormat="h:mm aa"
            placeholderText="End Time"
            className="border bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded w-28"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded whitespace-nowrap"
          >
            Create Live Quiz
          </button>
        </form>


        <h3 className="text-lg font-semibold mb-2">Live Quizzes</h3>
        <ul className="space-y-3">
          {quizzes.map((quiz) => {
            let status = 'Not Started';
            if (quiz.status === "not_started") {
              status = 'Not Started';
            } else if (quiz.status === "started") {
              status = 'Live';
            } else if (quiz.status === "ended") {
              status = 'Ended';
            }

            return (
              <li
                key={quiz._id}
                className="border bg-gray-50 dark:bg-gray-800 p-4 rounded flex justify-between items-start"
              >
                <div>
                  <h4 className="font-semibold">{quiz.quiz?.title || 'Untitled'}</h4>
                  <p>Access: <span className={quiz.accessType === 'pro' ? 'text-red-600' : 'text-green-600'}>
                    {quiz.accessType === 'pro' ? 'Pro' : 'Free'}
                  </span></p>
                  <p>Status: <span className={
                    status === 'Not Started'
                      ? 'text-yellow-600'
                      : status === 'Live'
                        ? 'text-green-600'
                        : 'text-red-600'
                  }
                  >
                    {status}
                  </span></p>
                </div>
                <div className="flex flex-col gap-2">
                  {status === 'Not Started' && (
                    <button
                      onClick={() => handleStartQuiz(quiz._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Start
                    </button>
                  )}
                  {status === 'Live' && (
                    <button
                      onClick={() => handleEndQuiz(quiz._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                    >
                      End
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default LiveQuizPage;
