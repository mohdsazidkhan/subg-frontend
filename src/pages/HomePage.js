import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrophy, FaCrown, FaStar, FaMedal, FaRocket, FaBrain, FaChartLine, FaAward, FaGem, FaBook, FaTags, FaFlask, FaLaptopCode, FaGlobe, FaCalculator, FaPalette, FaLeaf, FaUserGraduate, FaLayerGroup, FaClock, FaQuestionCircle } from 'react-icons/fa';
import API from '../utils/api';
import { toast } from 'react-toastify';
import { getCurrentUser } from '../utils/authUtils';
import { hasActiveSubscription, useTheme } from '../utils/subscriptionUtils';
import SubscriptionGuard from '../components/SubscriptionGuard';

// Icon mapping for categories
const categoryIcons = {
  Science: FaFlask,
  Technology: FaLaptopCode,
  Geography: FaGlobe,
  Math: FaCalculator,
  Mathematics: FaCalculator,
  IQ: FaBrain,
  Art: FaPalette,
  Nature: FaLeaf,
  Education: FaUserGraduate,
  General: FaBook,
  Default: FaBook,
};

const levels = [
  { level: 1, name: 'Rookie', desc: 'Just getting started – Easy questions', quizzes: 2, plan: 'Free', amount: 0, prize: 0, color: 'from-gray-400 to-gray-500', icon: FaBrain },
  { level: 2, name: 'Explorer', desc: 'Discover new ideas – Slightly challenging', quizzes: 4, plan: 'Free', amount: 0, prize: 0, color: 'from-blue-400 to-blue-500', icon: FaRocket },
  { level: 3, name: 'Thinker', desc: 'Test your brain power – Moderate difficulty', quizzes: 6, plan: 'Free', amount: 0, prize: 0, color: 'from-green-400 to-green-500', icon: FaChartLine },
  { level: 4, name: 'Achiever', desc: 'Prove your skills – Challenging questions', quizzes: 8, plan: 'Premium', amount: 99, prize: 50, color: 'from-purple-400 to-purple-500', icon: FaMedal },
  { level: 5, name: 'Master', desc: 'Expert level – Very challenging', quizzes: 10, plan: 'Premium', amount: 199, prize: 100, color: 'from-yellow-400 to-yellow-500', icon: FaCrown },
  { level: 6, name: 'Champion', desc: 'Elite level – Extremely difficult', quizzes: 12, plan: 'Premium', amount: 299, prize: 200, color: 'from-red-400 to-red-500', icon: FaTrophy },
  { level: 7, name: 'Legend', desc: 'Ultimate challenge – Master level', quizzes: 15, plan: 'Premium', amount: 499, prize: 500, color: 'from-indigo-400 to-indigo-500', icon: FaAward },
  { level: 8, name: 'Grandmaster', desc: 'Supreme level – Ultimate test', quizzes: 20, plan: 'Premium', amount: 999, prize: 1000, color: 'from-pink-400 to-pink-500', icon: FaGem }
];

const HomePage = () => {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  console.log(homeData,'homeData');
  useEffect(() => {
    fetchHomePageData();
  }, []);

  const fetchHomePageData = async () => {
    try {
      setLoading(true);
      const res = await API.getHomePageData();
      if (res.success) {
        setHomeData(res.data);
      } else {
        setError('Failed to load home page data');
      }
    } catch (err) {
      setError('Failed to load home page data');
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAttempt = (quiz) => {
    navigate(`/attempt-quiz/${quiz._id}`);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getLevelColor = (level) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-orange-500', 
      'bg-red-500', 'bg-purple-500', 'bg-pink-500', 'bg-indigo-500',
      'bg-teal-500', 'bg-cyan-500'
    ];
    return colors[(level - 1) % colors.length];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading your quiz dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20"></div>
        <div className="relative container mx-auto px-2 sm:px-4 py-10 sm:py-16 mt-10 sm:mt-16">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-4">
              Welcome to SUBG Quiz! 🎯
            </h1>
            <p className="text-base sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-8 max-w-3xl mx-auto">
              Explore quizzes by level, category, or subcategory. Only new quizzes you haven't attempted are shown!
            </p>
          </div>
        </div>
      </div>

      {/* Level-based Quizzes Section */}
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-2 sm:gap-0">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <FaStar className="text-blue-500" /> Level-based Quizzes
          </h2>
          <Link
            to="/level-quizzes"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base"
          >
            <FaLayerGroup className="text-lg" />
            View All Level Quizzes
          </Link>
        </div>
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-12 max-w-4xl">
          Discover quizzes tailored to your current level and challenge yourself with new questions
        </p>

        {!hasActiveSubscription() ? (
          <SubscriptionGuard
            message="Access to quizzes requires an active subscription."
            showUpgradeButton={true}
          />
        ) : (
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
                {homeData?.quizzesByLevel?.length > 0 ? (
                  <div className="space-y-8">
                    {homeData.quizzesByLevel.map((levelData) => (
                      <div key={levelData.level} className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-700 dark:to-blue-900/20 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-12 h-12 rounded-full ${getLevelColor(levelData.level)} flex items-center justify-center text-white font-bold text-lg`}>
                              {levelData.level}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                                Level {levelData.level}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300">
                                {levelData.quizCount} quizzes available
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {levelData.quizzes.map((quiz) => (
                            <div
                              key={quiz._id}
                              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
                            >
                              <div className="flex justify-between items-start mb-3">
                                <h4 className="font-semibold text-gray-800 dark:text-white text-sm">
                                  {quiz.title}
                                </h4>
                                {quiz.isRecommended && (
                                  <FaStar className="text-yellow-500 text-sm" />
                                )}
                              </div>
                              
                              {quiz.description && (
                                <p className="text-gray-600 dark:text-gray-300 text-xs mb-3 line-clamp-2">
                                  {quiz.description}
                                </p>
                              )}
                              
                              <div className="space-y-1 mb-3">
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                  <FaClock className="text-xs" />
                                  <span>{quiz.timeLimit || 30} min</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                                  <FaQuestionCircle className="text-xs" />
                                  <span>{quiz.totalMarks || 'Variable'} questions</span>
                                </div>
                                {quiz.difficulty && (
                                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                                    {quiz.difficulty}
                                  </span>
                                )}
                              </div>
                              
                              <button
                                onClick={() => handleQuizAttempt(quiz)}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                              >
                                Start Quiz
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaQuestionCircle className="text-6xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                      No new quizzes available for your level.
                    </p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm">
                      You've attempted all available quizzes for your current level!
                    </p>
                  </div>
                )}
              </div>
            )}
      </div>

      {/* Add this section after the Hero Section and before the Navigation Tabs */}
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
          <FaLayerGroup className="text-blue-500" /> All Levels
        </h2>
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-12 max-w-5xl">
          Progress through different difficulty levels and unlock new challenges as you advance your skills
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {levels.map((lvl) => {
            const IconComponent = lvl.icon;
            return (
              <Link
                to={`/level/${lvl.level}`}
                key={lvl.level}
                className={`group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border-gray-300 dark:border-gray-600`}
              >
                {/* Level Badge */}
                <div className="absolute -top-3 -right-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold bg-blue-500">
                    {lvl.level}
                  </div>
                </div>
                {/* Icon */}
                <div className={`w-16 h-16 bg-gradient-to-r ${lvl.color} rounded-2xl flex items-center justify-center mx-auto mt-6 mb-4`}>
                  <IconComponent className="text-white text-2xl" />
                </div>
                {/* Content */}
                <div className="p-6 pt-0">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 text-center">
                    {lvl.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 text-center">
                    {lvl.desc}
                  </p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Required:</span>
                      <span className="font-semibold text-gray-800 dark:text-white">{lvl.quizzes} quizzes</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400 text-sm">Plan:</span>
                      <span className={`font-semibold ${
                        lvl.plan === 'Free' ? 'text-green-600' : 
                        lvl.plan === 'Basic' ? 'text-blue-600' : 
                        lvl.plan === 'Premium' ? 'text-purple-600' : 'text-orange-600'
                      }`}>
                        {lvl.plan}
                      </span>
                    </div>
                    {lvl.amount > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Amount:</span>
                        <span className="font-semibold text-gray-800 dark:text-white">₹{lvl.amount}</span>
                      </div>
                    )}
                    {lvl.prize > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 dark:text-gray-400 text-sm">Prize:</span>
                        <span className="font-semibold text-green-600">₹{lvl.prize}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center py-2 rounded-lg text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    View Level
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Categories Section */}
      <div className="container mx-auto px-2 sm:px-4 py-6 sm:py-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-6 flex items-center gap-2">
          <FaBook className="text-blue-500" /> Categories
                </h2>
        <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-12 max-w-3xl">
          Explore quizzes by category and find your perfect learning path
        </p>
        
                {homeData?.categories?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
                    {homeData.categories.map((category, idx) => {
                      const Icon = categoryIcons[category.name] || categoryIcons.Default;
                      return (
                        <Link
                          key={category._id}
                          to={`/category/${category._id}`}
                  className={`group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 border-gray-300 dark:border-gray-600 p-6`}
                          tabIndex={0}
                        >
                  {/* Icon */}
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-white text-2xl" />
                          </div>
                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                              {category.name}
                            </h3>
                    <div className="text-center py-2 rounded-lg text-sm font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      View Quizzes
                          </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaBook className="text-6xl text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                      No categories found.
                    </p>
                  </div>
                )}
              </div>
    </div>
  );
};

export default HomePage;
