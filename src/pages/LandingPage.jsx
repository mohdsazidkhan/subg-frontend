import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaTrophy,
  FaCrown,
  FaStar,
  FaMedal,
  FaRocket,
  FaBrain,
  FaChartLine,
  FaAward,
  FaGem,
  FaBook,
  FaFlask,
  FaLaptopCode,
  FaGlobe,
  FaCalculator,
  FaPalette,
  FaUserGraduate,
  FaArrowRight,
  FaPlay,
  FaUsers,
  FaGift,
  FaCheckCircle,
  FaShieldAlt,
  FaHeadset,
  FaMobileAlt,
  FaDesktop,
  FaTabletAlt,
  FaMagic,
  FaQuestionCircle,
  FaNewspaper,
  FaHistory,
  FaFutbol,
  FaFilm,
  FaLanguage,
  FaGraduationCap,
  FaDollarSign,
  FaCalendarDay,
} from "react-icons/fa";

import UnifiedNavbar from "../components/UnifiedNavbar";
import UnifiedFooter from "../components/UnifiedFooter";
import MonthlyWinnersDisplay from "../components/MonthlyWinnersDisplay";
import MobileAppWrapper from "../components/MobileAppWrapper";
import API from "../utils/api";

const LandingPage = () => {
  const [levels, setLevels] = useState([]);
  const [categories, setCategories] = useState([]);
  const [topPerformers, setTopPerformers] = useState([]);
  const [stats, setStats] = useState({
    activeStudents: "10K+",
    quizCategories: "500+",
    subcategories: "100+",
    totalQuizzes: "1000+",
    totalQuestions: "5000+",
    quizzesTaken: "50K+",
    monthlyPrizePool: "₹9,999",
    paidSubscriptions: "99",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
      return;
    }

    // Set default view mode based on screen size
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('grid');
      } else {
        setViewMode('list');
      }
    };

    // Set initial view mode
    handleResize();

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);

    fetchData();

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel using centralized API service
      const [levelsRes, categoriesRes, topPerformersRes, statsRes] =
        await Promise.all([
          API.getAllLevels(),
          API.getPublicCategoriesEnhanced(),
          API.getPublicLandingTopPerformers(10),
          API.getPublicLandingStats(),
        ]);

      // Set data if successful
      if (levelsRes.success) {
        // Filter out Starter level (Level 0)
        const filteredLevels = levelsRes.data.filter(
          (level) => level.level !== 0
        );
        setLevels(filteredLevels);
      }

      if (categoriesRes.success) {
        setCategories(categoriesRes.data);
      }

      if (topPerformersRes.success) {
        // Sort the top performers using the same logic as Performance Analytics
        const sortedTopPerformers = topPerformersRes.data.sort((a, b) => {
          // First priority: High Score Wins (descending) - same as Performance Analytics
          const aHighScore = a.highQuizzes || 0;
          const bHighScore = b.highQuizzes || 0;
          if (aHighScore !== bHighScore) {
            return bHighScore - aHighScore;
          }
          
          // Second priority: Accuracy (descending) - same as Performance Analytics
          const aAccuracy = a.accuracy || 0;
          const bAccuracy = b.accuracy || 0;
          if (aAccuracy !== bAccuracy) {
            return bAccuracy - aAccuracy;
          }
          
          // Third priority: Total quizzes played (descending) - same as Performance Analytics
          const aTotalQuizzes = a.totalQuizzes || 0;
          const bTotalQuizzes = b.totalQuizzes || 0;
          return bTotalQuizzes - aTotalQuizzes;
        });
        
        setTopPerformers(sortedTopPerformers);
      }

      if (statsRes.success) {
        // Format large numbers for display
        const formatNumber = (num) => {
          if (num >= 1000) {
            return `${(num / 1000).toFixed(1)}K+`;
          }
          return num.toString();
        };

        setStats({
          activeStudents: formatNumber(statsRes.data.activeStudents),
          quizCategories: formatNumber(statsRes.data.quizCategories),
          subcategories: formatNumber(statsRes.data.subcategories),
          totalQuizzes: formatNumber(statsRes.data.totalQuizzes),
          totalQuestions: formatNumber(statsRes.data.totalQuestions),
          quizzesTaken: formatNumber(statsRes.data.quizzesTaken),
          monthlyPrizePool: statsRes.data.monthlyPrizePool,
          paidSubscriptions: statsRes.data.paidSubscriptions,
        });
      }
    } catch (error) {
      console.error("Error fetching landing page data:", error);
      setError("Failed to load data. Please try again later.");
      // Set fallback data if APIs fail
      setLevels([
        {
          level: 1,
          name: "Rookie",
          description: "Build your foundation",
          quizCount: 30,
          quizzesRequired: 2,
        },
        {
          level: 2,
          name: "Explorer",
          description: "Discover new knowledge",
          quizCount: 35,
          quizzesRequired: 6,
        },
        {
          level: 3,
          name: "Thinker",
          description: "Develop critical thinking",
          quizCount: 40,
          quizzesRequired: 12,
        },
        {
          level: 4,
          name: "Strategist",
          description: "Master strategic learning",
          quizCount: 45,
          quizzesRequired: 20,
        },
      ]);
      
      setCategories([
        {
          _id: "1",
          name: "Science",
          description: "Explore scientific concepts",
          quizCount: 50,
        },
        {
          _id: "2",
          name: "Technology",
          description: "Learn about modern tech",
          quizCount: 45,
        },
        {
          _id: "3",
          name: "Mathematics",
          description: "Master mathematical skills",
          quizCount: 40,
        },
        {
          _id: "4",
          name: "Geography",
          description: "Discover the world",
          quizCount: 35,
        },
        {
          _id: "5",
          name: "History",
          description: "Learn from the past",
          quizCount: 30,
        },
        {
          _id: "6",
          name: "Literature",
          description: "Explore great works",
          quizCount: 25,
        },
      ]);
      
      setTopPerformers([
        { _id: "1", name: "Quiz Master", level: 10, score: 95, quizCount: 150 },
        {
          _id: "2",
          name: "Knowledge Seeker",
          level: 10,
          score: 92,
          quizCount: 145,
        },
        {
          _id: "3",
          name: "Brain Champion",
          level: 10,
          score: 90,
          quizCount: 140,
        },
        { _id: "4", name: "Learning Pro", level: 9, score: 88, quizCount: 135 },
        { _id: "5", name: "Quiz Wizard", level: 9, score: 85, quizCount: 130 },
        {
          _id: "6",
          name: "Smart Student",
          level: 8,
          score: 82,
          quizCount: 125,
        },
        {
          _id: "7",
          name: "Knowledge Hunter",
          level: 8,
          score: 80,
          quizCount: 120,
        },
        {
          _id: "8",
          name: "Quiz Explorer",
          level: 7,
          score: 78,
          quizCount: 115,
        },
        {
          _id: "9",
          name: "Learning Star",
          level: 7,
          score: 75,
          quizCount: 110,
        },
        {
          _id: "10",
          name: "Quiz Enthusiast",
          level: 6,
          score: 72,
          quizCount: 105,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-subg-light dark:bg-subg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-subg-light dark:bg-subg-dark flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              fetchData();
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <MobileAppWrapper title="SUBG QUIZ">
      <div className="min-h-screen bg-subg-light dark:bg-subg-dark text-gray-900 dark:text-white transition-colors duration-300">
        {/* Unified Header */}
        <UnifiedNavbar isLandingPage={true} scrollToSection={scrollToSection} />

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 via-red-600/10 to-yellow-600/10 pointer-events-none" />
        
        {/* Floating Background Icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Books */}
          <div className="absolute top-20 left-10 animate-float-slow hero-float-icon">
            <FaBook className="w-8 h-8 text-yellow-500/30 animate-pulse" />
          </div>
          <div className="absolute top-32 right-20 animate-float-medium hero-float-icon">
            <FaBook className="w-6 h-6 text-orange-500/25 animate-pulse" />
          </div>
          <div className="absolute top-40 left-1/4 animate-float-fast hero-float-icon">
            <FaBook className="w-5 h-5 text-red-500/20 animate-pulse" />
          </div>
          
          {/* Question Marks */}
          <div className="absolute top-16 right-1/3 animate-float-medium hero-float-icon">
            <FaQuestionCircle className="w-7 h-7 text-yellow-400/30 animate-bounce" />
          </div>
          <div className="absolute top-24 left-1/3 animate-float-slow hero-float-icon">
            <FaQuestionCircle className="w-5 h-5 text-orange-400/25 animate-bounce" />
          </div>
          <div className="absolute top-36 right-16 animate-float-fast hero-float-icon">
            <FaQuestionCircle className="w-6 h-6 text-red-400/20 animate-bounce" />
          </div>
          
          {/* Quiz Icons */}
          <div className="absolute top-28 left-16 animate-float-medium hero-float-icon">
            <FaBrain className="w-6 h-6 text-yellow-500/25 animate-pulse" />
          </div>
          <div className="absolute top-44 right-1/4 animate-float-slow hero-float-icon">
            <FaBrain className="w-7 h-7 text-orange-500/30 animate-pulse" />
          </div>
          
          {/* Categories */}
          <div className="absolute top-20 right-10 animate-float-fast hero-float-icon">
            <FaFlask className="w-5 h-5 text-yellow-400/20 animate-pulse" />
          </div>
          <div className="absolute top-48 left-20 animate-float-medium hero-float-icon">
            <FaCalculator className="w-6 h-6 text-orange-400/25 animate-pulse" />
          </div>
          <div className="absolute top-32 left-1/2 animate-float-slow hero-float-icon">
            <FaPalette className="w-5 h-5 text-red-400/20 animate-pulse" />
          </div>
          
          {/* Students */}
          <div className="absolute top-16 left-1/2 animate-float-medium hero-float-icon">
            <FaUserGraduate className="w-6 h-6 text-yellow-500/25 animate-pulse" />
          </div>
          <div className="absolute top-40 right-32 animate-float-slow hero-float-icon">
            <FaUsers className="w-5 h-5 text-orange-500/20 animate-pulse" />
          </div>
          <div className="absolute top-52 left-1/3 animate-float-fast hero-float-icon">
            <FaUserGraduate className="w-7 h-7 text-red-500/30 animate-pulse" />
          </div>
          
          {/* Additional floating elements */}
          <div className="absolute top-24 right-40 animate-float-slow hero-float-icon">
            <FaTrophy className="w-4 h-4 text-yellow-400/15 animate-pulse" />
          </div>
          <div className="absolute top-36 left-40 animate-float-medium hero-float-icon">
            <FaStar className="w-5 h-5 text-orange-400/20 animate-pulse" />
          </div>
          <div className="absolute top-48 right-1/2 animate-float-fast hero-float-icon">
            <FaMedal className="w-6 h-6 text-red-400/25 animate-pulse" />
          </div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20 mt-0 md:mt-8">
          <div className="text-center">
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 dark:text-white">
                Master Knowledge
              </span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 dark:text-white">
                Through Interactive Quizzes
              </span>
            </h1>
            <p className="text-sm md:text-xl mb-8 max-w-3xl mx-auto text-gray-600 dark:text-gray-300">
              Challenge yourself with our comprehensive quiz platform. Test your
              knowledge across multiple categories, compete with others, and
              climb the monthly leaderboard while earning rewards. Every month
              is a fresh start!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="group px-4 md:px-8 py-2 md:py-4 bg-gradient-to-r from-yellow-600 to-red-600 text-white rounded-xl font-semibold text-lg hover:from-yellow-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Start Learning Now</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button
                onClick={() => scrollToSection("levels")}
                className="px-4 md:px-8 py-2 md:py-4 border-2 border-yellow-600 text-yellow-600 dark:text-yellow-400 rounded-xl font-semibold text-lg hover:bg-yellow-600 hover:text-white dark:hover:bg-yellow-600 dark:hover:text-white transition-all duration-300 flex items-center space-x-2"
              >
                <FaPlay className="w-4 h-4" />
                <span>Explore Levels</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-10 lg:mt-20 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-6 p-4 relative">
            {[
              {
                icon: FaUsers,
                number: stats?.activeStudents || "N/A",
                label: "Active Students",
                gradient: "from-blue-500/20 to-cyan-500/20",
                iconBg: "from-blue-500 to-cyan-500",
                textColor: "text-blue-600",
              },
              {
                icon: FaBook,
                number: stats?.quizCategories || "N/A",
                label: "Quiz Categories",
                gradient: "from-green-500/20 to-emerald-500/20",
                iconBg: "from-green-500 to-emerald-500",
                textColor: "text-green-600",
              },
              {
                icon: FaFlask,
                number: stats.subcategories || "N/A",
                label: "Subcategories",
                gradient: "from-purple-500/20 to-pink-500/20",
                iconBg: "from-purple-500 to-pink-500",
                textColor: "text-purple-600",
              },
              {
                icon: FaQuestionCircle,
                number: stats.totalQuestions || "N/A",
                label: "Total Questions",
                gradient: "from-orange-500/20 to-red-500/20",
                iconBg: "from-orange-500 to-red-500",
                textColor: "text-orange-600",
              },
              {
                icon: FaLaptopCode,
                number: stats.totalQuizzes || "N/A",
                label: "Total Quizzes",
                gradient: "from-indigo-500/20 to-blue-500/20",
                iconBg: "from-indigo-500 to-blue-500",
                textColor: "text-indigo-600",
              },
              {
                icon: FaTrophy,
                number: stats?.quizzesTaken || "N/A",
                label: "Quizzes Taken",
                gradient: "from-yellow-500/20 to-orange-500/20",
                iconBg: "from-yellow-500 to-orange-500",
                textColor: "text-yellow-600",
              },
              {
                icon: FaGift,
                number: stats?.monthlyPrizePool || "N/A",
                label: "Monthly Prize Pool",
                gradient: "from-pink-500/20 to-rose-500/20",
                iconBg: "from-pink-500 to-rose-500",
                textColor: "text-pink-600",
              },
              {
                icon: FaCalendarDay,
                number: stats?.paidSubscriptions || "N/A",
                label: "Active Subcriptions",
                gradient: "from-teal-500/20 to-green-500/20",
                iconBg: "from-teal-500 to-green-500",
                textColor: "text-teal-600",
              },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className={`w-14 h-14 mx-auto mb-3 rounded-full flex items-center justify-center bg-gradient-to-br ${stat?.iconBg} shadow-lg transform group-hover:scale-110 transition-all duration-300`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <div className={`text-xl lg:text-2xl font-bold ${stat?.textColor} mb-1 group-hover:scale-105 transition-transform duration-300`}>
                  {stat.number}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
                {/* Gradient background overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${stat?.gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-red-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl"></div>
        </div>
      </section>

       {/* Profile Completion Reward Section */}
       <section id="profile-completion" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-emerald-900/20 pointer-events-none" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-tr from-green-500 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-float">
              <FaUserGraduate className="text-white text-2xl sm:text-3xl md:text-4xl drop-shadow-lg" />
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 dark:text-white">
                Complete Your Profile & Get Basic Subscription FREE!
              </span>
            </h2>
            <p className="text-md md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Complete <strong className="text-green-600 dark:text-green-400">100% of your profile</strong> and instantly unlock a <strong className="text-green-600 dark:text-green-400">Basic Subscription (₹9 value)</strong> for 30 days absolutely free!
            </p>
          </div>
          <div className="max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3">
                      ✅ What You Need to Complete:
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <FaStar className="text-white text-xs sm:text-sm" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Full Name</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <FaStar className="text-white text-xs sm:text-sm" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Valid Email Address</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <FaStar className="text-white text-xs sm:text-sm" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">10-digit Phone No.</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <FaStar className="text-white text-xs sm:text-sm" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">One Social Media Link</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3">
                      🚀 What You Get:
                    </h4>
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <FaStar className="text-white text-xs sm:text-sm" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Access to Levels 0-6 (Basic Plan)</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <FaStar className="text-white text-xs sm:text-sm" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">30 Days of Basic Access</span>
                      </div>
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                          <FaStar className="text-white text-xs sm:text-sm" />
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">Unlimited Quiz Attempts</span>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
        </div>
        
      </section>

      {/* Prize & Rewards Section */}
       <section id="prizes" className="py-20 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-tl from-amber-50 via-yellow-50 to-orange-50 dark:from-gray-900 dark:via-amber-900/20 dark:to-orange-900/20 pointer-events-none" />
         <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-4">
                             <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-600 dark:text-white">
                Win Amazing Prizes & Rewards
              </span>
            </h2>
            <p className="text-md md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Compete monthly for amazing rewards! Top 3 performers at Level 10 and Minimum 110 Quizzes with ≥75% accuracy share ₹9,999 prize pool every month.
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <div className="space-y-6">
                {[
                  {
                    icon: FaTrophy,
                    title: "Monthly Prize Pool",
                    description:
                      "Top 3 performers share the monthly prize pool",
                    amount: "₹9,999",
                  },
                  {
                    icon: FaCrown,
                    title: "1st Place",
                    description: "Best performer gets 50% of the prize pool",
                    amount: "₹4,999",
                  },
                  {
                    icon: FaMedal,
                    title: "2nd Place",
                    description: "Second best gets 33% of the prize pool",
                    amount: "₹3,333",
                  },
                  {
                    icon: FaGem,
                    title: "3rd Place",
                    description: "Third best gets 17% of the prize pool",
                    amount: "₹1,667",
                  },
                ]?.map((reward, index) => (
                  <div key={index} className="flex items-start space-x-4">
                                                                                   <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-yellow-100 dark:bg-gray-800">
                       <reward.icon className="w-6 h-6 text-yellow-600" />
                     </div>
                     <div className="flex-1">
                       <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">
                          {reward?.title}
                        </h3>
                        <span className="text-lg font-bold text-green-600">
                          {reward?.amount}
                        </span>
                       </div>
                       <p className="text-gray-600 dark:text-gray-400">
                         {reward?.description}
                       </p>
                     </div>
                  </div>
                ))}
              </div>
            </div>

                         <div className="rounded-2xl p-2 md:-p-6 lg:p-6 xl:p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
              <h3 className="text-xl lg:text-2xl font-bold mb-6 text-center">
                Monthly Prize Pool
              </h3>
               <div className="space-y-6">
                 <div className="text-center">
                  <div className="text-4xl font-bold text-yellow-500 mb-2">
                    ₹9,999
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Monthly Prize Pool
                  </p>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="text-center p-4 rounded-lg bg-gradient-to-br from-yellow-600 to-yellow-700 text-white">
                     <div className="text-xl lg:text-2xl font-bold">₹4,999</div>
                     <div className="text-sm">1st Place (50%)</div>
                   </div>
                   <div className="text-center p-4 rounded-lg bg-gradient-to-br from-gray-400 to-gray-500 text-white">
                     <div className="text-xl lg:text-2xl font-bold">₹3,333</div>
                     <div className="text-sm">2nd Place (33%)</div>
                   </div>
                 </div>
                 <div className="text-center">
                  <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-600/50 to-orange-700/60 text-white">

                  <div className="text-xl lg:text-2xl font-bold text-amber-600 dark:text-white mb-2">
                    ₹1,667
                  </div>
                  <p className="text-gray-600 dark:text-gray-200">
                    3rd Place (17%)
                  </p>
                 </div>
                 </div>
               </div>
              
              <div className="mt-8 text-center">
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-red-600 text-white rounded-xl font-semibold hover:from-yellow-700 hover:to-red-700 transition-all duration-300"
                >
                  <span>Start Winning</span>
                  <FaArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>

          {/* Achievement Badges */}
          <div className="text-center mb-12">
            <h3 className="text-xl lg:text-2xl font-bold mb-8">Earn Achievement Badges</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: FaStar,
                  name: "Quiz Master",
                  description: "Complete Min 110 Quizzes",
                },
                {
                  icon: FaBrain,
                  name: "Knowledge Seeker",
                  description: "Score 75%+ in 55 quizzes",
                },
                {
                  icon: FaRocket,
                  name: "Speed Demon",
                  description: "Complete quiz in under 2 minutes",
                },
                {
                  icon: FaCrown,
                  name: "Legend",
                  description: "Top 10 in monthly leaderboard",
                },
              ].map((badge, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-yellow-500 shadow-lg hover:shadow-xl"
                >
                   <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-yellow-100 dark:bg-gray-700">
                     <badge.icon className="w-8 h-8 text-yellow-600" />
                   </div>
                   <h4 className="font-semibold mb-2">{badge?.name}</h4>
                   <p className="text-sm text-gray-600 dark:text-gray-400">
                     {badge?.description}
                   </p>
                 </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      
      {/* Monthly Winners Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 via-green-50 to-orange-50 dark:from-blue-900/20 dark:via-green-900/20 dark:to-orange-900/20 pointer-events-none" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 dark:text-white">
                🏆 Previous Month Legends
              </span>
            </h2>
            <p className="text-md md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Celebrating the previous month's top 3 performers who achieved Level 10 with ≥75% accuracy and won monthly prizes!
            </p>
          </div>
          
          <div className="container mx-auto">
            <MonthlyWinnersDisplay 
              title="🏆 Previous Month Legends" 
              showTitle={false}
              className="bg-white dark:bg-gray-800 shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Top Performers Section */}
      <section id="performers" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-teal-900/20 pointer-events-none" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-4">
                             <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-600 dark:text-white">
                Top 10 Performers{" "}
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </h2>
                         <p className="text-md md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Meet the champions who are dominating the monthly leaderboard. Top
              3 at Level 10 with ≥75% accuracy win monthly prizes in 3:2:1
              ratio!
             </p>
          </div>

          <div className="rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-xl border-2 border-blue-300 dark:border-indigo-500">
            <div className="p-6 border-b-2 border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 flex items-center gap-2">
                    <span className="text-2xl">🏆</span>
                    {new Date().toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    Leaderboard
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
                    Top performers based on high scores, accuracy & level
                  </p>
             </div>
             
                {/* View Toggle Buttons */}
                <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⊞</span>
                      <span className="hidden sm:inline">Grid</span>
                       </div>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-300 shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">☰</span>
                      <span className="hidden sm:inline">List</span>
                       </div>
                  </button>
                </div>
              </div>
             </div>
             
            {/* Grid View - Default for mobile */}
            {viewMode === 'grid' && (
              <div className="p-2 lg:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {topPerformers?.length > 0 ? topPerformers.map((performer, index) => (
                    <div
                      key={performer?._id || `performer-${index}`}
                      className={`bg-white dark:bg-gray-900 rounded-xl p-4 border-2 transition-all duration-200 hover:shadow-lg group ${
                        index === 0
                          ? "border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20"
                          : index === 1
                          ? "border-gray-400 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20"
                          : index === 2
                          ? "border-orange-400 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20"
                          : "border-blue-200 dark:border-blue-600 hover:border-blue-400"
                      }`}
                    >
                      {/* Rank */}
                      <div className="flex items-center justify-between mb-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                            index === 0
                              ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                              : index === 1
                              ? "bg-gradient-to-r from-gray-400 to-slate-500"
                              : index === 2
                              ? "bg-gradient-to-r from-orange-400 to-amber-500"
                              : "bg-gradient-to-r from-blue-400 to-indigo-500"
                          }`}
                        >
                          {index === 0
                            ? "🥇"
                            : index === 1
                            ? "🥈"
                            : index === 2
                            ? "🥉"
                            : index + 1}
                        </div>
                        {index < 3 && (
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                            {index === 0
                              ? "Champion"
                              : index === 1
                              ? "Runner-up"
                              : "3rd Place"}
                          </span>
                     )}
                   </div>
                   
                      {/* Student Info */}
                      <div className="text-center mb-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-2">
                          <span className="text-2xl text-blue-600 dark:text-blue-400">
                            {performer?.name?.charAt(0)?.toUpperCase() || "?"}
                          </span>
                        </div>
                        <div className="font-bold text-gray-900 dark:text-white text-lg">
                          {performer?.name || "Anonymous"}
                        </div>
                        <div className={`subscription-name-badge mx-auto ${
                              performer?.subscriptionName === "PRO"
                            ? "bg-gradient-to-r from-yellow-400 to-red-500"
                            : performer?.subscriptionName === "PREMIUM"
                            ? "bg-gradient-to-r from-pink-400 to-orange-500"
                            : performer?.subscriptionName === "BASIC"
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                            : "bg-gradient-to-r from-green-400 to-teal-500"
                        }`}>
                          {performer?.subscriptionName || "FREE"}
                        </div>
                   </div>
                   
                      {/* Stats Grid */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Level */}
                        <div className="text-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg flex items-center justify-center mx-auto mb-1">
                            <span className="text-green-600 dark:text-green-400 text-sm">📈</span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Level</div>
                          <div className="font-bold text-gray-900 dark:text-white">
                            {performer?.userLevel || 0}
                          </div>
                        </div>

                        {/* Total Quizzes */}
                        <div className="text-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center mx-auto mb-1">
                            <span className="text-blue-600 dark:text-blue-400 text-sm">📚</span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Quizzes</div>
                          <div className="font-bold text-gray-900 dark:text-white">
                            {performer?.totalQuizzes || 0}
                          </div>
                        </div>

                        {/* High Quizzes */}
                        <div className="text-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-yellow-900/30 rounded-lg flex items-center justify-center mx-auto mb-1">
                            <span className="text-yellow-600 dark:text-yellow-400 text-sm">🏆</span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">High</div>
                          <div className="font-bold text-gray-900 dark:text-white">
                            {performer?.highQuizzes || 0}
                          </div>
                        </div>

                        {/* Accuracy */}
                        <div className="text-center">
                          <div className="w-8 h-8 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center mx-auto mb-1">
                            <span className="text-purple-600 dark:text-purple-400 text-sm">🎯</span>
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Accuracy</div>
                          <div className="font-bold text-gray-900 dark:text-white">
                            {performer?.accuracy || 0}%
                          </div>
                        </div>
                   </div>
                 </div>
               )) : (
                 <div className="col-span-full text-center py-12">
                   <div className="text-gray-500 dark:text-gray-400 text-lg">
                     No top performers data available
                   </div>
                 </div>
               )}
             </div>
              </div>
            )}

            {/* List View - Table for desktop */}
            {viewMode === 'list' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-blue-200 dark:border-blue-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                      <th className="py-4 px-4 text-left text-blue-800 dark:text-blue-200 font-bold text-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🏆</span>
                          Rank
                        </div>
                      </th>
                      <th className="py-4 px-4 text-left text-blue-800 dark:text-blue-200 font-bold text-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">👤</span>
                          Student
                        </div>
                      </th>
                      <th className="py-4 px-4 text-left text-blue-800 dark:text-blue-200 font-bold text-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📈</span>
                          Level
                        </div>
                      </th>
                      <th className="py-4 px-4 text-left text-blue-800 dark:text-blue-200 font-bold text-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">📚</span>
                          Total Quizzes
                        </div>
                      </th>
                      <th className="py-4 px-4 text-left text-blue-800 dark:text-blue-200 font-bold text-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🏆</span>
                          High Quizzes
                        </div>
                      </th>
                      <th className="py-4 px-4 text-left text-blue-800 dark:text-blue-200 font-bold text-lg">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🎯</span>
                          Accuracy
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                   {topPerformers?.length > 0 ? topPerformers.map((performer, index) => (
                    <tr
                      key={performer?._id || `performer-${index}`}
                      className={`border-b transition-all duration-200 border-gray-200 hover:shadow-lg group ${
                        index === 0
                          ? "bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10"
                          : index === 1
                          ? "bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-900/10 dark:to-slate-900/10"
                          : index === 2
                          ? "bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10"
                          : "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/10 dark:hover:to-indigo-900/10"
                      }`}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 lg:w-12 lg:h-12 rounded-full  flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                              index === 0
                                ? "bg-gradient-to-r from-yellow-400 to-orange-500"
                                : index === 1
                                ? "bg-gradient-to-r from-gray-400 to-slate-500"
                                : index === 2
                                ? "bg-gradient-to-r from-orange-400 to-amber-500"
                                : "bg-gradient-to-r from-blue-400 to-indigo-500"
                            }`}
                          >
                            {index === 0
                              ? "🥇"
                              : index === 1
                              ? "🥈"
                              : index === 2
                              ? "🥉"
                              : index + 1}
                       </div>
                          {index < 3 && (
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                              {index === 0
                                ? "Champion"
                                : index === 1
                                ? "Runner-up"
                                : "3rd Place"}
                       </div>
                     )}
                   </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-full flex items-center justify-center">
                            <span className="text-xl text-blue-600 dark:text-blue-400">
                              {performer?.name?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                         </div>
                          <div>
                            <div className="font-bold text-gray-900 dark:text-white text-md lg:text-lg">
                              {performer?.name || "Anonymous"}
                            </div>
                            <div className={`subscription-name-badge ${
                              performer?.subscriptionName === "PRO"
                            ? "bg-gradient-to-r from-yellow-400 to-red-500"
                            : performer?.subscriptionName === "PREMIUM"
                            ? "bg-gradient-to-r from-pink-400 to-orange-500"
                            : performer?.subscriptionName === "BASIC"
                            ? "bg-gradient-to-r from-blue-400 to-indigo-500"
                            : "bg-gradient-to-r from-green-400 to-teal-500"
                        }`}>
                          {performer?.subscriptionName || "FREE"}
                        </div>
                 </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-green-600 dark:text-green-400 text-sm">
                              📈
                            </span>
                          </div>
                          <div className="flex-col items-center gap-2">
                            <div className="font-bold text-gray-900 dark:text-white text-lg">
                              {performer?.userLevelName || 0}
                            </div>
                            <div className="font-medium text-gray-500 text-sm">
                                Level {performer?.userLevelNo || 0}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 dark:text-blue-400 text-sm">
                              📚
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 dark:text-white text-lg">
                              {performer?.totalQuizzes || 0}
                            </span>
                            {(performer?.totalQuizzes || 0) > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
                                📚
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-yellow-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-yellow-600 dark:text-yellow-400 text-sm">
                              🏆
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 dark:text-white text-lg">
                              {performer?.highQuizzes || 0}
                            </span>
                            {(performer?.highQuizzes || 0) > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200">
                               🏆
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-lg flex items-center justify-center">
                            <span className="text-purple-600 dark:text-purple-400 text-sm">
                              🎯
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 dark:text-white text-lg">
                              {performer?.accuracy || 0}%
                            </span>
                            {(performer?.accuracy || 0) > 0 && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200">
                                🎯
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="text-center py-12">
                        <div className="text-gray-500 dark:text-gray-400 text-lg">
                          No top performers data available
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
             </div>
         
             )}
           </div>

          <div className="text-center mt-12">
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-yellow-600 to-red-600 text-white rounded-xl font-semibold hover:from-yellow-700 hover:to-red-700 transition-all duration-300"
            >
              <span>Join the Competition</span>
              <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Levels Section */}
       <section id="levels" className="py-20 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-yellow-900/20 dark:to-red-900/20 pointer-events-none" />
         <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xl -md:text-xl md:text-3xl lg:text-4xl font-bold mb-4">
                             <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-600 dark:text-white">
                Progressive Learning Levels
              </span>
            </h2>
                         <p className="text-md md:text-md md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Start from Level 1 (Rookie) and progress through 10 levels each
              month. Reach (Level 10 and Minimum 110 Quizzes with ≥75% Accuracy) to
              qualify for monthly rewards!
             </p>
             
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {levels?.length > 0 ? levels.map((level, index) => {
              const levelColors = getLevelColors(level?.name);
              const levelInfo = levelsInfo?.find(
                (info) => info?.level === level?.level
              );
              const playCount = levelInfo ? levelInfo?.quizzes : 0;
              return (
                <div
                  key={level?._id || `level-${index}`}
                  className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 border shadow-lg hover:shadow-xl ${levelColors?.background} ${levelColors?.border} hover:border-yellow-500`}
                >
                   <div className={`absolute top-0 right-0 w-32 h-32 ${levelColors?.accent} rounded-full -translate-y-16 translate-x-16`}></div>
                   
                   <div className="relative z-10 text-center">
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto ${levelColors?.iconBg}`}>
                      {React.createElement(
                        levelBadgeIcons[level?.name] || levelBadgeIcons.Default,
                        {
                          className: `w-8 h-8 ${levelColors?.iconColor}`,
                        }
                      )}
                     </div>
                     
                     <h3 className={`text-xl font-bold mb-2 ${levelColors?.titleColor} text-center`}>
                       Level {level?.level || 0} - {level?.name || "Unknown"}
                     </h3>
                     <p className={`text-sm mb-4 ${levelColors?.descriptionColor} text-center`}>
                      {level?.description ||
                        `Level ${level?.level || 0} challenges`}
                     </p>
                     
                     <div className="grid grid-cols-2 gap-2 mb-3">
                       <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center shadow-lg">
                         <div className="text-lg font-bold text-yellow-600">
                           {level?.quizCount || "N/A"}
                         </div>
                         <div className="text-xs text-gray-600 dark:text-gray-300">
                           Total Quizzes
                         </div>
                       </div>
                       <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center shadow-lg">
                         <div className="text-lg font-bold text-green-600">
                           {levelInfo?.plan || "-"}
                         </div>
                         <div className="text-xs text-gray-600 dark:text-gray-300">
                           Plan
                         </div>
                       </div>
                       <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center shadow-lg">
                         <div className="text-lg font-bold text-red-600">
                           ₹{levelInfo?.amount || 0}
                         </div>
                         <div className="text-xs text-gray-600 dark:text-gray-300">
                           Amount
                         </div>
                       </div>
                       <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center shadow-lg">
                         <div className="text-lg font-bold text-yellow-600">
                           ₹{levelInfo?.prize || 0}
                         </div>
                         <div className="text-xs text-gray-600 dark:text-gray-300">
                           Prize {level?.level === 10 ? '(Monthly Top 3: ₹9,999)' : ''}
                         </div>
                       </div>
                     </div>
                     
                     <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center shadow-lg">

                     <div className="text-md text-gray-900 dark:text-white text-center mb-2 drop-shadow-sm">
                       <strong>{playCount} wins to level up!</strong> 
                     </div>
                     </div>
                     
                   </div>
                 </div>
              );
            }) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 text-lg">
                  No levels data available
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/register"
              className="inline-flex items-center space-x-2 px-4 md:px-8 py-2 md:py-3 bg-gradient-to-r from-yellow-600 to-red-600 text-white rounded-xl font-semibold hover:from-yellow-700 hover:to-red-700 transition-all duration-300"
            >
              <span>Start Your Journey</span>
              <FaArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

             {/* Categories Section */}
       <section id="categories" className="py-20 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-bl from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 pointer-events-none" />
         <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-4">
                             <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-600 dark:text-white">
                Explore Diverse Categories
              </span>
            </h2>
                         <p className="text-md md:text-md md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              From science to arts, technology to nature - discover quizzes that
              match your interests and expand your knowledge.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories?.length > 0 ? categories.map((category) => {
              const categoryColors = getCategoryColors(category?.name);
              return (
                <div
                  key={category?._id || `category-${Math.random()}`}
                  className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 border shadow-lg hover:shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm ${categoryColors?.border} hover:border-yellow-500`}
                >
                   <div className={`absolute top-0 right-0 w-32 h-32 ${categoryColors?.accent} rounded-full -translate-y-16 translate-x-16 opacity-60`}></div>
                   
                   <div className="relative z-10 text-center">
                     {/* Category Color Overlay */}
                     <div className={`absolute inset-0 ${categoryColors?.background} opacity-20 rounded-2xl pointer-events-none`}></div>
                     
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto ${categoryColors?.iconBg}`}>
                      {React.createElement(
                        categoryIcons[category.name] || categoryIcons.Default,
                        {
                          className: `w-8 h-8 ${categoryColors?.iconColor}`,
                        }
                      )}
                     </div>
                     
                     <h3 className={`text-xl font-bold mb-2 ${categoryColors?.titleColor} text-center`}>{category?.name || "Unknown Category"}</h3>
                     <p className={`text-sm mb-4 ${categoryColors?.descriptionColor} text-center`}>
                      {category?.description ||
                        `Explore ${category?.name || "this"} knowledge`}
                     </p>
                     
                     <div className="flex items-center justify-between text-sm">
                      <span className={categoryColors?.labelColor}>
                        Quizzes:
                      </span>
                      <span className={`font-semibold ${categoryColors?.valueColor}`}>
                        {category?.quizCount || "N/A"}
                      </span>
                     </div>
                   </div>
                 </div>
              );
            }) : (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 text-lg">
                  No categories data available
                </div>
              </div>
            )}
          </div>
        </div>
      </section>


      

             {/* Subscription Plans Section */}
       <section id="subscription" className="py-20 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 dark:from-gray-900 dark:via-violet-900/20 dark:to-indigo-900/20 pointer-events-none" />
         <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-4">
                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-600 dark:text-white">
                Choose Your Perfect Plan
              </span>
            </h2>
                         <p className="text-md md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Unlock unlimited potential with our flexible subscription plans.
              All users start at Level 0 monthly and compete fairly!
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Free Plan */}
                         <div className="relative rounded-md lg:rounded-2xl p-2 lg:p-4 xl:p-6 xxl:p-8 transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
               <div className="text-center mb-8">
                 <h3 className="text-xl lg:text-2xl font-bold mb-2">Free</h3>
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  ₹0
                </div>
                 <p className="text-gray-600 dark:text-gray-400">Forever</p>
               </div>
               
               <ul className="space-y-4 mb-8">
                 {[
                  "Access to levels 0-3",
                  "Basic quiz categories",
                  "Monthly leaderboard access",
                  "Standard support",
                  "Basic analytics",
                 ].map((feature, index) => (
                   <li key={index} className="flex items-center space-x-3">
                     <FaCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                   </li>
                 ))}
               </ul>
              
              <Link
                to="/register"
                className="block w-full text-center py-3 px-6 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Get Started Free
              </Link>
            </div>

                         {/* Basic Plan */}
                          <div className="relative rounded-md lg:rounded-2xl p-2 lg:p-4 xl:p-6 xxl:p-8 transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
               <div className="text-center mb-8">
                 <h3 className="text-xl lg:text-2xl font-bold mb-2">Basic</h3>
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  ₹9
                </div>
                 <p className="text-gray-600 dark:text-gray-400">per month</p>
               </div>
               
               <ul className="space-y-4 mb-8">
                 {[
                  "Access to levels 0-6",
                  "Advanced categories",
                  "Priority support",
                  "Detailed analytics",
                  "Custom study plans",
                  "Progress tracking",
                  "Monthly rewards eligibility",
                 ].map((feature, index) => (
                   <li key={index} className="flex items-center space-x-3">
                     <FaCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                   </li>
                 ))}
               </ul>
              
              <Link
                to="/register"
                className="block w-full text-center py-3 px-6 bg-gradient-to-r from-yellow-600 to-red-600 text-white rounded-xl font-semibold hover:from-yellow-700 hover:to-red-700 transition-all duration-300"
              >
                Start Basic Plan
              </Link>
            </div>

            {/* Premium Plan */}
                         <div className="relative rounded-md lg:rounded-2xl p-2 lg:p-4 xl:p-6 xxl:p-8 transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
               <div className="text-center mb-8">
                 <h3 className="text-xl lg:text-2xl font-bold mb-2">Premium</h3>
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  ₹49
                </div>
                 <p className="text-gray-600 dark:text-gray-400">per month</p>
               </div>
               
               <ul className="space-y-4 mb-8">
                 {[
                  "Access to levels 0-9",
                  "Exclusive premium quizzes",
                  "AI-powered recommendations",
                  "24/7 priority support",
                  "Advanced analytics",
                  "Personal mentor access",
                  "Custom quiz creation",
                  "Exclusive monthly rewards",
                  "Early access features",
                 ].map((feature, index) => (
                   <li key={index} className="flex items-center space-x-3">
                     <FaCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                   </li>
                 ))}
               </ul>
              
              <Link
                to="/register"
                className="block w-full text-center py-3 px-6 bg-gradient-to-r from-yellow-600 to-red-600 text-white rounded-xl font-semibold hover:from-yellow-700 hover:to-red-700 transition-all duration-300"
              >
                Start Premium Plan
              </Link>
            </div>

                         {/* Pro Plan */}
                          <div className="relative rounded-2xl p-2 lg:p-4 xl:p-6 xxl:p-8 transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-800 border-2 border-yellow-500 shadow-xl">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Popular
                  </span>
                </div>
               <div className="text-center mb-8">
                 <h3 className="text-xl lg:text-2xl font-bold mb-2">Pro</h3>
                <div className="text-4xl font-bold text-yellow-600 mb-2">
                  ₹99
                </div>
                 <p className="text-gray-600 dark:text-gray-400">per month</p>
               </div>
               
               <ul className="space-y-4 mb-8">
                 {[
                  "Access to all levels 0-10",
                  "Everything in Premium",
                  "AI-powered recommendations",
                  "24/7 priority support",
                  "Advanced analytics",
                  "Personal mentor access",
                  "Custom quiz creation",
                  "Exclusive monthly rewards",
                  "Early access features",
                  "Data export & API access",
                 ].map((feature, index) => (
                   <li key={index} className="flex items-center space-x-3">
                     <FaCheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                   </li>
                 ))}
               </ul>
              
              <Link
                to="/register"
                className="block w-full text-center py-3 px-6 bg-gradient-to-r from-yellow-600 to-red-600 text-white rounded-xl font-semibold hover:from-yellow-700 hover:to-red-700 transition-all duration-300"
              >
                Start Pro Plan
              </Link>
            </div>
          </div>

          {/* Plan Comparison */}
                     <div className="rounded-2xl p-2 md:-p-6 lg:p-6 xl:p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
            <h3 className="text-xl lg:text-2xl font-bold text-center mb-8">
              Plan Comparison
            </h3>
             <div className="overflow-x-auto">
               <table className="w-full">
                 <thead>
                   <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-6 text-gray-700 dark:text-gray-300">
                      Features
                    </th>
                    <th className="text-center py-4 px-6 text-gray-700 dark:text-gray-300">
                      Free
                    </th>
                    <th className="text-center py-4 px-6 text-gray-700 dark:text-gray-300">
                      Basic
                    </th>
                    <th className="text-center py-4 px-6 text-gray-700 dark:text-gray-300">
                      Premium
                    </th>
                    <th className="text-center py-4 px-6 text-gray-700 dark:text-gray-300">
                      Pro
                    </th>
                   </tr>
                 </thead>
                 <tbody>
                   {[
                    {
                      feature: "Level Access",
                      free: "0-3",
                      basic: "0-6",
                      premium: "0-9",
                      pro: "0-10",
                    },
                    {
                      feature: "Categories Access",
                      free: "Basic",
                      basic: "Advanced",
                      premium: "Premium + Custom",
                      pro: "All + Custom",
                    },
                    {
                      feature: "Support",
                      free: "Standard",
                      basic: "Priority",
                      premium: "24/7 Priority",
                      pro: "24/7 Priority",
                    },
                    {
                      feature: "Analytics",
                      free: "Basic",
                      basic: "Detailed",
                      premium: "Advanced + AI",
                      pro: "Advanced + AI + Export",
                    },
                    {
                      feature: "Monthly Rewards",
                      free: "Eligible",
                      basic: "Eligible",
                      premium: "Eligible",
                      pro: "Eligible",
                    },
                   ].map((row, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 dark:border-gray-700"
                    >
                       <td className="py-4 px-6 font-medium text-gray-700 dark:text-gray-300">
                         {row.feature}
                       </td>
                       <td className="text-center py-4 px-6 text-gray-600 dark:text-gray-400">
                         {row.free}
                       </td>
                       <td className="text-center py-4 px-6 text-gray-600 dark:text-gray-400">
                         {row.basic}
                       </td>
                       <td className="text-center py-4 px-6 text-gray-600 dark:text-gray-400">
                         {row.premium}
                       </td>
                       <td className="text-center py-4 px-6 text-gray-600 dark:text-gray-400">
                         {row.pro}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
           </div>
        </div>
      </section>

             {/* Features Section */}
       <section className="py-20 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-tl from-cyan-50 via-blue-50 to-sky-50 dark:from-gray-900 dark:via-cyan-900/20 dark:to-sky-900/20 pointer-events-none" />
         <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-4">
                           <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-600 dark:text-white">
                                 Why Choose SUBG QUIZ?
              </span>
            </h2>
                         <p className="text-md md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Experience the best quiz platform with monthly reset system, fair
              competition, and cutting-edge features designed for modern
              learners.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: FaMobileAlt,
                title: "Mobile First",
                description:
                  "Optimized for all devices - learn anywhere, anytime",
              },
              {
                icon: FaShieldAlt,
                title: "Secure Platform",
                description: "Your data and progress are completely secure",
              },
              {
                icon: FaHeadset,
                title: "24/7 Support",
                description: "Get help whenever you need it",
              },
              {
                icon: FaDesktop,
                title: "Cross Platform",
                description: "Seamless experience across all devices",
              },
              {
                icon: FaTabletAlt,
                title: "Responsive Design",
                description: "Perfect experience on any screen size",
              },
              {
                icon: FaGift,
                title: "Monthly Rewards",
                description: "Compete monthly for ₹9,999 prize pool",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-yellow-500 shadow-lg hover:shadow-xl"
              >
                 <div className="w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center bg-yellow-100 dark:bg-gray-700">
                   <feature.icon className="w-8 h-8 text-yellow-600" />
                 </div>
                 <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                 <p className="text-gray-600 dark:text-gray-400">
                   {feature.description}
                 </p>
               </div>
            ))}
          </div>
        </div>
      </section>

         

          {/* Referral System Section */}
          <section id="referrals" className="py-20 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 dark:from-gray-900 dark:via-pink-900/20 dark:to-rose-900/20 pointer-events-none" />
         <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-600 dark:text-white">
                Refer & Earn Rewards
              </span>
            </h2>
            <p className="text-md md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Invite your friends and family to join SUBG QUIZ. Earn
              subscription plan upgrades as referral milestones!
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                {[
                  {
                    icon: FaUsers,
                    title: "Invite Friends",
                    description:
                      "Share your unique referral code with friends and family",
                  },
                  {
                    icon: FaGift,
                    title: "Earn Plans",
                    description:
                      "Get subscription plan upgrades at referral milestones",
                  },
                  {
                    icon: FaTrophy,
                    title: "Milestone Rewards",
                    description:
                      "2 referrals = Basic, 5 = Premium, 10 = Pro plan",
                  },
                  {
                    icon: FaCheckCircle,
                    title: "Smart Upgrades",
                    description:
                      "Only upgrade if new plan is better than current",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                                                                                   <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-yellow-100 dark:bg-gray-800">
                       <feature.icon className="w-6 h-6 text-yellow-600" />
                     </div>
                     <div>
                      <h3 className="text-lg font-semibold mb-2">
                        {feature.title}
                      </h3>
                       <p className="text-gray-600 dark:text-gray-400">
                         {feature.description}
                       </p>
                     </div>
                  </div>
                ))}
              </div>
            </div>

                         <div className="rounded-2xl p-2 md:-p-6 lg:p-6 xl:p-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
              <h3 className="text-xl lg:text-2xl font-bold mb-6 text-center">
                How It Works
              </h3>
               <div className="space-y-6">
                 <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                   <div>
                     <h4 className="font-semibold">Sign Up</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Create your account
                    </p>
                   </div>
                 </div>
                 <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                   <div>
                     <h4 className="font-semibold">Get Referral Code</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Copy your Referral Code
                    </p>
                   </div>
                 </div>
                 <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-yellow-600 text-white rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                   <div>
                     <h4 className="font-semibold">Share & Earn</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Invite friends and get rewards
                    </p>
                   </div>
                 </div>
               </div>
              
              <div className="mt-8 text-center">
                <Link
                  to="/register"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-yellow-600 to-red-600 text-white rounded-xl font-semibold hover:from-yellow-700 hover:to-red-700 transition-all duration-300"
                >
                  <span>Start Referring</span>
                  <FaArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Rewards */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center my-16">
            <h3 className="text-xl lg:text-2xl font-bold mb-8">
              Referral Milestone Rewards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: FaStar,
                  name: "2 Referrals",
                  description: "Get Basic Plan (₹9/month) for 30 days",
                  reward: "₹9",
                },
                {
                  icon: FaGem,
                  name: "5 Referrals",
                  description: "Get Premium Plan (₹49/month) for 30 days",
                  reward: "₹49",
                },
                {
                  icon: FaCrown,
                  name: "10 Referrals",
                  description: "Get Pro Plan (₹99/month) for 30 days",
                  reward: "₹99",
                },
              ].map((badge, index) => (
                <div
                  key={index}
                  className="p-6 rounded-2xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-yellow-500 shadow-lg hover:shadow-xl"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-yellow-100 dark:bg-gray-700">
                    <badge.icon className="w-8 h-8 text-yellow-600" />
                  </div>
                  <h4 className="font-semibold mb-2">{badge.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {badge.description}
                  </p>
                  <div className="text-lg font-bold text-green-600">
                    {badge.reward}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

             {/* CTA Section */}
       <section className="py-20 relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 dark:from-gray-800 dark:via-yellow-800/30 dark:to-red-800/30 pointer-events-none" />
         <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-6">
                       <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-600 dark:text-white">
              Ready to Start Your Learning Journey?
            </span>
          </h2>
                     <p className="text-md md:text-xl mb-8 text-gray-600 dark:text-gray-300">
            Join thousands of students who are already improving their knowledge
            monthly and competing for ₹9,999 prize pool every month!
           </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-4 md:px-8 py-2 md:py-4 bg-gradient-to-r from-yellow-600 to-red-600 text-white rounded-xl font-semibold text-lg hover:from-yellow-700 hover:to-red-700 transition-all duration-300 transform hover:scale-105"
            >
              Get Started Free
            </Link>
            <Link
              to="/how-it-works"
              className="px-4 md:px-8 py-2 md:py-4 border-2 border-yellow-600 text-yellow-600 dark:text-yellow-400 rounded-xl font-semibold text-lg hover:bg-yellow-600 hover:text-white dark:hover:bg-yellow-600 dark:hover:text-white transition-all duration-300"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

        {/* Unified Footer */}
        <UnifiedFooter isLandingPage={true} />
      </div>
    </MobileAppWrapper>
  );
};

// Level color mappings for both light and dark modes
const getLevelColors = (levelName) => {
  const colors = {
    Starter: {
      background: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
      border: 'border-blue-200 dark:border-blue-700',
      accent: 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20',
      iconBg: 'bg-blue-100 dark:bg-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400',
      titleColor: 'text-blue-800 dark:text-blue-200',
      descriptionColor: 'text-blue-700 dark:text-blue-300',
      labelColor: 'text-blue-600 dark:text-blue-400',
      valueColor: 'text-blue-800 dark:text-blue-200'
    },
    Rookie: {
      background: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      border: 'border-green-200 dark:border-green-700',
      accent: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
      iconBg: 'bg-green-100 dark:bg-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
      titleColor: 'text-green-800 dark:text-green-200',
      descriptionColor: 'text-green-700 dark:text-green-300',
      labelColor: 'text-green-600 dark:text-green-400',
      valueColor: 'text-green-800 dark:text-green-200'
    },
    Explorer: {
      background: 'bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20',
      border: 'border-purple-200 dark:border-purple-700',
      accent: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20',
      iconBg: 'bg-purple-100 dark:bg-purple-800',
      iconColor: 'text-purple-600 dark:text-purple-400',
      titleColor: 'text-purple-800 dark:text-purple-200',
      descriptionColor: 'text-purple-700 dark:text-purple-300',
      labelColor: 'text-purple-600 dark:text-purple-400',
      valueColor: 'text-purple-800 dark:text-purple-200'
    },
    Thinker: {
      background: 'bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
      border: 'border-orange-200 dark:border-orange-700',
      accent: 'bg-gradient-to-br from-orange-500/20 to-amber-500/20',
      iconBg: 'bg-orange-100 dark:bg-orange-800',
      iconColor: 'text-orange-600 dark:text-orange-400',
      titleColor: 'text-orange-800 dark:text-orange-200',
      descriptionColor: 'text-orange-700 dark:text-orange-300',
      labelColor: 'text-orange-600 dark:text-orange-400',
      valueColor: 'text-orange-800 dark:text-orange-200'
    },
    Strategist: {
      background: 'bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20',
      border: 'border-teal-200 dark:border-teal-700',
      accent: 'bg-gradient-to-br from-teal-500/20 to-cyan-500/20',
      iconBg: 'bg-teal-100 dark:bg-teal-800',
      iconColor: 'text-teal-600 dark:text-teal-400',
      titleColor: 'text-teal-800 dark:text-teal-200',
      descriptionColor: 'text-teal-700 dark:text-teal-300',
      labelColor: 'text-teal-600 dark:text-teal-400',
      valueColor: 'text-teal-800 dark:text-teal-200'
    },
    Achiever: {
      background: 'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
      border: 'border-red-200 dark:border-red-700',
      accent: 'bg-gradient-to-br from-red-500/20 to-pink-500/20',
      iconBg: 'bg-red-100 dark:bg-red-800',
      iconColor: 'text-red-600 dark:text-red-400',
      titleColor: 'text-red-800 dark:text-red-200',
      descriptionColor: 'text-red-700 dark:text-red-300',
      labelColor: 'text-red-600 dark:text-red-400',
      valueColor: 'text-red-800 dark:text-red-200'
    },
    Mastermind: {
      background: 'bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20',
      border: 'border-indigo-200 dark:border-indigo-700',
      accent: 'bg-gradient-to-br from-indigo-500/20 to-blue-500/20',
      iconBg: 'bg-indigo-100 dark:bg-indigo-800',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      titleColor: 'text-indigo-800 dark:text-indigo-200',
      descriptionColor: 'text-indigo-700 dark:text-indigo-300',
      labelColor: 'text-indigo-600 dark:text-indigo-400',
      valueColor: 'text-indigo-800 dark:text-indigo-200'
    },
    Champion: {
      background: 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20',
      border: 'border-yellow-200 dark:border-yellow-700',
      accent: 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20',
      iconBg: 'bg-yellow-100 dark:bg-yellow-800',
      iconColor: 'text-yellow-600 dark:text-yellow-400',
      titleColor: 'text-yellow-800 dark:text-yellow-200',
      descriptionColor: 'text-yellow-700 dark:text-yellow-300',
      labelColor: 'text-yellow-600 dark:text-yellow-400',
      valueColor: 'text-yellow-800 dark:text-yellow-200'
    },
    Prodigy: {
      background: 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
      border: 'border-emerald-200 dark:border-emerald-700',
      accent: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20',
      iconBg: 'bg-emerald-100 dark:bg-emerald-800',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      titleColor: 'text-emerald-800 dark:text-emerald-200',
      descriptionColor: 'text-emerald-700 dark:text-emerald-300',
      labelColor: 'text-emerald-600 dark:text-emerald-400',
      valueColor: 'text-emerald-800 dark:text-emerald-200'
    },
    Wizard: {
      background: 'bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20',
      border: 'border-violet-200 dark:border-violet-700',
      accent: 'bg-gradient-to-br from-violet-500/20 to-purple-500/20',
      iconBg: 'bg-violet-100 dark:bg-violet-800',
      iconColor: 'text-violet-600 dark:text-violet-400',
      titleColor: 'text-violet-800 dark:text-violet-200',
      descriptionColor: 'text-violet-700 dark:text-violet-300',
      labelColor: 'text-violet-600 dark:text-violet-400',
      valueColor: 'text-violet-800 dark:text-violet-200'
    },
    Legend: {
      background: 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
      border: 'border-amber-200 dark:border-amber-700',
      accent: 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20',
      iconBg: 'bg-amber-100 dark:bg-amber-800',
      iconColor: 'text-amber-600 dark:text-amber-400',
      titleColor: 'text-amber-800 dark:text-amber-200',
      descriptionColor: 'text-amber-700 dark:text-amber-300',
      labelColor: 'text-amber-600 dark:text-amber-400',
      valueColor: 'text-amber-800 dark:text-amber-200'
    }
  };
  
  return colors[levelName] || colors.Starter; // Default to Starter colors if level not found
};

// Category color mappings for both light and dark modes
const getCategoryColors = (categoryName) => {
  const colors = {
    "General Knowledge": {
      background: 'bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/20 dark:to-slate-900/20',
      border: 'border-gray-200 dark:border-gray-700',
      accent: 'bg-gradient-to-br from-gray-500/20 to-slate-500/20',
      iconBg: 'bg-gray-100 dark:bg-gray-800',
      iconColor: 'text-gray-600 dark:text-gray-400',
      titleColor: 'text-gray-800 dark:text-gray-200',
      descriptionColor: 'text-gray-700 dark:text-gray-300',
      labelColor: 'text-gray-600 dark:text-gray-400',
      valueColor: 'text-gray-800 dark:text-gray-200'
    },
    "Current Affairs": {
      background: 'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20',
      border: 'border-red-200 dark:border-red-700',
      accent: 'bg-gradient-to-br from-red-500/20 to-pink-500/20',
      iconBg: 'bg-red-100 dark:bg-red-800',
      iconColor: 'text-red-600 dark:text-red-400',
      titleColor: 'text-red-800 dark:text-red-200',
      descriptionColor: 'text-red-700 dark:text-red-300',
      labelColor: 'text-red-600 dark:text-red-400',
      valueColor: 'text-red-800 dark:text-red-200'
    },
    "Science": {
      background: 'bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20',
      border: 'border-blue-200 dark:border-blue-700',
      accent: 'bg-gradient-to-br from-blue-500/20 to-cyan-500/20',
      iconBg: 'bg-blue-100 dark:bg-blue-800',
      iconColor: 'text-blue-600 dark:text-blue-400',
      titleColor: 'text-blue-800 dark:text-blue-200',
      descriptionColor: 'text-blue-700 dark:text-blue-300',
      labelColor: 'text-blue-600 dark:text-blue-400',
      valueColor: 'text-blue-800 dark:text-blue-200'
    },
    "Mathematics": {
      background: 'bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20',
      border: 'border-orange-200 dark:border-orange-700',
      accent: 'bg-gradient-to-br from-orange-500/20 to-red-500/20',
      iconBg: 'bg-orange-100 dark:bg-orange-800',
      iconColor: 'text-orange-600 dark:text-orange-400',
      titleColor: 'text-orange-800 dark:text-orange-200',
      descriptionColor: 'text-orange-700 dark:text-orange-300',
      labelColor: 'text-orange-600 dark:text-orange-400',
      valueColor: 'text-orange-800 dark:text-orange-200'
    },
    "History": {
      background: 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
      border: 'border-amber-200 dark:border-amber-700',
      accent: 'bg-gradient-to-br from-amber-500/20 to-yellow-500/20',
      iconBg: 'bg-amber-100 dark:bg-amber-800',
      iconColor: 'text-amber-600 dark:text-amber-400',
      titleColor: 'text-amber-800 dark:text-amber-200',
      descriptionColor: 'text-amber-700 dark:text-amber-300',
      labelColor: 'text-amber-600 dark:text-amber-400',
      valueColor: 'text-amber-800 dark:text-amber-200'
    },
    "Geography": {
      background: 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20',
      border: 'border-green-200 dark:border-green-700',
      accent: 'bg-gradient-to-br from-green-500/20 to-emerald-500/20',
      iconBg: 'bg-green-100 dark:bg-green-800',
      iconColor: 'text-green-600 dark:text-green-400',
      titleColor: 'text-green-800 dark:text-green-200',
      descriptionColor: 'text-green-700 dark:text-green-300',
      labelColor: 'text-green-600 dark:text-green-400',
      valueColor: 'text-green-800 dark:text-green-200'
    },
    "Sports": {
      background: 'bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20',
      border: 'border-emerald-200 dark:border-emerald-700',
      accent: 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20',
      iconBg: 'bg-emerald-100 dark:bg-emerald-800',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
      titleColor: 'text-emerald-800 dark:text-emerald-200',
      descriptionColor: 'text-emerald-700 dark:text-emerald-300',
      labelColor: 'text-emerald-600 dark:text-emerald-400',
      valueColor: 'text-emerald-800 dark:text-emerald-200'
    },
    "Entertainment": {
      background: 'bg-gradient-to-br from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20',
      border: 'border-pink-200 dark:border-pink-700',
      accent: 'bg-gradient-to-br from-pink-500/20 to-rose-500/20',
      iconBg: 'bg-pink-100 dark:bg-pink-800',
      iconColor: 'text-pink-600 dark:text-pink-400',
      titleColor: 'text-pink-800 dark:text-pink-200',
      descriptionColor: 'text-pink-700 dark:text-pink-300',
      labelColor: 'text-pink-600 dark:text-pink-400',
      valueColor: 'text-pink-800 dark:text-pink-200'
    },
    "Technology": {
      background: 'bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20',
      border: 'border-indigo-200 dark:border-indigo-700',
      accent: 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20',
      iconBg: 'bg-indigo-100 dark:bg-indigo-800',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      titleColor: 'text-indigo-800 dark:text-indigo-200',
      descriptionColor: 'text-indigo-700 dark:text-indigo-300',
      labelColor: 'text-indigo-600 dark:text-indigo-400',
      valueColor: 'text-indigo-800 dark:text-indigo-200'
    },
    "Literature & Language": {
      background: 'bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20',
      border: 'border-violet-200 dark:border-violet-700',
      accent: 'bg-gradient-to-br from-violet-500/20 to-purple-500/20',
      iconBg: 'bg-violet-100 dark:bg-violet-800',
      iconColor: 'text-violet-600 dark:text-violet-400',
      titleColor: 'text-violet-800 dark:text-violet-200',
      descriptionColor: 'text-violet-700 dark:text-violet-300',
      labelColor: 'text-violet-600 dark:text-violet-400',
      valueColor: 'text-violet-800 dark:text-violet-200'
    },
    "Competitive Exams": {
      background: 'bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20',
      border: 'border-sky-200 dark:border-sky-700',
      accent: 'bg-gradient-to-br from-sky-500/20 to-blue-500/20',
      iconBg: 'bg-sky-100 dark:bg-sky-800',
      iconColor: 'text-sky-600 dark:text-sky-400',
      titleColor: 'text-sky-800 dark:text-sky-200',
      descriptionColor: 'text-sky-700 dark:text-sky-300',
      labelColor: 'text-sky-600 dark:text-sky-400',
      valueColor: 'text-sky-800 dark:text-sky-200'
    },
    "Economics": {
      background: 'bg-gradient-to-br from-lime-50 to-green-50 dark:from-lime-900/20 dark:to-green-900/20',
      border: 'border-lime-200 dark:border-lime-700',
      accent: 'bg-gradient-to-br from-lime-500/20 to-green-500/20',
      iconBg: 'bg-lime-100 dark:bg-lime-800',
      iconColor: 'text-lime-600 dark:text-lime-400',
      titleColor: 'text-lime-800 dark:text-lime-200',
      descriptionColor: 'text-lime-700 dark:text-lime-300',
      labelColor: 'text-lime-600 dark:text-lime-400',
      valueColor: 'text-lime-800 dark:text-lime-200'
    }
  };
  
  return colors[categoryName] || colors.General; // Default to General colors if category not found
};

// Icon mappings
const categoryIcons = {
  "General Knowledge": FaBook,
  "Current Affairs": FaNewspaper,
  "Science": FaFlask,
  "Mathematics": FaCalculator,
  "History": FaHistory,
  "Geography": FaGlobe,
  "Sports": FaFutbol,
  "Entertainment": FaFilm,
  "Technology": FaLaptopCode,
  "Literature & Language": FaLanguage,
  "Competitive Exams": FaGraduationCap,
  "Economics": FaDollarSign,
};

const levelBadgeIcons = {
  Starter: FaUserGraduate,
  Rookie: FaStar,
  Explorer: FaRocket,
  Thinker: FaBrain,
  Strategist: FaChartLine,
  Achiever: FaAward,
  Mastermind: FaGem,
  Champion: FaTrophy,
  Prodigy: FaMedal,
  Wizard: FaMagic,
  Legend: FaCrown,
  Default: FaStar,
};

// Level play count info for display (monthly cumulative wins, monthly pricing)
const levelsInfo = [
  { level: 1, quizzes: 2, plan: "Free", amount: 0, prize: 0 },
  { level: 2, quizzes: 6, plan: "Free", amount: 0, prize: 0 },
  { level: 3, quizzes: 12, plan: "Free", amount: 0, prize: 0 },
  { level: 4, quizzes: 20, plan: "Basic", amount: 9, prize: 0 },
  { level: 5, quizzes: 30, plan: "Basic", amount: 9, prize: 0 },
  { level: 6, quizzes: 42, plan: "Basic", amount: 9, prize: 0 },
  { level: 7, quizzes: 56, plan: "Premium", amount: 49, prize: 0 },
  { level: 8, quizzes: 72, plan: "Premium", amount: 49, prize: 0 },
  { level: 9, quizzes: 90, plan: "Premium", amount: 49, prize: 0 },
  { level: 10, quizzes: 110, plan: "Pro", amount: 99, prize: 9999 },
];

export default LandingPage;
