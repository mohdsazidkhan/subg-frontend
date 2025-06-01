import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import socket from '../utils/socket';
import { FaTrophy } from 'react-icons/fa';

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
  const [loadingNext, setLoadingNext] = useState(false);

  const [quizResults, setQuizResults] = useState(null);

  const timerRef = useRef(null);
  const currentQuestionRef = useRef(null);
  const audioRef = useRef(new Audio('/time-up.mp3'));

  useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem('userInfo'));
  if (!storedUser) return navigate('/login');
  setUser(storedUser);

  // ✅ Set auth and connect
  socket.auth = { token: localStorage.getItem('token') };
  if (!socket.connected) socket.connect();

  // ✅ Prevent duplicate listeners
  socket.off('question');
  socket.off('quizEnd');
  socket.off('alreadyAttempted');
  socket.off('error');

  // ✅ Join the quiz room
  socket.emit('joinRoom', { quizId: id, userId: storedUser.publicId });

  socket.on('question', ({ question }) => {
    setLoadingNext(false);
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

  socket.on('quizEnd', (data) => {
    cleanupSocket(false);
    setLoadingNext(false);
    setMessage({ type: "error", message: data.message || 'Quiz ended!' });
    setQuestion(null);
    setLeaderboard(data.leaderboard || []);
    updateUserResult(storedUser, data.leaderboard);

    if (data.totalQuestions !== undefined) {
      setQuizResults({
        totalQuestions: data.totalQuestions,
        correctAnswers: data.correctAnswers,
        wrongAnswers: data.wrongAnswers,
        coinsEarned: data.coinsEarned,
        questionBreakdown: data.questionBreakdown
      });
    }
  });

  socket.on('alreadyAttempted', ({ message, leaderboard }) => {
    cleanupSocket(false);
    setLoadingNext(false);
    setMessage({ type: "error", message: message || 'You have already attempted this quiz!' });
    setQuestion(null);
    setLeaderboard(leaderboard || []);
    updateUserResult(storedUser, leaderboard);
  });

  socket.on('error', (err) => {
    console.error('Socket error:', err);
    setMessage({ type: "error", message: err?.message || 'An error occurred.' });
    setLoadingNext(false);
  });

  return () => {
    cleanupSocket(true);
  };
}, [id, navigate]);


  // cleanupSocket now has a param to decide whether to disconnect socket or just off listeners
  const cleanupSocket = (disconnect = true) => {
    socket.off('alreadyAttempted');
    socket.off('question');
    socket.off('quizEnd');
    socket.off('error');
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (disconnect && socket.connected) {
      socket.disconnect();
    }
  };

  const updateUserResult = (user, leaderboard) => {
    if (leaderboard && user) {
      const userRankIndex = leaderboard.findIndex(entry => entry.userId === user.publicId);
      if (userRankIndex !== -1) {
        setUserRank(userRankIndex + 1);
        setUserScore(leaderboard[userRankIndex]?.score);
        setUserCoins(leaderboard[userRankIndex]?.coinsEarned);
      }
    }
  };

  const submitAnswer = (option) => {
    if (!question || !user || isSubmitting) return;
    setIsSubmitting(true);
    setLoadingNext(true);
    socket.emit('submitAnswer', {
      quizId: id,
      userId: user.publicId,
      questionId: question._id,
      answer: option,
    });
    setMessage({ type: "success", message: 'Answer Submitted!' });
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const playTimeUpSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  };

  // Auto-submit blank answer when time is up
  const autoSubmitBlankAnswer = () => {
    const storedUser = JSON.parse(localStorage.getItem('userInfo'));
    const q = currentQuestionRef.current;
    if (!storedUser || !q || isSubmitting) return;
    setIsSubmitting(true);
    setLoadingNext(true);
    socket.emit('submitAnswer', {
      quizId: id,
      userId: storedUser.publicId,  // fixed here
      questionId: q._id,
      answer: '',
    });
    setMessage({ type: "error", message: "⏰ Time's up! Answer auto-submitted." });
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

      {quizResults && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-gray-800 border-l-4 border-blue-400 dark:border-blue-500 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">🏅 Your Quiz Results</h3>
          <p>Total Questions: <strong>{quizResults.totalQuestions}</strong></p>
          <p>Correct Answers: <strong>{quizResults.correctAnswers}</strong></p>
          <p>Wrong Answers: <strong>{quizResults.wrongAnswers}</strong></p>
          <p>Coins Earned: <strong>{quizResults.coinsEarned}</strong></p>

          <div className="mt-4">
            <h4 className="font-semibold mb-2">Question Breakdown:</h4>
            <ul>
              {quizResults.questionBreakdown.map((q, i) => (
                <li key={i} className="mb-4 p-3 border rounded bg-white dark:bg-gray-700">
                  <p className="font-semibold mb-1">{i + 1}. {q.questionText}</p>
                  <ul className="mb-2">
                    {q.options.map((opt, idx) => {
                      const isUserAnswer = opt === q.userAnswer;
                      const isCorrectAnswer = opt === q.correctAnswer;
                      return (
                        <li
                          key={idx}
                          className={`pl-3 py-1 rounded
                            ${isCorrectAnswer ? 'bg-green-300 font-bold' : ''}
                            ${isUserAnswer && !q.isCorrect ? 'bg-red-300 line-through' : ''}
                            ${isUserAnswer && q.isCorrect ? 'bg-green-400 font-bold' : ''}
                          `}
                        >
                          {opt}
                          {isUserAnswer && <span> ← Your answer</span>}
                          {isCorrectAnswer && !q.isCorrect && <span> ← Correct answer</span>}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {userRank > 0 && !quizResults && (
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
          <table className="w-full bg-gray-100 dark:bg-gray-800 p-4 rounded shadow max-h-64 overflow-auto">
            <thead>
            <tr>
              <th align='left' className=' px-2'>Rank</th>
              <th align='left' className=' px-2'>Name</th>
              <th align='left' className=' px-2'>Score</th>
              <th align='left' className=' px-2'>Coins Earned</th>
            </tr>
            </thead>
            <tbody>
            {leaderboard?.map((entry, index) => {
              const isCurrentUser = entry.userId === user?.publicId;
              return (
                <tr
                  key={index}
                  className={`${isCurrentUser ? 'bg-green-600 text-white font-semibold' : ''
                    }`}
                >

                  <td align='left' className="font-bold px-2">{index + 1}</td>
                  <td align='left' className="font-bold px-2">{entry.name}</td>
                  <td align='left' className="font-bold px-2">{entry.score}</td>
                  <td align='left' className="font-bold px-2">{entry.coinsEarned}</td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LiveQuizPlay;
