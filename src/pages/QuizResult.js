import { useEffect, useState } from "react";
import { FaTrophy, FaMedal, FaStar, FaCheckCircle, FaTimesCircle, FaCrown, FaRocket, FaBrain, FaAward, FaArrowLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import API from '../utils/api';

const QuizResult = () => {
    const storedUser = JSON.parse(localStorage.getItem('userInfo'));
    const location = useLocation();
    const navigate = useNavigate();
    const [quizResult, setQuizResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        async function fetchResult() {
            let quizId = null;
            console.log(location.state.quizResult, 'quizResult')

            if (location.state?.quizResult) {
                setQuizResult(location.state.quizResult);
                setLoading(false);
                return;
            }
            // Try to get quizId from state or query param
            if (location.state?.quizId) {
                quizId = location.state.quizId;
            } else {
                const params = new URLSearchParams(window.location.search);
                quizId = params.get('quizId');
            }
            if (quizId) {
                setLoading(true);
                setError('');
                try {
                    const res = await API.getQuizResult(quizId);
                    if (res.success) {
                        setQuizResult(res.data);
                    } else {
                        setError('No quiz result found');
                    }
                } catch (err) {
                    setError('No quiz result found');
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
        if (percentage >= 75) return 'text-blue-500';
        if (percentage >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    const getScoreEmoji = (percentage) => {
        if (percentage >= 75) return '🥇';
        if (percentage >= 50) return '🥈';
        return '🥉';
    };

    const getScoreMessage = (percentage) => {
        if (percentage >= 75) return 'Excellent! Great job!';
        if (percentage >= 50) return 'Good effort! Keep practicing!';
        return 'Keep learning and try again!';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600 dark:text-gray-300">Loading quiz result...</p>
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
                        onClick={() => navigate('/profile')}
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
                    <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        Quiz Result
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        {getScoreMessage(quizResult?.scorePercentage)}
                    </p>
                </div>

                {/* Main Result Card */}
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20 max-w-4xl mx-auto mb-8">
                    
                    {/* Quiz Title */}
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                            {quizResult?.quizTitle || 'Quiz Result'}
                        </h2>
                        {quizResult?.categoryName && (
                            <p className="text-gray-600 dark:text-gray-400">
                                Category: {quizResult.categoryName}
                                {quizResult?.subcategoryName && ` • ${quizResult.subcategoryName}`}
                            </p>
                        )}
                    </div>

                    {/* Score Display */}
                    <div className="text-center mb-8">
                        <div className={`text-6xl font-bold mb-4 ${getScoreColor(quizResult?.scorePercentage)}`}>
                            {quizResult?.scorePercentage}%
                        </div>
                        <div className="text-2xl text-gray-700 dark:text-gray-300 mb-2">
                            {quizResult?.score} correct answers
                        </div>
                        <div className="text-lg text-gray-600 dark:text-gray-400">
                            Attempted on {new Date(quizResult?.attemptedAt).toLocaleDateString()}
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
                            <div className="text-sm text-gray-600 dark:text-gray-300">Correct Answers</div>
                        </div>

                        <div className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 rounded-2xl p-6 border border-green-200 dark:border-green-700 text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <FaBrain className="text-white text-xl" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                {quizResult?.scorePercentage}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Accuracy</div>
                        </div>

                        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl p-6 border border-orange-200 dark:border-orange-700 text-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                                <FaAward className="text-white text-xl" />
                            </div>
                            <div className="text-2xl font-bold text-gray-800 dark:text-white">
                                {quizResult?.isHighScore ? 'High Score' : 'Standard'}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Performance</div>
                        </div>
                    </div>

                    {/* High Score Status */}
                    {quizResult?.scorePercentage !== undefined && (
                        <div className={`text-center p-4 rounded-lg ${
                            quizResult.scorePercentage >= 75
                                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
                        }`}>
                            <div className={`text-2xl font-bold ${
                                quizResult.scorePercentage >= 75
                                    ? 'text-green-800 dark:text-green-200'
                                    : 'text-yellow-800 dark:text-yellow-200'
                            }`}>
                                {quizResult.scorePercentage >= 75 ? (
                                    '🎉 High Score Achievement!'
                                ) : (
                                    '💪 Good Effort!'
                                )}
                            </div>
                            <div className={`text-sm ${
                                quizResult.scorePercentage >= 75
                                    ? 'text-green-700 dark:text-green-300'
                                    : 'text-yellow-700 dark:text-yellow-300'
                            }`}>
                                {quizResult.scorePercentage >= 75
                                    ? 'This score counts towards your level progression!'
                                    : 'Need 75% or higher to count towards level progression. Keep practicing!'
                                }
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="text-center">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/')}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105"
                        >
                            Take Another Quiz
                        </button>
                        <button
                            onClick={() => navigate('/profile')}
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
