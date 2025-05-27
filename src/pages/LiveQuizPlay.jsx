import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../utils/socket';
import { FaTrophy } from 'react-icons/fa';

const LiveQuizPlay = () => {
  const { id } = useParams(); // liveQuizId
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [message, setMessage] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userScore, setUserScore] = useState(null);
  const [userCoins, setUserCoins] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userInfo'));
    if (!storedUser) return navigate('/login');
    setUser(storedUser);

    socket.auth = { token: localStorage.getItem('token') };
    if (!socket.connected) socket.connect();

    socket.emit('joinRoom', { quizId: id, userId: storedUser.id });

    socket.on('question', ({ question }) => {
      setQuestion(question);
      setMessage(null);
    });

    socket.on('quizEnd', ({ message, leaderboard }) => {
      setMessage({ type: "error", message: message || 'Quiz ended!' });
      setQuestion(null);
      setLeaderboard(leaderboard || []);

      const userRank = leaderboard?.findIndex(entry => entry.name === storedUser.name);
      if (userRank !== -1) {
        setUserRank(userRank + 1);
        setUserScore(leaderboard[userRank]?.score);
        setUserCoins(leaderboard[userRank]?.coinsEarned);
      }

      socket.disconnect();
    });

    socket.on('alreadyAttempted', ({ message, leaderboard }) => {
      setMessage({ type: "error", message: message || 'You have already attempted this quiz!' });
      setQuestion(null);
      setLeaderboard(leaderboard || []);

      const userRank = leaderboard?.findIndex(entry => entry.name === storedUser.name);
      if (userRank !== -1) {
        setUserRank(userRank + 1);
        setUserScore(leaderboard[userRank]?.score);
        setUserCoins(leaderboard[userRank]?.coinsEarned);
      }

      socket.disconnect();
    });

    socket.on('error', (err) => {
      console.error('Socket error:', err);
      setMessage({ type: "error", message: err?.message || 'An error occurred.' });
    });

    return () => {
      socket.off('alreadyAttempted');
      socket.off('question');
      socket.off('quizEnd');
      socket.off('error');
      socket.disconnect();
    };
  }, [id, navigate]);

  const submitAnswer = (option) => {
    if (!question || !user) return;
    socket.emit('submitAnswer', {
      quizId: id,
      userId: user.id,
      questionId: question._id,
      answer: option,
    });
    setMessage({ type: "success", message: 'Answer Submitted!' });
  };

  return (
    <div className="p-4 w-full dark:bg-gray-900 min-h-screen dark:text-white">
      <h2 className="text-2xl font-bold mb-4">🚀 Live Quiz</h2>

      {question && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <p className="font-semibold mb-2">{question.questionText}</p>
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => submitAnswer(opt)}
              className="block w-full mb-2 p-2 border rounded hover:bg-blue-100 dark:hover:bg-blue-700"
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

      {userRank && (
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
          <ul className="bg-gray-100 dark:bg-gray-800 p-4 rounded shadow">
            {leaderboard.map((entry, index) => {
              const isCurrentUser = entry.userId === user?.id;
              return (
                <li
                  key={index}
                  className={`border-b p-2 flex justify-between items-center ${
                    isCurrentUser ? 'bg-green-600 text-white font-semibold' : ''
                  }`}
                >
                  <span>
                    {index + 1}. {entry.name}
                  </span>
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
