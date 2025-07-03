import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrophy, FaCrown, FaStar, FaMedal, FaRocket, FaBrain, FaChartLine, FaArrowLeft, FaAward, FaGem } from 'react-icons/fa';
import API from '../utils/api';

const levels = [
  { level: 0, name: 'Zero Level', desc: 'Just registered - Start your journey!', quizzes: 0, plan: 'Free', amount: 0, prize: 0, color: 'from-gray-300 to-gray-400', icon: FaBrain },
  { level: 1, name: 'Rookie', desc: 'Just getting started – Easy questions', quizzes: 2, plan: 'Free', amount: 0, prize: 0, color: 'from-gray-400 to-gray-500', icon: FaBrain },
  { level: 2, name: 'Explorer', desc: 'Discover new ideas – Slightly challenging', quizzes: 4, plan: 'Free', amount: 0, prize: 0, color: 'from-blue-400 to-blue-500', icon: FaRocket },
  { level: 3, name: 'Thinker', desc: 'Test your brain power – Moderate difficulty', quizzes: 8, plan: 'Free', amount: 0, prize: 0, color: 'from-green-400 to-green-500', icon: FaBrain },
  { level: 4, name: 'Strategist', desc: 'Mix of logic, memory, and speed', quizzes: 16, plan: 'Basic', amount: 99, prize: 0, color: 'from-purple-400 to-purple-500', icon: FaChartLine },
  { level: 5, name: 'Achiever', desc: 'Cross-topic challenges begin', quizzes: 32, plan: 'Basic', amount: 99, prize: 0, color: 'from-indigo-400 to-indigo-500', icon: FaStar },
  { level: 6, name: 'Mastermind', desc: 'For those who always aim to win', quizzes: 64, plan: 'Basic', amount: 99, prize: 0, color: 'from-pink-400 to-pink-500', icon: FaBrain },
  { level: 7, name: 'Champion', desc: 'Beat the timer and the brain', quizzes: 128, plan: 'Premium', amount: 499, prize: 0, color: 'from-yellow-400 to-yellow-500', icon: FaMedal },
  { level: 8, name: 'Prodigy', desc: 'Only a few reach here – high-level puzzles', quizzes: 256, plan: 'Premium', amount: 499, prize: 0, color: 'from-orange-400 to-orange-500', icon: FaStar },
  { level: 9, name: 'Quiz Wizard', desc: 'Complex questions across categories', quizzes: 512, plan: 'Premium', amount: 499, prize: 0, color: 'from-red-400 to-red-500', icon: FaBrain },
  { level: 10, name: 'Legend', desc: 'Final frontier — only the best reach here!', quizzes: 1024, plan: 'Pro', amount: 999, prize: 99999, color: 'from-purple-500 to-pink-500', icon: FaCrown }
];

const getUserLevel = (highScoreQuizzes) => {
  for (let i = levels.length - 1; i >= 0; i--) {
    if (highScoreQuizzes >= levels[i].quizzes) return levels[i];
  }
  return levels[0];
};

const LevelsPage = () => {
  const navigate = useNavigate();
  const [userLevelData, setUserLevelData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserLevel = async () => {
      try {
        setLoading(true);
        const profileRes = await API.getProfile();
        setUserLevelData(profileRes);
      } catch (err) {
        console.error('Error fetching user level:', err);
        setError('Failed to load user level data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserLevel();
  }, []);

  // Use fresh data from API instead of localStorage
  const highScoreQuizzes = userLevelData?.levelInfo?.progress?.highScoreQuizzes || 0;
  const userLevel = getUserLevel(highScoreQuizzes);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading level data...</p>
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
            onClick={() => window.location.reload()}
            className="mt-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900">
      <div className="container mx-auto px-4 py-8 mt-16">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaTrophy className="text-white text-3xl" />
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Level Progression System
          </h1>
          <p className="text-md md:text-xl text-gray-600 dark:text-gray-300">
            Journey from Zero Level to Legend through 11 exciting levels
          </p>
        </div>

        {/* Current Level Card */}
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-2 md:p-8 border border-white/20 mb-8">
          <div className="text-center">
            <h2 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6">
              🎯 Your Current Level
            </h2>
            <div className="flex items-center justify-center space-x-6 mb-6">
              <div className={`w-12 h-12 md:w-24 md:h-24 bg-gradient-to-r ${userLevel.color} rounded-2xl flex items-center justify-center`}>
                <userLevel.icon className="text-white text-4xl" />
              </div>
              <div className="text-left">
                <div className="text-xl md:text-3xl font-bold text-gray-800 dark:text-white">
                  {userLevel.name}
                </div>
                <div className="text-gray-600 dark:text-gray-300">
                  Level {userLevel.level}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {userLevel.desc}
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {highScoreQuizzes} / {userLevel.quizzes} Quizzes
              </div>
              <div className="text-gray-600 dark:text-gray-300">
                High-score quizzes completed (75%+ score)
              </div>
            </div>
          </div>
        </div>

        {/* Levels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {levels.map((lvl) => {
            const IconComponent = lvl.icon;
            const isCurrentLevel = lvl.level === userLevel.level;
            const isUnlocked = highScoreQuizzes >= lvl.quizzes;
            
            return (
              <div
                key={lvl.level}
                className={`group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl border-2 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 ${
                  isCurrentLevel 
                    ? 'border-blue-500 shadow-blue-500/25' 
                    : isUnlocked 
                      ? 'border-green-500 shadow-green-500/25' 
                      : 'border-gray-300 dark:border-gray-600'
                }`}
              >
                {/* Level Badge */}
                <div className="absolute -top-3 -right-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    isCurrentLevel 
                      ? 'bg-blue-500' 
                      : isUnlocked 
                        ? 'bg-green-500' 
                        : 'bg-gray-400'
                  }`}>
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

                  {/* Stats */}
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

                  {/* Status */}
                  <div className={`text-center py-2 rounded-lg text-sm font-semibold ${
                    isCurrentLevel 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' 
                      : isUnlocked 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                  }`}>
                    {isCurrentLevel ? 'Current Level' : isUnlocked ? 'Unlocked' : 'Locked'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Scholarship Info */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-3xl shadow-2xl p-2 md:p-8 border border-yellow-200 dark:border-yellow-700">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                <FaAward className="text-white text-2xl" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                Scholarship & Prizes
              </h3>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700 dark:text-gray-300">
                Only the top 1–3 ranked users in Level 10 (<span className="font-bold text-orange-600">Legend</span>) win scholarships and prizes!
              </p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">₹99,999</div>
                  <div className="text-gray-600 dark:text-gray-300">Maximum Prize Pool</div>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Based on quiz scores + completion time
              </p>
            </div>
          </div>

          {/* Progression Rules */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl shadow-2xl p-2 md:p-8 border border-blue-200 dark:border-blue-700">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <FaGem className="text-white text-2xl" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
                Progression Rules
              </h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Only quizzes with <span className="font-bold text-green-600">75% or higher score</span> count towards level progression
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Achieve high scores consistently to advance through levels
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Focus on quality over quantity - aim for excellence in every quiz!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold transform hover:scale-105 flex items-center space-x-2 mx-auto"
            onClick={() => {
              navigate(-1);
            }}
          >
            <FaArrowLeft className="text-sm" />
            <span>Back to Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelsPage; 