import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  FaLeaf,
  FaUserGraduate,
  FaLayerGroup,
  FaClock,
  FaQuestionCircle,
  FaUserCircle,
  FaLevelUpAlt,
  FaArrowRight,
} from "react-icons/fa";
import { FaMagic } from "react-icons/fa";
import API from "../utils/api";
import { hasActiveSubscription } from "../utils/subscriptionUtils";
import QuizStartModal from "../components/QuizStartModal";
import TopPerformers from "../components/TopPerformers";
import SystemUpdateModal from "../components/SystemUpdateModal";
import { BsSearch } from "react-icons/bs";
import MonthlyWinnersDisplay from "../components/MonthlyWinnersDisplay";
import MobileAppWrapper from "../components/MobileAppWrapper";
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

// Level badge icons
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

const HomePage = () => {
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem("token");
  const navigate = useNavigate();
  const location = useLocation();
  const [homeData, setHomeData] = useState(null);
  const [userLevelData, setUserLevelData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showSystemUpdateModal, setShowSystemUpdateModal] = useState(false);
  console.log(userLevelData, "userLevelData");
  
  useEffect(() => {
    fetchHomePageData();
    fetchCategories();
    fetchLevels();
    // Show system update modal for first-time visitors
    const hasSeenModal = localStorage.getItem('hasSeenSystemUpdateModal');
    if (!hasSeenModal) {
      setTimeout(() => {
        setShowSystemUpdateModal(true);
      }, 1000); // Show after 1 second
    }
  }, []);

  // Refresh data when navigating back to home page (e.g., from quiz result)
  useEffect(() => {
    // Check if we're coming from a quiz completion
    if (location.state?.fromQuizCompletion || location.state?.refreshHomeData) {
      fetchHomePageData();
    }
  }, [location.state]);



  const fetchHomePageData = async () => {
    try {
      setLoading(true);
      const res = await API.getHomePageData();
      if (res?.success) {
        setHomeData(res.data);
        setUserLevelData(res.userLevel);
      } else {
        console.log("HomePage Data:", res);
        setError(res.message || "Failed to load home page data");
      }
    } catch (err) {
      console.log("HomePage Data:", err);
      // Try to show a more specific error message if available
      let msg = err?.response?.data?.message || err?.message || err?.toString();
      if (msg && msg !== "[object Object]") {
        setError(msg);
      } else {
        setError("Failed to load home page data");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Use the new public API endpoint for categories
      const res = await API.request("/api/public/categories");
      if (res?.success && Array.isArray(res.data)) {
        setCategories(res.data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      setCategories([]);
    }
  };

  const fetchLevels = async () => {
    try {
      const res = await API.getAllLevels();
      if (res?.success && Array.isArray(res.data)) {
        // Filter out Starter level (Level 0) just like landing page
        const filteredLevels = res.data.filter(
          (level) => level.level !== 0
        );
        setLevels(filteredLevels);
      } else {
        // Fallback data if API fails - same structure as landing page
        const fallbackLevels = [
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
          {
            level: 5,
            name: "Achiever",
            description: "Achieve excellence",
            quizCount: 50,
            quizzesRequired: 30,
          },
          {
            level: 6,
            name: "Mastermind",
            description: "Become a master",
            quizCount: 55,
            quizzesRequired: 42,
          },
          {
            level: 7,
            name: "Champion",
            description: "Champion level",
            quizCount: 60,
            quizzesRequired: 56,
          },
          {
            level: 8,
            name: "Prodigy",
            description: "Prodigy level",
            quizCount: 65,
            quizzesRequired: 72,
          },
          {
            level: 9,
            name: "Wizard",
            description: "Wizard level",
            quizCount: 70,
            quizzesRequired: 90,
          },
          {
            level: 10,
            name: "Legend",
            description: "Legendary status",
            quizCount: 75,
            quizzesRequired: 110,
          }
        ];
        setLevels(fallbackLevels);
      }
    } catch (err) {
      // Fallback data if API fails - same structure as landing page
      const fallbackLevels = [
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
        {
          level: 5,
          name: "Achiever",
          description: "Achieve excellence",
          quizCount: 50,
          quizzesRequired: 30,
        },
        {
          level: 6,
          name: "Mastermind",
          description: "Become a master",
          quizCount: 55,
          quizzesRequired: 42,
        },
        {
          level: 7,
          name: "Champion",
          description: "Champion level",
          quizCount: 60,
          quizzesRequired: 56,
        },
        {
          level: 8,
          name: "Prodigy",
          description: "Prodigy level",
          quizCount: 65,
          quizzesRequired: 72,
        },
        {
          level: 9,
          name: "Wizard",
          description: "Wizard level",
          quizCount: 70,
          quizzesRequired: 90,
        },
        {
          level: 10,
          name: "Legend",
          description: "Legendary status",
          quizCount: 75,
          quizzesRequired: 110,
        }
      ];
      setLevels(fallbackLevels);
    }
  };

  const handleQuizAttempt = (quiz) => {
    setSelectedQuiz(quiz);
    setShowQuizModal(true);
  };

  const handleConfirmQuizStart = () => {
    setShowQuizModal(false);
    if (selectedQuiz) {
      navigate(`/attempt-quiz/${selectedQuiz._id}`, {
        state: { quizData: selectedQuiz, fromPage: "home" },
      });
    }
  };

  const handleCancelQuizStart = () => {
    setShowQuizModal(false);
    setSelectedQuiz(null);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-subg-light dark:bg-subg-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-2 border-gray-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Loading your quiz dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Only block the whole page for generic errors, not subscription errors or 'Not authorized' (allow public homepage)
  if (
    error &&
    !error.toLowerCase().includes("subscription") &&
    error.toLowerCase() !== "not authorized"
  ) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-red-50 to-yellow-100 dark:from-gray-900 dark:via-red-900 dark:to-yellow-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">⚠️</div>
          <p className="text-red-600 text-lg">{error}</p>
        </div>
      </div>
    );
  }
  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/search", { state: { searchQuery: searchQuery?.trim() } });
  };
  return (
    <MobileAppWrapper title="Home">
      <div className="relative min-h-screen bg-subg-light dark:bg-subg-dark overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/10 via-red-600/10 to-indigo-600/10 pointer-events-none" />
        <div className="relative container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-12 md:py-16 lg:py-20 flex flex-col items-center">
          <div className="text-center">
            <h1 className="flex-col md:flex-row justify-center md:justify-items-start flex flex-wrap items-center gap-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-extrabold mb-3 sm:mb-4 md:mb-6 lg:mb-8 drop-shadow-lg animate-fade-in">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 dark:text-white">
                Welcome to
              </span>{" "}
              <span className="inline-block animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500">
                SUBG QUIZ!
              </span>
              <span
                className="inline-block"
                style={{
                  color: "initial",
                  background: "none",
                  WebkitBackgroundClip: "unset",
                  WebkitTextFillColor: "initial",
                }}
              >
                🎯
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-700 dark:text-gray-200 mb-3 sm:mb-4 md:mb-6 lg:mb-8 max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto animate-fade-in delay-100 px-4 sm:px-0">
              Explore quizzes by{" "}
              <span className="font-bold text-yellow-600 dark:text-yellow-300">
                level
              </span>
              ,{" "}
              <span className="font-bold text-red-600 dark:text-red-300">
                category
              </span>
              , or{" "}
              <span className="font-bold text-indigo-600 dark:text-indigo-300">
                subcategory
              </span>
              . <br className="hidden sm:block" />
              Only{" "}
              <span className="font-semibold text-green-600 dark:text-green-400">
                new quizzes
              </span>{" "}
              you haven't attempted are shown!
            </p>

            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 mb-3 sm:mb-4 md:mb-6 lg:mb-8 drop-shadow-lg animate-fade-in px-4 sm:px-0">
              Student Unknown's Battle Ground Quiz!
            </h2>

            {/* Search Box */}
            {isLoggedIn && (
              <div className="hidden md:flex justify-center w-full mb-6 sm:mb-8 animate-fade-in delay-150 px-4 sm:px-0">
                <form
                  onSubmit={handleSearch}
                  className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg"
                >
                  <input
                    type="text"
                    placeholder="Search quizzes, categories, subcategories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full py-2 sm:py-3 md:py-4 pl-4 sm:pl-5 md:pl-6 pr-10 sm:pr-12 rounded-full shadow-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200 text-sm sm:text-base md:text-lg"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 p-1.5 sm:p-2 md:p-2.5 text-white bg-gradient-to-r from-yellow-500 to-red-600 rounded-full hover:scale-105 transition-all duration-200"
                  >
                    <BsSearch className="text-lg sm:text-xl md:text-2xl text-white" />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Monthly Winners Section */}
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12 z-10">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600 dark:text-white">
              🏆 Previous Month Legends
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
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

      {/* Top Performers Section */}
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12 z-10">
        <TopPerformers />
      </div>


      {/* Hero Section */}
      <div className="text-center mb-8 sm:mb-10 md:mb-12 mt-8 sm:mt-10 md:mt-12 z-10 px-4 sm:px-0">
        <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 bg-gradient-to-tr from-yellow-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl sm:shadow-2xl animate-float">
          <FaTrophy className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl drop-shadow-lg" />
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-red-500 to-indigo-600 dark:text-white mb-2 sm:mb-3 md:mb-4 drop-shadow-lg">
          Level Progression System
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-700 dark:text-gray-200 font-medium">
          Journey from{" "}
          <span className="font-bold text-yellow-600 dark:text-yellow-300">
            Starter
          </span>{" "}
          to{" "}
          <span className="font-bold text-red-600 dark:text-red-300">
            Legend
          </span>{" "}
          through{" "}
          <span className="font-bold text-green-600 dark:text-green-400">
            11 exciting levels
          </span>
        </p>
      </div>

      {/* All Levels and Categories sections are hidden if subscription is required */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 z-10 mt-8 sm:mt-12 md:mt-16">
        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Scholarship Info */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 border border-yellow-200 dark:border-yellow-700 hover:scale-[1.02] sm:hover:scale-[1.03] hover:shadow-yellow-200/40 transition-all duration-300">
            <div className="flex items-center justify-start gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <FaAward className="text-white text-lg sm:text-xl md:text-2xl" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                Scholarship & Prizes
              </h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                Only the top 1–3 ranked users in Level 10 (
                <span className="font-bold text-orange-600">Legend</span>) win
                scholarships and prizes!
              </p>
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1 sm:mb-2">
                    ₹9,999
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    Level 10 Top 3 prize split 3:2:1
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Monthly Top 3 at Level 10 with ≥75% accuracy win ₹9,999
                  </div>
                </div>
              </div>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                Reach Level 10 with high accuracy to qualify for monthly prizes!
              </p>
            </div>
          </div>

          {/* Progression Rules */}
          <div className="bg-gradient-to-br from-yellow-50 to-red-100 dark:from-yellow-900/30 dark:to-red-900/30 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 border border-yellow-200 dark:border-yellow-700 hover:scale-[1.02] sm:hover:scale-[1.03] hover:shadow-yellow-200/40 transition-all duration-300">
            <div className="flex items-center justify-start gap-4 mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-yellow-500 to-red-500 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <FaGem className="text-white text-lg sm:text-xl md:text-2xl" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white">
                Progression Rules
              </h3>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  Only quizzes with{" "}
                  <span className="font-bold text-green-600">
                    75% or higher score
                  </span>{" "}
                  count towards level progression
                </p>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  Achieve high scores consistently to advance through levels
                </p>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-red-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  Focus on quality over quantity - aim for excellence in every
                  quiz!
                </p>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-yellow-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  Every month, your progress resets to encourage fresh learning and growth
                </p>
              </div>
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="w-5 h-5 sm:w-6 sm:h-6 bg-pink-500 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                </div>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  Compete each month for the Top 3 prize!
                </p>
              </div>
            </div>
          </div>
        </div>

        </div>  

        {/* Progressive Learning Levels Section */}
      <div className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-gray-900 dark:via-yellow-900/20 dark:to-red-900/20 pointer-events-none" />
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-xl md:text-3xl lg:text-4xl font-bold mb-4">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-600 dark:text-white">
                Progressive Learning Levels
              </span>
            </h2>
            <p className="text-md md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Start from Level 1 (Rookie) and progress through 10 levels each
              month. Reach Level 10 (110 high-score wins with ≥75% accuracy) to
              qualify for monthly rewards!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {levels.map((level, index) => {
              const levelColors = getLevelColors(level.name);
              const levelInfo = levelsInfo.find(
                (info) => info.level === level.level
              );
              const playCount = levelInfo ? levelInfo.quizzes : 0;
              return (
                <div
                  key={level._id}
                  className={`group cursor-pointer relative overflow-hidden rounded-2xl p-8 transition-all duration-300 transform hover:scale-105 border shadow-lg hover:shadow-xl ${levelColors.background} ${levelColors.border} hover:border-yellow-500`}
                >
                   <div className={`absolute top-0 right-0 w-32 h-32 ${levelColors.accent} rounded-full -translate-y-16 translate-x-16`}></div>
                   
                   <div className="relative z-10 text-center">
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto ${levelColors.iconBg}`}>
                      {React.createElement(
                        levelBadgeIcons[level.name] || levelBadgeIcons.Default,
                        {
                          className: `w-8 h-8 ${levelColors.iconColor}`,
                        }
                      )}
                     </div>
                     
                     <h3 className={`text-xl font-bold mb-2 ${levelColors.titleColor} text-center`}>
                       Level {level.level} - {level.name}
                     </h3>
                     <p className={`text-sm mb-4 ${levelColors.descriptionColor} text-center`}>
                      {level.description ||
                        `Level ${level.level} challenges`}
                     </p>
                     
                     <div className="grid grid-cols-2 gap-2 mb-3">
                       <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center shadow-lg">
                         <div className="text-lg font-bold text-yellow-600">
                           {level.quizCount || "N/A"}
                         </div>
                         <div className="text-xs text-gray-600 dark:text-gray-300">
                           Total Quizzes
                         </div>
                       </div>
                       <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center shadow-lg">
                         <div className="text-lg font-bold text-green-600">
                           {levelInfo ? levelInfo.plan : "-"}
                         </div>
                         <div className="text-xs text-gray-600 dark:text-gray-300">
                           Plan
                         </div>
                       </div>
                       <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center shadow-lg">
                         <div className="text-lg font-bold text-red-600">
                           ₹{levelInfo ? levelInfo.amount : 0}
                         </div>
                         <div className="text-xs text-gray-600 dark:text-gray-300">
                           Amount
                         </div>
                       </div>
                       <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2 text-center shadow-lg">
                         <div className="text-lg font-bold text-yellow-600">
                           ₹{levelInfo ? levelInfo.prize : 0}
                         </div>
                         <div className="text-xs text-gray-600 dark:text-gray-300">
                           Prize {level.level === 10 ? '(Monthly Top 3: ₹9,999)' : ''}
                         </div>
                       </div>
                     </div>
                     
                      <div className="text-sm text-gray-900 dark:text-white text-center mb-2 drop-shadow-sm">
                        Need <strong>{playCount}</strong> high-score wins to unlock next level
                      </div>
                      {(() => {
                        const userCurrentLevel = userLevelData?.currentLevel || 0;
                        const nextLevel = userCurrentLevel + 1;
                        
                        if (level.level < nextLevel) {
                          // User is ahead of this level - show unlocked button
                          return (
                            <button
                              onClick={() => navigate(`/level/${level.level}`)}
                              className="inline-block bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base md:text-lg"
                            >
                              Unlocked
                            </button>
                          );
                        } else if (nextLevel === level.level) {
                          // User's next level - show view quizzes button
                          return (
                            <button
                              onClick={() => navigate(`/level/${level.level}`)}
                              className="inline-block bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white font-semibold py-2 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base md:text-lg"
                            >
                              View Quizzes
                            </button>
                          );
                        } else {
                          // User hasn't reached this level yet - show locked button
                          return (
                            <button
                              disabled
                              className="inline-block bg-gradient-to-r from-gray-400 to-gray-500 text-white font-semibold py-2 px-4 rounded-xl shadow-lg cursor-not-allowed text-sm sm:text-base md:text-lg opacity-60"
                            >
                              Locked
                            </button>
                          );
                        }
                      })()}
                   </div>
                 </div>
              );
            })}
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
      </div>

      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 z-10 mt-8 sm:mt-12 md:mt-16">

        {/* Level-based Quizzes Section */}
        <div className="container mx-auto px-0 mb-6 sm:mb-10 md:mb-12">
          <div className="flex items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <FaStar className="text-yellow-500 text-lg sm:text-xl md:text-2xl" />
              Your Quizzes
            </h2>

          </div>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 md:mb-8 lg:mb-12 max-w-3xl sm:max-w-4xl px-0">
            Discover quizzes tailored to your current level and challenge
            yourself with new questions
          </p>

          {/* Quiz Section: Show login required if not logged in, else show quizzes or subscription message */}
          {!isLoggedIn ? (
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-0 md:p-8 border border-white/20 flex flex-col items-center justify-center animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-yellow-600 text-3xl mb-2">🔒</div>
                <p className="text-yellow-600 text-lg font-semibold mb-4">
                  Login to view your quizzes
                </p>
                <Link
                  to="/login"
                  className="inline-block bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg"
                >
                  Login
                </Link>
              </div>
            </div>
          ) : !hasActiveSubscription() ||
            (error && error.toLowerCase().includes("subscription")) ? (
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-0 md:p-8 border border-white/20 flex flex-col items-center justify-center animate-fade-in">
              <div className="text-center mb-6">
                <div className="text-red-600 text-3xl mb-2">⚠️</div>
                <p className="text-red-600 text-lg font-semibold mb-4">
                  {error && error.toLowerCase().includes("subscription")
                    ? error
                    : "Access to quizzes requires an active subscription."}
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Subscribe now to unlock all quizzes and levels!
                </p>
                <Link
                  to="/subscription"
                  className="inline-block bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-lg"
                >
                  Subscribe Now
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl p-0 border border-white/20 animate-fade-in">
              {homeData?.quizzesByLevel?.length > 0 ? (
                (() => {
                  // Find the user's current level quizzes
                  const userLevelObj = userLevelData;
                  let currentLevelData = null;
                  if (userLevelObj && userLevelObj.currentLevel + 1) {
                    currentLevelData = homeData.quizzesByLevel.find(
                      (lvl) => lvl.level === userLevelObj.currentLevel + 1
                    );
                  }
                  if (!currentLevelData) {
                    currentLevelData = homeData.quizzesByLevel[0];
                  }
                  if (!currentLevelData) return null;
                  return (
                    <div className="bg-gradient-to-r from-gray-50 to-yellow-50 dark:from-gray-700 dark:to-yellow-900/20 rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-6 shadow-lg">
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                        {currentLevelData.quizzes.slice(0, 6).map((quiz) => (
                          <div
                            key={quiz._id}
                            className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700"
                          >
                            <div className="flex justify-between items-start mb-2 sm:mb-3">
                              <h4 className="font-semibold text-gray-800 dark:text-white text-xs sm:text-sm">
                                {quiz.title}
                              </h4>
                              {quiz.isRecommended && (
                                <FaStar className="text-yellow-500 text-xs sm:text-sm" />
                              )}
                            </div>
                            {quiz.description && (
                              <p className="text-gray-600 dark:text-gray-300 text-xs mb-2 sm:mb-3 line-clamp-2">
                                {quiz.description}
                              </p>
                            )}
                            <div className="space-y-1 mb-2 sm:mb-3">
                              <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <FaClock className="text-xs" />
                                <span>{quiz.timeLimit || 30} min</span>
                              </div>
                              <div className="flex items-center gap-1 sm:gap-2 text-xs text-gray-600 dark:text-gray-400">
                                <FaQuestionCircle className="text-xs" />
                                <span>
                                  {quiz.totalMarks || "Variable"} questions
                                </span>
                              </div>
                              {quiz.difficulty && (
                                <span
                                  className={`inline-block px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                                    quiz.difficulty
                                  )}`}
                                >
                                  {quiz.difficulty}
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => handleQuizAttempt(quiz)}
                              className="w-full bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white font-semibold py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-xs sm:text-sm md:text-base"
                            >
                              Start Quiz
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-12">
                  <FaQuestionCircle className="text-6xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                    No new quizzes available for your level.
                  </p>
                  <p className="text-gray-500 dark:text-gray-500 text-sm">
                    You've attempted all available quizzes for your current
                    level!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      

      {/* Categories Section */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
          <FaBook className="text-yellow-500 text-lg sm:text-xl md:text-2xl" /> Categories
        </h2>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 md:mb-8 lg:mb-12 max-w-2xl sm:max-w-3xl px-0">
          Explore quizzes by category and find your perfect learning path
        </p>
        {categories && categories?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8 px-0">
            {categories?.map((category, idx) => {
              const Icon =
                categoryIcons[category.name] || categoryIcons.Default;
              const cardBg = `bg-gradient-to-b from-red-50 to-yellow-50 dark:from-gray-800/20 dark:to-gray-900/50`;
              return (
                <Link
                  key={category._id}
                  to={`/category/${category._id}`}
                  className={`group relative ${cardBg} backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl border transition-all duration-300 transform hover:-translate-y-1 sm:hover:-translate-y-2 hover:scale-105 border-gray-300 dark:border-blue-400 p-4 sm:p-6 hover:shadow-purple-200/40`}
                  tabIndex={0}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                    <Icon className="text-white dark:text-yellow-200 text-lg sm:text-xl md:text-2xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.15)]" />
                  </div>
                  {/* Content */}
                  <div className="text-center">
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 dark:text-white mb-2">
                      {category.name}
                    </h3>
                    <div className="mt-3 sm:mt-4 flex justify-center">
                      <span className="inline-block bg-gradient-to-r from-yellow-600 to-red-600 hover:from-yellow-700 hover:to-red-700 text-white font-semibold py-1.5 sm:py-2 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-xs sm:text-sm md:text-base">
                        View Quizzes
                      </span>
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

      {/* Quiz Start Confirmation Modal */}
      <QuizStartModal
        isOpen={showQuizModal}
        onClose={handleCancelQuizStart}
        onConfirm={handleConfirmQuizStart}
        quiz={selectedQuiz}
      />

    
      {/* Platform Stats Section */}
      <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12 z-10">
        <div className="bg-gradient-to-r from-yellow-100 to-red-100 dark:from-gray-800 dark:to-yellow-900/30 rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 border border-yellow-200 dark:border-yellow-700 flex flex-col items-center relative overflow-hidden">
          <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 via-red-500 to-indigo-600 dark:text-white mb-4 sm:mb-6 flex items-center gap-2 drop-shadow-lg">
            Platform Stats
          </h2>
          <div className="absolute -top-10 right-10 w-32 h-32 bg-gradient-to-br from-yellow-300/30 to-red-300/20 rounded-full blur-2xl z-0 animate-pulse-slow" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tl from-indigo-300/20 to-blue-200/10 rounded-full blur-2xl z-0 animate-pulse-slow" />
          <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6 w-full max-w-4xl z-10">
            <div className="flex flex-col items-center group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaLevelUpAlt className="text-white text-xl sm:text-2xl md:text-3xl animate-float" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white animate-count">
                10
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
                Levels
              </div>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaBook className="text-white text-xl sm:text-2xl md:text-3xl animate-float" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white animate-count">
                12
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
                Categories
              </div>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaLayerGroup className="text-white text-xl sm:text-2xl md:text-3xl animate-float" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white animate-count">
                100+
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
                Subcategories
              </div>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaStar className="text-white text-xl sm:text-2xl md:text-3xl animate-float" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white animate-count">
                4K+
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
                Quizzes
              </div>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-2 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <FaQuestionCircle className="text-white text-xl sm:text-2xl md:text-3xl animate-float" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white animate-count">
                20K+
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
                Questions
              </div>
            </div>
            <div className="flex flex-col items-center group">
              <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-r from-pink-500 to-green-500 rounded-full flex items-center justify-center mb-2">
                <FaUserCircle className="text-white text-xl sm:text-2xl md:text-3xl animate-float" />
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 dark:text-white animate-count">
                1K+
              </div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 text-center">
                Students
              </div>
            </div>
          </div>
        </div>
      </div>

       {/* Referral System Section - Visible to all users */}
       <div className="container mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-12 z-10">
        <div className="rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 border-2 border-purple-300/30">
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-gradient-to-tr from-yellow-500 via-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-xl sm:shadow-2xl animate-float">
              <FaStar className="text-white text-2xl sm:text-3xl md:text-4xl drop-shadow-lg" />
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-800 dark:text-white mb-3 sm:mb-4 md:mb-6 drop-shadow-lg">
              🎁 Referral Rewards System
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 dark:text-yellow-200 font-medium max-w-2xl sm:max-w-3xl lg:max-w-4xl mx-auto px-4 sm:px-0">
              Invite friends and unlock{" "}
              <span className="font-bold text-yellow-600 dark:text-yellow-300">
                premium subscriptions
              </span>{" "}
              automatically!
            </p>
          </div>

          {/* Referral Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="bg-gradient-to-br from-yellow-100 to-orange-200 dark:from-yellow-600/30 dark:to-orange-600/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-yellow-400/50 text-center hover:scale-105 transition-transform duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">🎯</div>
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">
                2 Referrals
              </h3>
              <div className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-yellow-600 dark:text-yellow-300 mb-1 sm:mb-2">
                ₹9 BASIC Plan
              </div>
              <p className="text-yellow-700 dark:text-yellow-200 text-xs sm:text-sm">
                1 Month Free Subscription
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-100 to-pink-200 dark:from-red-600/30 dark:to-pink-600/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-red-400/50 text-center hover:scale-105 transition-transform duration-300">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">🚀</div>
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">
                5 Referrals
              </h3>
              <div className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-red-600 dark:text-red-300 mb-1 sm:mb-2">
                ₹49 PREMIUM Plan
              </div>
              <p className="text-red-700 dark:text-red-200 text-xs sm:text-sm">
                1 Month Free Subscription
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-100 to-indigo-200 dark:from-purple-600/30 dark:to-indigo-600/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-purple-400/50 text-center hover:scale-105 transition-transform duration-300 sm:col-span-2 md:col-span-1">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-2 sm:mb-3">👑</div>
              <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-800 dark:text-white mb-1 sm:mb-2">
                10 Referrals
              </h3>
              <div className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-purple-600 dark:text-purple-300 mb-1 sm:mb-2">
                ₹99 PRO Plan
              </div>
              <p className="text-purple-700 dark:text-purple-200 text-xs sm:text-sm">
                1 Month Free Subscription
              </p>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-gray-100 dark:bg-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl md:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 text-center">
              How It Works
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <div className="text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <span className="text-white font-bold text-sm sm:text-base md:text-lg">1</span>
                </div>
                <p className="text-gray-700 dark:text-yellow-200 text-xs sm:text-sm">
                  Sign up and get your unique referral code
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <span className="text-white font-bold text-sm sm:text-base md:text-lg">2</span>
                </div>
                <p className="text-gray-700 dark:text-yellow-200 text-xs sm:text-sm">
                  Share your code with friends
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <span className="text-white font-bold text-sm sm:text-base md:text-lg">3</span>
                </div>
                <p className="text-gray-700 dark:text-yellow-200 text-xs sm:text-sm">
                  Friends join using your code
                </p>
              </div>
              <div className="text-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <span className="text-white font-bold text-sm sm:text-base md:text-lg">4</span>
                </div>
                <p className="text-gray-700 dark:text-yellow-200 text-xs sm:text-sm">
                  Unlock rewards at milestones!
                </p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            {!isLoggedIn ? (
              <div className="space-y-3 sm:space-y-4">
                <p className="text-gray-700 dark:text-yellow-200 text-sm sm:text-base md:text-lg font-medium">
                  Ready to start earning rewards?
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Link
                    to="/register"
                    className="inline-block bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-600 hover:to-red-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base md:text-lg"
                  >
                    🚀 Join Now & Get Referral Code
                  </Link>
                  <Link
                    to="/login"
                    className="inline-block bg-white/30 hover:bg-white/40 text-gray-800 dark:text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl border-2 border-white/30 hover:border-white/50 transition-all duration-300 text-sm sm:text-base md:text-lg"
                  >
                    🔑 Already have an account? Login
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                <p className="text-gray-700 dark:text-yellow-200 text-sm sm:text-base md:text-lg font-medium">
                  You're already part of the referral system!
                </p>
                <Link
                  to="/profile"
                  className="inline-block bg-gradient-to-r from-yellow-500 to-red-600 hover:from-yellow-600 hover:to-red-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-sm sm:text-base md:text-lg"
                >
                  📱 View Your Referral Code
                </Link>
              </div>
            )}
          </div>

          {/* Additional Info */}
          <div className="mt-8 text-center">
            <p className="text-gray-700 dark:text-white/80 text-sm">
              💡 <strong>Pro Tip:</strong> Share your referral code on social
              media, WhatsApp groups, and with classmates to reach milestones
              faster!
            </p>
          </div>

          {/* Referral Code Preview */}
          {!isLoggedIn && (
            <div className="mt-6 bg-gray-100 dark:bg-white/10 rounded-2xl p-6 border border-gray-300 dark:border-white/20">
              <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
                What Your Referral Code Will Look Like:
              </h4>
              <div className="flex items-center justify-center space-x-3 mb-3">
                <div className="bg-gradient-to-r from-yellow-400 to-red-500 text-yellow-900 font-mono font-bold px-4 py-2 rounded-lg tracking-widest border-2 border-yellow-300 shadow-lg">
                  ABC123XY
                </div>
                <button
                  className="px-3 py-2 bg-yellow-400 text-yellow-900 font-bold rounded-lg shadow hover:bg-yellow-500 transition"
                  onClick={() => navigator.clipboard.writeText("ABC123XY")}
                  title="Copy Example Code"
                >
                  Copy
                </button>
              </div>
              <p className="text-gray-700 dark:text-yellow-200 text-sm">
                📱 <strong>Example:</strong> When friends join using your code,
                you both get benefits!
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* System Update Modal */}
      <SystemUpdateModal 
        isOpen={showSystemUpdateModal}
        onClose={() => {
          setShowSystemUpdateModal(false);
          localStorage.setItem('hasSeenSystemUpdateModal', 'true');
        }}
      />
      </div>
    </MobileAppWrapper>
  );
};

export default HomePage;
