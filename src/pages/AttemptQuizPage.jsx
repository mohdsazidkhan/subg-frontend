import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../utils/api';

const LeaderboardTable = ({ leaderboard, currentUser  }) => {
  if (!leaderboard || leaderboard?.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">No leaderboard data yet.</div>
    );
  }

  return (
    <div className="overflow-x-auto mt-8">
      <h3 className="text-xl font-semibold mb-4">Leaderboard</h3>
      <table className="min-w-full border border-gray-300 rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-2 px-4 border-b text-center">Rank</th>
            <th className="py-2 px-4 border-b text-left">Student</th>
            <th className="py-2 px-4 border-b text-center">Score</th>
            <th className="py-2 px-4 border-b text-center">Attempted At</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard?.map(({ rank, studentName, studentId, score, attemptedAt }) => {
            console.log(currentUser,studentId,'studentId')
            const isCurrentUser = studentId === currentUser?.id;
          return (
            <tr key={rank} style={{background: isCurrentUser ? "black" : "transparent"}} className={`odd:bg-white even:bg-gray-50 ${
                  isCurrentUser ? 'font-bold text-white' : ''
                }`}>
              <td className="py-2 px-4 text-center">{rank}</td>
              <td className="py-2 px-4">{studentName}</td>
              <td className="py-2 px-4 text-center">{score}</td>
              <td className="py-2 px-4 text-center">{new Date(attemptedAt).toLocaleString()}</td>
            </tr>
          )
        }
          )}
        </tbody>
      </table>
    </div>
  );
};

const AttemptQuizPage = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
const currentUser = JSON.parse(localStorage.getItem('userInfo'));
  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await API.get(`/student/quizzes/${quizId}`);
      setQuiz({ title: res.data.title, questions: res.data.questions }); 
      setAnswers(Array(res.data.questions.length).fill(null));
    };

    fetchQuestions();
  }, [quizId]);

  const handleSelect = (qIndex, option) => {
    const updated = [...answers];
    updated[qIndex] = option;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    try{

      const res = await API.post(`/student/quizzes/${quizId}/attempt`, { answers });
       setResult(res.data);
      setSubmitted(true);
    }catch(error){
      alert(error.response.data.message, 'error')
    }
   

    // Fetch leaderboard after submitting quiz
    const leaderboardRes = await API.get(`/student/${quizId}/leaderboard`);
    setLeaderboard(leaderboardRes.data.leaderboard);
  };

  if (!quiz) return <div className="p-4">Loading quiz...</div>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      {quiz.questions.length === 0 && (
        <div className="p-4 text-red-500">No questions available for this quiz.</div>
      )}
      <h2 className="text-2xl font-bold mb-4">{quiz?.title}</h2>

      {submitted ? (
        <>
          <div className="text-center text-xl">
            <p className="mb-2">🎉 You scored {result?.score} out of {result?.total}</p>
          </div>
          <LeaderboardTable leaderboard={leaderboard} currentUser={currentUser}/>
        </>
      ) : (
        <div className="space-y-6">
          {quiz.questions.map((q, i) => (
            <div key={q._id} className="border p-4 rounded shadow">
              <p className="font-semibold mb-2">{i + 1}. {q.questionText}</p>
              <div className="space-y-1">
                {q.options.map((opt, j) => (
                  <div key={j} className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${i}`}
                      value={opt}
                      checked={answers[i] === opt}
                      onChange={() => handleSelect(i, opt)}
                      className="mr-2"
                    />
                    <label>{opt}</label>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <button
            onClick={handleSubmit}
            disabled={answers.includes(null)}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Submit Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default AttemptQuizPage;
