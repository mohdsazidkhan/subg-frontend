import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaClock, FaQuestionCircle, FaStar } from 'react-icons/fa';
import API from '../utils/api';
import socket from '../utils/socket'; // Make sure this is your socket instance
import { convertTo12Hour } from '../utils/index';
import { toast } from 'react-toastify';

// Countdown component for each quiz
const LiveQuizCountdown = ({ startTime, endTime, quizId, onStart, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [mode, setMode] = useState('beforeStart'); // 'beforeStart' or 'afterStart'

  useEffect(() => {
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    const now = new Date();
    let start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), startHour, startMinute, 0);
    let end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), endHour, endMinute, 0);

    // If quiz spans midnight (e.g., start 23:00, end 01:00 next day)
    if (end <= start) {
      end.setDate(end.getDate() + 1);
    }

    console.log('Current time:', now.toLocaleTimeString());
    console.log('Quiz start time:', start.toLocaleTimeString());
    console.log('Quiz end time:', end.toLocaleTimeString());

    const timer = setInterval(() => {
      const currentTime = new Date();

      if (mode === 'beforeStart') {
        const diff = start - currentTime;

        if (diff <= 0) {
          setMode('afterStart');
          setTimeLeft('0 Min 0 Sec');
          socket.emit('startQuiz', { quizId });
          onStart(quizId);
        } else {
          updateTimeLeft(diff);
        }
      } else if (mode === 'afterStart') {
        const diff = end - currentTime;

        if (diff <= 0) {
          clearInterval(timer);
          setTimeLeft('0 Min 0 Sec');
          onEnd?.(quizId);
        } else {
          updateTimeLeft(diff);
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime, quizId, onStart, onEnd, mode]);

  const updateTimeLeft = (diff) => {
    const totalSeconds = Math.floor(diff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    let formatted = '';
    if (hours > 0) formatted += `${hours} Hour${hours > 1 ? 's' : ''} `;
    if (minutes > 0 || hours > 0) formatted += `${minutes} Min${minutes > 1 ? 's' : ''} `;
    formatted += `${seconds} Sec${seconds > 1 ? 's' : ''}`;
    setTimeLeft(formatted.trim());
  };

  return (
    <span className="flex items-center gap-2">
      <span className="text-md text-white font-semibold">
        {mode === 'beforeStart' ? 'Quiz Will Start:' : 'Quiz Will End:'}
      </span>
      <span className="text-lg font-semibold text-yellow-300">{timeLeft}</span>
    </span>
  );
};

const LiveQuizPage = () => {
  const storedUser = JSON.parse(localStorage.getItem('userInfo'));

  const navigate = useNavigate();
  const [liveQuizzes, setLiveQuizzes] = useState([]);

  useEffect(() => {
    const fetchLiveQuizzes = async () => {
      try {
        const res = await API.get('/live-quizzes/active');
        setLiveQuizzes(res.data);
      } catch (err) {
        console.error('Failed to fetch quizzes:', err);
      }
    };

    fetchLiveQuizzes();
  }, []);

  const handleQuizStart = (quizId) => {
    setLiveQuizzes((prev) =>
      prev.map((q) => (q._id === quizId ? { ...q, status: 'started' } : q))
    );
    socket.auth = { token: localStorage.getItem('token') };
    if (!socket.connected) socket.connect();
    socket.emit('startQuiz', quizId);
  };

  const handleQuizEnd = (quizId) => {
    setLiveQuizzes((prev) =>
      prev.map((q) => (q._id === quizId ? { ...q, status: 'ended' } : q))
    );
    socket.auth = { token: localStorage.getItem('token') };
    if (!socket.connected) socket.connect();
    socket.emit('endQuiz', quizId);
  };

  const handlePayNow = async (quizId, orignalQuizId) => {
    const storedUser = JSON.parse(localStorage.getItem('userInfo'));
    if (!storedUser) return navigate('/login');

    try {
      const response = await API.post('/live-quizzes/join', { quizId });
      if (response.status === 200) {
        const updatedCoins = response.data.userCoins;
        const updatedbalance = response.data.userBalance;
        if (typeof updatedCoins === 'number') {
          const updatedUser = { ...storedUser, coins: updatedCoins, balance: updatedbalance };
          localStorage.setItem('userInfo', JSON.stringify(updatedUser));
        }

        if (response.data.payment) {
          navigate(`/student/live-quiz/${orignalQuizId}`);
        }
      }
    } catch (error) {
      console.log(error, 'error');
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="container mx-auto">
      <div className="p-4 min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white">
        <h2 className="text-2xl font-bold mb-6">🎮 Quizzes</h2>

        {liveQuizzes.length === 0 && (
          <span className="text-gray-500 dark:text-gray-400">No Quiz Found!</span>
        )}

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {liveQuizzes?.map((lq) => {
            const now = new Date();
            const currentMinutes = now.getHours() * 60 + now.getMinutes();

            const [startHours, startMinutes] = lq.startTime.split(':').map(Number);
            const [endHours, endMinutes] = lq.endTime.split(':').map(Number);

            const quizStartMinutes = startHours * 60 + startMinutes;
            const quizEndMinutes = endHours * 60 + endMinutes;

            // Determine if quiz has started
            const hasStarted = (lq.status === 'started' || currentMinutes >= quizStartMinutes);

            // Handle quiz spanning midnight
            let hasEnded;
            if (quizEndMinutes <= quizStartMinutes) {
              // Quiz spans midnight, so ended if NOT between start and end times
              hasEnded = !(currentMinutes >= quizStartMinutes || currentMinutes < quizEndMinutes);
            } else {
              hasEnded = currentMinutes >= quizEndMinutes;
            }
            hasEnded = hasEnded || (lq.status === 'ended');

            const isPro = lq.accessType === 'pro';
            const hasPaid = lq.paidUsers?.includes(storedUser?.publicId);
            const hasAttempted = lq.attemptedUsers?.includes(storedUser?.publicId);

            return (
              <div
                key={lq._id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow p-4 hover:shadow-lg transition duration-300"
              >
                <div className="flex gap-2 items-center">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-sm ${lq.status === 'not_started'
                      ? 'bg-gray-600 text-white'
                      : lq.status === 'started'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-300 text-gray-700 dark:bg-gray-600 dark:text-white'
                      }`}
                  >
                    {lq.status === 'not_started'
                      ? 'Not Started'
                      : lq.status === 'started'
                        ? 'LIVE'
                        : 'Ended'}
                  </span>

                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded-sm ${lq.accessType === 'free' ? 'bg-green-600' : 'bg-yellow-600'
                      } text-white`}
                  >
                    {lq.accessType === 'free' ? 'FREE' : 'PRO'}
                  </span>

                  <span className="px-2 py-1 text-xs font-semibold rounded-sm bg-orange-600 text-white">
                    {convertTo12Hour(lq.startTime)}
                  </span>
                  <span>to</span>
                  <span className="px-2 py-1 text-xs font-semibold rounded-sm bg-green-600 text-white">
                    {convertTo12Hour(lq.endTime)}
                  </span>
                </div>

                <h3 className="text-sm lg:text-md xl:text-lg font-semibold my-2">{lq.quiz?.title}</h3>

                <div className="flex gap-2 mb-2">
                  <span className="px-3 py-1 text-xs font-semibold rounded-sm bg-pink-200 dark:bg-pink-600 dark:text-white">
                    {lq.quiz?.category?.name}
                  </span>
                  <span className="px-3 py-1 text-xs font-semibold rounded-sm bg-blue-200 dark:bg-blue-600 dark:text-white">
                    {lq.quiz?.subcategory?.name}
                  </span>
                </div>

                <div className="flex gap-4 mb-2 text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <FaQuestionCircle className="text-blue-600" />
                    <span>{lq.quiz?.totalQuestions} Questions</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaClock className="text-green-600" />
                    <span>{lq.quiz?.timeLimit} Mins</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    <span>{lq.quiz?.totalMarks} Marks</span>
                  </div>
                </div>

                <div className="flex justify-between items-center gap-4">
                 <div className="flex justify-between items-center gap-4">
  {hasAttempted ? (
    <Link
      to={`/student/live-quiz/${lq.quiz?._id}`}
      className="inline-block bg-green-600 text-white text-sm lg:text-md xl:text-lg px-2 py-1 rounded hover:bg-green-700 dark:hover:bg-green-500"
    >
      View Result
    </Link>
  ) : hasEnded ? (
    <button
      disabled
      className="inline-block bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed"
      title="Quiz ended - You did not attempt"
    >
      Quiz Ended
    </button>
  ) : hasStarted ? (
    isPro && !hasPaid ? (
      <button
        onClick={() => handlePayNow(lq._id, lq.quiz._id)}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-500"
      >
        Pay with {lq.coinsToPlay} Coins
      </button>
    ) : (
      <Link
        to={`/student/live-quiz/${lq.quiz?._id}`}
        className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:hover:bg-blue-500"
      >
        Play Now
      </Link>
    )
  ) : (
    <LiveQuizCountdown
      startTime={lq.startTime}
      endTime={lq.endTime}
      quizId={lq._id}
      onStart={handleQuizStart}
      onEnd={handleQuizEnd}
    />
  )}
</div>

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LiveQuizPage;
