import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../utils/socket';
import { FaTrophy } from 'react-icons/fa';

// Simple spinner component
const Spinner = () => (
  <div className="flex justify-center items-center my-8">
    <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
  </div>
);

const LiveQuizPlay = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [message, setMessage] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [userCoins, setUserCoins] = useState(0);
  const [user, setUser] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingNext, setLoadingNext] = useState(false); // new state for loading spinner

  const timerRef = useRef(null);
  const currentQuestionRef = useRef(null);
  const TIME_UP_SOUND_URL = '/time-up.mp3';
  // Audio ref for sound
  const audioRef = useRef(new Audio(TIME_UP_SOUND_URL));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const autoSubmitBlankAnswer = () => {
    const storedUser = JSON.parse(localStorage.getItem('userInfo'));
    const q = currentQuestionRef.current;
    console.log(q,storedUser,isSubmitting,'autoSubmitBlankAnswer')
    if (!storedUser || !q || isSubmitting) return;
    setIsSubmitting(true);
    setLoadingNext(true);
    socket.emit('submitAnswer', {
      quizId: id,
      userId: storedUser.id,
      questionId: q._id,
      answer: '',
    });
    setMessage({ type: "error", message: "⏰ Time's up! Answer auto-submitted." });
  };

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userInfo'));
    if (!storedUser) return navigate('/login');
    setUser(storedUser);

    socket.auth = { token: localStorage.getItem('token') };
    if (!socket.connected) socket.connect();

    socket.emit('joinRoom', { quizId: id, userId: storedUser.id });

    socket.on('question', ({ question }) => {
      setLoadingNext(false); // stop loading spinner
      setQuestion(question);
      currentQuestionRef.current = question;
      setMessage(null);
      setTimer(question.timeLimit || 30);
      setIsSubmitting(false);

      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            playTimeUpSound();
            autoSubmitBlankAnswer();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    });

    socket.on('quizEnd', ({ message, leaderboard }) => {
      console.log(message,leaderboard,'quizEnd')
      cleanupSocket();
      setLoadingNext(false);
      setMessage({ type: "error", message: message || 'Quiz ended!' });
      setQuestion(null);
      setLeaderboard(leaderboard || []);
      updateUserResult(storedUser, leaderboard);
    });

    socket.on('alreadyAttempted', ({ message, leaderboard }) => {
      cleanupSocket();
      setLoadingNext(false);
      setMessage({ type: "error", message: message || 'You have already attempted this quiz!' });
      setQuestion(null);
      setLeaderboard(leaderboard || []);
      updateUserResult(storedUser, leaderboard);
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err);
      setMessage({ type: "error", message: err?.message || 'An error occurred.' });
    });

    return () => {
      cleanupSocket();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const cleanupSocket = () => {
    socket.off('alreadyAttempted');
    socket.off('question');
    socket.off('quizEnd');
    socket.off('error');
    socket.disconnect();
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const updateUserResult = (user, leaderboard) => {
    if(leaderboard){
    const userRank = leaderboard?.findIndex(entry => entry.name === user.name);
      if (userRank !== -1) {
        setUserRank(userRank + 1);
        setUserScore(leaderboard[userRank]?.score);
        setUserCoins(leaderboard[userRank]?.coinsEarned);
      }
    }
  };

  const submitAnswer = (option) => {
    if (!question || !user || isSubmitting) return;
    setIsSubmitting(true);
    setLoadingNext(true); // show spinner after answer submit
    socket.emit('submitAnswer', {
      quizId: id,
      userId: user.id,
      questionId: question._id,
      answer: option,
    });
    setMessage({ type: "success", message: 'Answer Submitted!' });
    clearInterval(timerRef.current);
  };

  

const playTimeUpSound = () => {
  if (audioRef.current) {
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // silently catch errors if audio cannot play
    });
  }
};


  return (
    <div className="p-4 w-full dark:bg-gray-900 min-h-screen dark:text-white">
      <h2 className="text-2xl font-bold mb-4">🚀 Live Quiz</h2>

      {loadingNext && <Spinner />}

      {!loadingNext && question && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold">{question.questionText}</p>
            <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">
              ⏱ {timer}s
            </span>
          </div>
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => submitAnswer(opt)}
              className="block w-full mb-2 p-2 border rounded hover:bg-blue-100 dark:hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {message !== null && (
        <p className={`my-4 font-medium ${message.type === "success" ? 'text-green-500' : 'text-red-500'}`}>
          {message.message}
        </p>
      )}

      {userRank > 0 && (
        <>
          <h3 className="text-lg font-semibold mb-1">🏅 Your Result</h3>
          <div className="mb-6 p-4 bg-blue-50 dark:bg-gray-800 border-l-4 border-blue-400 dark:border-blue-500 rounded shadow">
            <p>Rank: <span className="font-bold">{userRank}</span></p>
            <p>Score: <span className="font-bold">{userScore}</span></p>
            <p>Coins Earned: <span className="font-bold">{userCoins}</span></p>
          </div>
        </>
      )}

      {leaderboard?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold flex items-center mb-2">
            <FaTrophy className="text-yellow-400 mr-2" />
            Leaderboard
          </h3>
          <ul className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow max-h-64 overflow-auto">
            {leaderboard.map((entry, index) => {
              const isCurrentUser = entry.userId === user?.id;
              return (
                <li
                  key={index}
                  className={`border-b p-2 flex justify-between items-center ${isCurrentUser ? 'bg-green-600 text-white font-semibold' : ''
                    }`}
                >
                  <span>{index + 1}. {entry.name}</span>
                  <span className="font-bold">{entry.score}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LiveQuizPlay;
