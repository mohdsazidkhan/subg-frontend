import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../utils/socket';

const LiveQuizPlay = () => {
  const { id } = useParams(); // liveQuizId
  const navigate = useNavigate();

  const [question, setQuestion] = useState(null);
  const [message, setMessage] = useState('');
  const [leaderboard, setLeaderboard] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [userScore, setUserScore] = useState(null);
  const [userCoins, setUserCoins] = useState(null);

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userInfo'));
    if (!storedUser) return navigate('/login');
    setUser(storedUser);

    // Setup socket auth and connect
    socket.auth = { token: localStorage.getItem('token') };

    if (!socket.connected) {
      socket.connect();
    }

    // Join the quiz room
    socket.emit('joinRoom', { quizId: id, userId: storedUser.id });

    // Handle incoming question
    socket.on('question', ({ question }) => {
      console.log(question, 'question')
      setQuestion(question);
      setMessage('');
    });

    // Handle quiz end
    socket.on('quizEnd', ({ message, leaderboard }) => {
      setMessage(message || 'Quiz ended!');
      setQuestion(null);
      setLeaderboard(leaderboard || []);

      // 🏆 Find current user rank
      const userRank = leaderboard.findIndex(entry => entry.name === storedUser.name); // or compare userId
      if (userRank !== -1) {
        setUserRank(userRank + 1); // rank is 1-based
        setUserScore(leaderboard[userRank].score);
        setUserCoins(leaderboard[userRank].coinsEarned);
      }

      socket.disconnect();
    });


    // Optional: Handle error messages
    socket.on('error', (err) => {
      console.error('Socket error:', err);
      setMessage(err?.message || 'An error occurred.');
    });

    // Cleanup on unmount
    return () => {
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
    setMessage('Answer submitted!');
  };

  return (
    <div className="p-4 w-full">
      <h2 className="text-xl font-bold mb-4">Live Quiz</h2>
      {userRank && (
        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded shadow">
          <h3 className="text-lg font-semibold mb-1">🏅 Your Result</h3>
          <p>Rank: <span className="font-bold">{userRank}</span></p>
          <p>Score: <span className="font-bold">{userScore}</span></p>
          <p>Coins Earned: <span className="font-bold">{userCoins}</span></p>
        </div>
      )}
      {question && (
        <div className="bg-white p-4 rounded shadow">
          <p className="font-semibold mb-2">{question.questionText}</p>
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => submitAnswer(opt)}
              className="block w-full mb-2 p-2 border rounded hover:bg-blue-100"
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {message && <p className="mt-4 text-green-600">{message}</p>}
      <ul className="bg-white p-4 rounded shadow">
        {leaderboard.map((entry, index) => {
          const isCurrentUser = entry.userId === user?.id; // or compare IDs if available
          return (
            <li
              key={index}
              className={`border-b py-2 flex justify-between ${isCurrentUser ? 'bg-yellow-100 font-semibold rounded' : ''
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
  );
};

export default LiveQuizPlay;
