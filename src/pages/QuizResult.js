import { useEffect, useState } from "react";
import { FaTrophy } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const QuizResult = () => {
    const storedUser = JSON.parse(localStorage.getItem('userInfo'));
    const location = useLocation();
    const [quizResult, setQuizResult] = useState(null);
    console.log(quizResult, 'quizResult');
    useEffect(() => {
        if (location.state?.quizResult) {
            setQuizResult(location.state.quizResult); // ✅ Properly set quiz result
        }
    }, [location]);

    return (
        <div className="p-4 w-full dark:bg-gray-900 min-h-screen dark:text-white">
                {quizResult && (<h3 className="text-lg font-semibold mb-2">{quizResult?.liveQuiz?.quiz?.title}</h3>)}
                {quizResult && (
                <>
                    <h3 className="text-lg font-semibold mb-1">🏅 Your Result</h3>
                    <div className="mb-4 p-4 bg-blue-50 dark:bg-gray-800 border-l-4 border-blue-400 dark:border-blue-500 rounded shadow">
                        <p>Rank: <span className="font-bold">{quizResult?.rank}</span></p>
                        <p>Score: <span className="font-bold">{quizResult?.score}</span></p>
                        <p>Coins Earned: <span className="font-bold">{quizResult?.coinsEarned}</span></p>
                    </div>
                </>
            )}

            {quizResult?.leaderboard?.entries?.length > 0 && (
                <div className="mt-2 mb-2">
                    <h3 className="text-lg font-semibold flex items-center mb-2">
                        <FaTrophy className="text-yellow-400 mr-2" />
                        Leaderboard
                    </h3>
                    <div className=" overflow-x-scroll">
                    <table className="p-4 w-full bg-blue-50 dark:bg-gray-800 border-l-4 border-blue-400 dark:border-blue-500 rounded shadow">
                        <thead>
                            <tr>
                                <th align='left' className='px-2'>Rank</th>
                                <th align='left' className='px-2'>Name</th>
                                <th align='left' className='px-2'>Score</th>
                                <th align='left' className='px-2'>Coins Earned</th>
                            </tr>
                        </thead>
                        <tbody>
                            {quizResult?.leaderboard?.entries.map((entry, index) => {
                                const isCurrentUser = entry?.userId?._id === storedUser?._id;
                                return (
                                    <tr
                                        key={index}
                                        className={`${isCurrentUser ? 'bg-green-600 text-white font-semibold' : ''}`}
                                    >
                                        <td className="px-2">{entry.rank}</td>
                                        <td className="px-2">{entry.name}</td>
                                        <td className="px-2">{entry.score}</td>
                                        <td className="px-2">{entry.coinsEarned}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    </div>
                </div>
            )}
            {quizResult && (
                <>
                    <h3 className="text-lg font-semibold mb-1">💡 Questions & Answers</h3>
                    <div className="mt-4">
                        <ul>
                            {quizResult?.answers?.map((q, i) => {
                                const correctOption = q.questionId.options[q.questionId.correctAnswerIndex];
                                return (
                                    <li key={i} className="mb-4 p-3 border rounded bg-white dark:bg-gray-700">
                                        <p className="font-semibold mb-1">{i + 1}. {q?.questionId?.questionText}</p>
                                        <ul className="mb-2">
                                            {q?.questionId?.options.map((opt, idx) => {
                                                const isUserAnswer = opt === q.answer;
                                                const isCorrectAnswer = opt === correctOption;
                                                const isCorrect = isUserAnswer && isCorrectAnswer;

                                                return (
                                                    <li
                                                        key={idx}
                                                        className={`pl-3 py-1 rounded
                                                            ${isCorrectAnswer ? 'bg-green-300 font-bold' : ''}
                                                            ${isUserAnswer && !isCorrect ? 'bg-red-300 line-through' : ''}
                                                            ${isCorrect ? 'bg-green-400 font-bold' : ''}
                                                        `}
                                                    >
                                                        {idx+1}{". "}{opt}
                                                        {isUserAnswer && <span> ← Your answer</span>}
                                                        {isCorrectAnswer && !isUserAnswer && <span> ← Correct answer</span>}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                 </>
            )}

            
        </div>
    );
};

export default QuizResult;
