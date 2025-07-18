import { useEffect, useState } from "react";
import {
  FaTrophy,
  FaCheckCircle,
  FaTimesCircle,
  FaCrown,
  FaBrain,
  FaAward,
  FaArrowLeft,
  FaQuestionCircle,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../utils/api";

const LeaderboardTable = ({ leaderboard, currentUser }) => {
  if (!leaderboard || leaderboard?.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-2 md:p-8 border border-purple-200 dark:border-purple-700">
          <FaTrophy className="text-4xl text-purple-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No Leaderboard Yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Be the first to complete this quiz and claim the top spot!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
          <FaTrophy className="text-white text-xl" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Leaderboard</h3>
      </div>
      
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[30rem]">
            <thead className="bg-gradient-to-r from-purple-500 to-pink-500">
              <tr>
                <th className="py-2 md:py-4 px-2 md:px-6 text-white font-semibold text-center">Rank</th>
                <th className="py-2 md:py-4 px-2 md:px-6 text-white font-semibold text-left">Student</th>
                <th className="py-2 md:py-4 px-2 md:px-6 text-white font-semibold text-center">Score</th>
                <th className="py-2 md:py-4 px-2 md:px-6 text-white font-semibold text-center">Attempted At</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard?.map(({ rank, studentName, studentId, score, attemptedAt }, index) => {
                const isCurrentUser = studentId === currentUser?.id;
                const isTopThree = rank <= 3;
                
                return (
                  <tr
                    key={rank}
                    className={`transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
                      isCurrentUser ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border-l-4 border-blue-500' : ''
                    }`}
                  >
                    <td className="py-2 md:py-4 px-2 md:px-6 text-center">
                      <div className="flex items-center justify-center">
                        {isTopThree ? (
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                            rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                            rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                            'bg-gradient-to-r from-amber-600 to-yellow-600'
                          }`}>
                            {rank === 1 ? <FaCrown className="text-sm" /> : rank}
                          </div>
                        ) : (
                          <span className="text-gray-600 dark:text-gray-400 font-medium">{rank}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 md:py-4 px-2 md:px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {studentName?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-800 dark:text-white">
                            {studentName || 'Anonymous'}
                          </div>
                          {isCurrentUser && (
                            <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                              You
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-2 md:py-4 px-2 md:px-6 text-center">
                      <div className="flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-800 dark:text-white">
                          {score || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2 md:py-4 px-2 md:px-6 text-center text-sm text-gray-500 dark:text-gray-400">
                      {(() => {
                        try {
                          const date = new Date(attemptedAt);
                          if (isNaN(date.getTime())) {
                            return 'N/A';
                          }
                          return date.toLocaleString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          });
                        } catch (error) {
                          return 'N/A';
                        }
                      })()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const QuizResult = () => {
  const currentUser = JSON.parse(localStorage.getItem("userInfo"));
  const location = useLocation();
  const navigate = useNavigate();
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
console.log(quiz,"quizResult");
  useEffect(() => {
    async function fetchResult() {
      let quizId = null;
      
      if (location.state?.quizResult) {
        const actualQuizId = location.state?.quizResult?.quiz?._id || quizId;
        const quizRes = await API.getQuizById(actualQuizId);
        setQuiz(quizRes);
         // Initialize answers array
        setAnswers(location.state.quizResult.answers);
        setQuizResult(location.state.quizResult);
        const leaderboardRes = await API.getQuizLeaderboard(actualQuizId);
        setLeaderboard(leaderboardRes.leaderboard || []);
        setLoading(false);
        return;
      }
      // Try to get quizId from state or query param
      if (location.state?.quizId) {
        quizId = location.state.quizId;
      } else {
        const params = new URLSearchParams(window.location.search);
        quizId = params.get("quizId");
      }
      if (quizId) {
        setLoading(true);
        setError("");
        try {
          const res = await API.getQuizResult(quizId);
          if (res.success) {
            setQuizResult(res.data);
          } else {
            setError("No quiz result found");
          }
        } catch (err) {
          setError("No quiz result found");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    fetchResult();
  }, [location]);

  const getScoreColor = (percentage) => {
    if (percentage >= 75) return "text-blue-500";
    if (percentage >= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreEmoji = (percentage) => {
    if (percentage >= 75) return "🥇";
    if (percentage >= 50) return "🥈";
    return "🥉";
  };

  const getScoreMessage = (percentage) => {
    if (percentage >= 75) return "Excellent! Great job!";
    if (percentage >= 50) return "Good effort! Keep practicing!";
    return "Keep learning and try again!";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Loading quiz result...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-4xl mb-4">⚠️</div>
          <p className="text-red-600 text-xl">{error}</p>
          <button
            onClick={() => navigate("/profile")}
            className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8 mt-16">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">
            {getScoreEmoji(quizResult?.scorePercentage)}
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Quiz Result
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            {getScoreMessage(quizResult?.scorePercentage)}
          </p>
        </div>

        {/* Main Result Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl px-2 py-4 md:p-8 border border-white/20 max-w-4xl mx-auto mb-8">
          {/* Quiz Title */}
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-2">
              {quizResult?.quizTitle || "Quiz Result"}
            </h2>
            {quizResult?.categoryName && (
              <p className="text-gray-600 dark:text-gray-400">
                Category: {quizResult.categoryName}
                {quizResult?.subcategoryName &&
                  ` • ${quizResult.subcategoryName}`}
              </p>
            )}
          </div>

          {/* Score Display */}
          <div className="text-center mb-8">
            <div
              className={`text-4xl md:text-6xl font-bold mb-4 ${getScoreColor(
                quizResult?.scorePercentage
              )}`}
            >
              {quizResult?.scorePercentage}%
            </div>

            <div className="text-2xl text-gray-700 dark:text-gray-300 mb-2">
              Total Questions: {quizResult?.answers?.length}
            </div>

            <div className="text-2xl text-gray-700 dark:text-gray-300 mb-2">
              Correct Answers: {quizResult?.score} 
            </div>

            <div className="text-lg text-gray-600 dark:text-gray-400">
              Attempted on{" "}
              {new Date(quizResult?.attemptedAt).toLocaleDateString()}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-6 border border-blue-200 dark:border-blue-700 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FaCheckCircle className="text-white text-xl" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {quizResult?.score}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Correct Answers
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 rounded-2xl p-6 border border-green-200 dark:border-green-700 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FaBrain className="text-white text-xl" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {quizResult?.scorePercentage}%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Accuracy
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl p-6 border border-orange-200 dark:border-orange-700 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FaAward className="text-white text-xl" />
              </div>
              <div className="text-2xl font-bold text-gray-800 dark:text-white">
                {quizResult?.isHighScore ? "High Score" : "Standard"}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300">
                Performance
              </div>
            </div>
          </div>

          {/* High Score Status */}
          {quizResult?.scorePercentage !== undefined && (
            <div
              className={`text-center p-2 md:p-4 rounded-lg ${
                quizResult.scorePercentage >= 75
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                  : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
              }`}
            >
              <div
                className={`text-xl md:text-2xl font-bold ${
                  quizResult.scorePercentage >= 75
                    ? "text-green-800 dark:text-green-200"
                    : "text-yellow-800 dark:text-yellow-200"
                }`}
              >
                {quizResult.scorePercentage >= 75
                  ? "🎉 High Score Achievement!"
                  : "💪 Good Effort!"}
              </div>
              <div
                className={`text-sm ${
                  quizResult.scorePercentage >= 75
                    ? "text-green-700 dark:text-green-300"
                    : "text-yellow-700 dark:text-yellow-300"
                }`}
              >
                {quizResult.scorePercentage >= 75
                  ? "This score counts towards your level progression!"
                  : "Need 75% or higher to count towards level progression. Keep practicing!"}
              </div>
            </div>
          )}
        </div>

        {/* Quiz Review Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-2xl p-2 md:p-8 border border-white/20 mb-8">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <FaBrain className="text-white text-2xl" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
              Quiz Review
            </h2>
          </div>

          <div className="space-y-6">
            {quiz.questions.map((question, index) => {
              const userAnswer = answers[index]?.answer;
              const correctAnswer = question.options[question.correctAnswerIndex];
              console.log(userAnswer,correctAnswer,'correctAnswer');
              const isCorrect = userAnswer === correctAnswer;
              const isSkipped = userAnswer === "SKIP";
              return (
                <div
                  key={index}
                  className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-700 dark:to-gray-800 rounded-2xl p-2 md:p-6 border border-gray-200 dark:border-gray-600 shadow-lg"
                >
                  <div className="flex items-start space-x-0 md:space-x-4 mb-6">
                    <div
                      className={`hidden md:flex w-12 h-12 rounded-2xl items-center justify-center text-white text-lg font-bold shadow-lg ${
                        isSkipped
                          ? "bg-gradient-to-r from-gray-400 to-gray-500"
                          : isCorrect
                          ? "bg-gradient-to-r from-green-400 to-green-500"
                          : "bg-gradient-to-r from-red-400 to-red-500"
                      }`}
                    >
                      {isSkipped ? (
                        <FaQuestionCircle />
                      ) : isCorrect ? (
                        <FaCheck />
                      ) : (
                        <FaTimes />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
                        {index + 1}: {question.questionText}
                      </h3>

                      <div className="space-y-3 mb-6">
                        {question.options.map((option, optIndex) => {
                          const isUserChoice = option === userAnswer;
                          const isCorrectOption = option === correctAnswer;
                          const optionLetter = String.fromCharCode(
                            65 + optIndex
                          );

                          return (
                            <div
                              key={optIndex}
                              className={`p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                                isCorrectOption
                                  ? "bg-gradient-to-r from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/30 border-green-300 dark:border-green-600 shadow-lg"
                                  : isUserChoice && !isCorrectOption
                                  ? "bg-gradient-to-r from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/30 border-red-300 dark:border-red-600 shadow-lg"
                                  : "bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-500 hover:border-purple-300 dark:hover:border-purple-500"
                              }`}
                            >
                              <div className="flex items-center space-x-4">
                                <div
                                  className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                    isCorrectOption
                                      ? "bg-gradient-to-r from-green-500 to-green-600"
                                      : isUserChoice && !isCorrectOption
                                      ? "bg-gradient-to-r from-red-500 to-red-600"
                                      : "bg-gradient-to-r from-gray-400 to-gray-500"
                                  }`}
                                >
                                  {optionLetter}
                                </div>
                                <span
                                  className={`font-medium text-lg ${
                                    isCorrectOption
                                      ? "text-green-800 dark:text-green-200"
                                      : isUserChoice && !isCorrectOption
                                      ? "text-red-800 dark:text-red-200"
                                      : "text-gray-700 dark:text-gray-300"
                                  }`}
                                >
                                  {option}
                                </span>
                                {isCorrectOption && (
                                  <FaCheckCircle className="text-green-600 text-xl" />
                                )}
                                {isUserChoice && !isCorrectOption && (
                                  <FaTimesCircle className="text-red-600 text-xl" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Answer Summary */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-600">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-600 dark:text-gray-400">
                              Your Answer:
                            </span>
                            <span
                              className={`font-medium ${
                                isSkipped
                                  ? "text-gray-500"
                                  : isCorrect
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {isSkipped
                                ? "Skipped"
                                : userAnswer || "Not answered"}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-600 dark:text-gray-400">
                              Correct Answer:
                            </span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                              {correctAnswer}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-semibold text-gray-600 dark:text-gray-400">
                              Status:
                            </span>
                            <span
                              className={`font-medium ${
                                isSkipped
                                  ? "text-gray-500"
                                  : isCorrect
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-red-600 dark:text-red-400"
                              }`}
                            >
                              {isSkipped
                                ? "Skipped"
                                : isCorrect
                                ? "Correct"
                                : "Incorrect"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <LeaderboardTable leaderboard={leaderboard} currentUser={currentUser} />

        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
            >
              Take Another Quiz
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105"
            >
              View Profile
            </button>
            <button
              onClick={() => navigate(-1)}
              className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300 transform hover:scale-105"
            >
              <FaArrowLeft className="inline mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResult;
