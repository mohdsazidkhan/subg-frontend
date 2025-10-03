import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { toast } from "react-toastify";
import MonthlyRewardsInfo from "./MonthlyRewardsInfo";

const RewardsDashboard = () => {
  const [rewards, setRewards] = useState(null);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      setError(null);
      const profile = await API.getProfile();

      if (!profile || typeof profile !== "object") {
        throw new Error("Invalid response format from server");
      }

      const highScoreQuizzes = profile?.user?.monthlyProgress?.highScoreWins || 0;
      const requiredQuizzes = process.env.REACT_APP_MONTHLY_REWARD_QUIZ_REQUIREMENT || 220;
      const percentage = Math.min(100, Math.round((highScoreQuizzes / requiredQuizzes) * 100));

      setRewards({
        claimableRewards: profile?.user?.claimableRewards || 0,
        quizProgress: {
          current: highScoreQuizzes,
          required: requiredQuizzes,
          percentage: percentage,
        },
        canUnlock: Boolean(profile?.user?.monthlyProgress?.rewardEligible),
        unlocked: [],
        claimed: [],
      });
    } catch (error) {
      console.error("Error fetching rewards:", error);
      setError(error.response?.data?.message || "Failed to fetch rewards");
      toast.error("Failed to fetch rewards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const claimReward = async () => {
    toast.info("Monthly prizes are auto-credited to Top 10 at month end.");
  };

  const handleWithdraw = async () => {
    if (!rewards?.claimableRewards || rewards.claimableRewards <= 0) {
      toast.error("No rewards available for withdrawal");
      return;
    }

    toast.info(
      "Monthly rewards will be automatically transferred within Week!"
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4 sm:p-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4 sm:p-8">
        <div className="text-4xl sm:text-6xl mb-4">❌</div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Error Loading Rewards
        </h3>
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4">
          {error}
        </p>
        <button
          onClick={fetchRewards}
          className="bg-blue-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!rewards) {
    return (
      <div className="text-center p-4 sm:p-8">
        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">
          Failed to load rewards
        </p>
      </div>
    );
  }
  console.log(rewards, 'rewards')
  // Safely destructure with fallbacks
  const {
    unlocked = [],
    claimed = [],
    claimableRewards,
    quizProgress = { current: 0, required: process.env.REACT_APP_MONTHLY_REWARD_QUIZ_REQUIREMENT || 220, percentage: 0 },
    canUnlock = false,
  } = rewards;

  return (
    <div className="container mx-auto px-4 lg:px-8 py-4 space-y-4 sm:space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 md:p-4 sm:p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
          🏆 Rewards Dashboard
        </h2>

        {/* Quiz Progress */}
        <div className="mb-4 sm:mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              High-Score Quizzes: {quizProgress?.current || 0} /{" "}
              {quizProgress?.required || process.env.REACT_APP_MONTHLY_REWARD_QUIZ_REQUIREMENT || 220}
            </span>
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              {Math.round(quizProgress?.percentage || 0)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-2.5">
            <div
              className="bg-blue-600 h-2 sm:h-2.5 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(quizProgress?.percentage || 0, 100)}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Reach Level 10 with {process.env.REACT_APP_MONTHLY_REWARD_QUIZ_REQUIREMENT || 220} high-score quizzes to qualify for monthly rewards
          </p>
          {canUnlock && (
            <div className="mt-2 p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                🎉 You meet all requirements! Rewards can now be unlocked.
              </p>
            </div>
          )}
        </div>

        {/* Claimable Rewards */}
        {claimableRewards > 0 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h3 className="text-md sm:text-lg font-semibold text-green-800 dark:text-green-300">
                  💰 Claimable Rewards
                </h3>
                <p className="text-green-600 dark:text-green-300 font-bold text-lg sm:text-xl">
                  ₹{claimableRewards.toLocaleString()}
                </p>
              </div>
              <button
                onClick={handleWithdraw}
                className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm sm:text-base w-full sm:w-auto"
              >
                Withdraw
              </button>
            </div>
          </div>
        )}

        {/* Monthly Top 10 Info */}
        <div className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3">
            🏆 Monthly Top 10 Rewards
          </h3>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
            <div className="text-center">
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                Every month, the top 10 users with Level 10 and {process.env.REACT_APP_MONTHLY_REWARD_QUIZ_REQUIREMENT || 220} high-score quizzes win
                prizes from ₹{process.env.REACT_APP_MONTHLY_REWARD_PRIZE_POOL || 10000} total pool!
              </p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-center">
                <div className="bg-yellow-100 dark:bg-yellow-800/30 rounded-lg p-2">
                  <div className="text-lg mb-1">🥇</div>
                  <div className="text-xs font-semibold text-yellow-800 dark:text-yellow-200">
                    1st
                  </div>
                  <div className="text-sm font-bold text-yellow-700 dark:text-yellow-300">
                    ₹2,500
                  </div>
                </div>
                <div className="bg-gray-100 dark:bg-gray-800/30 rounded-lg p-2">
                  <div className="text-lg mb-1">🥈</div>
                  <div className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                    2nd
                  </div>
                  <div className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    ₹2,000
                  </div>
                </div>
                <div className="bg-orange-100 dark:bg-orange-800/30 rounded-lg p-2">
                  <div className="text-lg mb-1">🥉</div>
                  <div className="text-xs font-semibold text-orange-800 dark:text-orange-200">
                    3rd
                  </div>
                  <div className="text-sm font-bold text-orange-700 dark:text-orange-300">
                    ₹1,500
                  </div>
                </div>
                <div className="bg-blue-100 dark:bg-blue-800/30 rounded-lg p-2">
                  <div className="text-lg mb-1">🏅</div>
                  <div className="text-xs font-semibold text-blue-800 dark:text-blue-200">
                    4th
                  </div>
                  <div className="text-sm font-bold text-blue-700 dark:text-blue-300">
                    ₹1,200
                  </div>
                </div>
                <div className="bg-green-100 dark:bg-green-800/30 rounded-lg p-2">
                  <div className="text-lg mb-1">🏅</div>
                  <div className="text-xs font-semibold text-green-800 dark:text-green-200">
                    5th
                  </div>
                  <div className="text-sm font-bold text-green-700 dark:text-green-300">
                    ₹800
                  </div>
                </div>
                <div className="bg-purple-100 dark:bg-purple-800/30 rounded-lg p-2">
                  <div className="text-lg mb-1">🏅</div>
                  <div className="text-xs font-semibold text-purple-800 dark:text-purple-200">
                    6th
                  </div>
                  <div className="text-sm font-bold text-purple-700 dark:text-purple-300">
                    ₹600
                  </div>
                </div>
                <div className="bg-pink-100 dark:bg-pink-800/30 rounded-lg p-2">
                  <div className="text-lg mb-1">🏅</div>
                  <div className="text-xs font-semibold text-pink-800 dark:text-pink-200">
                    7th
                  </div>
                  <div className="text-sm font-bold text-pink-700 dark:text-pink-300">
                    ₹500
                  </div>
                </div>
                <div className="bg-indigo-100 dark:bg-indigo-800/30 rounded-lg p-2">
                  <div className="text-lg mb-1">🏅</div>
                  <div className="text-xs font-semibold text-indigo-800 dark:text-indigo-200">
                    8th
                  </div>
                  <div className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                    ₹400
                  </div>
                </div>
                <div className="bg-teal-100 dark:bg-teal-800/30 rounded-lg p-2">
                  <div className="text-lg mb-1">🏅</div>
                  <div className="text-xs font-semibold text-teal-800 dark:text-teal-200">
                    9th
                  </div>
                  <div className="text-sm font-bold text-teal-700 dark:text-teal-300">
                    ₹350
                  </div>
                </div>
                <div className="bg-red-100 dark:bg-red-800/30 rounded-lg p-2">
                  <div className="text-lg mb-1">🏅</div>
                  <div className="text-xs font-semibold text-red-800 dark:text-red-200">
                    10th
                  </div>
                  <div className="text-sm font-bold text-red-700 dark:text-red-300">
                    ₹150
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unlocked Rewards */}
        {unlocked && unlocked.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3">
              ✅ Unlocked Rewards
            </h3>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {unlocked.map((reward, index) => (
                <div
                  key={reward?._id || `unlocked-${reward?.level}-${index}`}
                  className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 sm:p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300">
                      Level {reward?.level || "N/A"}
                    </span>
                    <span className="text-xs text-blue-600 dark:text-blue-400">
                      {reward?.dateUnlocked
                        ? new Date(reward.dateUnlocked).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700 dark:text-blue-300 mb-3">
                    ₹{(reward?.amount || 0).toLocaleString()}
                  </p>
                  <button
                    onClick={() => claimReward(reward?._id)}
                    disabled={claiming || !reward?._id}
                    className="w-full bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
                  >
                    {claiming ? "Claiming..." : "Claim Reward"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Claimed Rewards */}
        {claimed && claimed.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-3">
              🎉 Claimed Rewards
            </h3>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {claimed.map((reward, index) => (
                <div
                  key={reward?._id || `claimed-${reward?.level}-${index}`}
                  className="bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-700 rounded-lg p-3 sm:p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200">
                      Level {reward?.level || "N/A"}
                    </span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {reward?.dateClaimed
                        ? new Date(reward.dateClaimed).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-700 dark:text-gray-200 mb-2">
                    ₹{(reward?.amount || 0).toLocaleString()}
                  </p>
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                    ✓ Claimed
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Rewards Message */}
        {(!unlocked || unlocked.length === 0) &&
          (!claimed || claimed.length === 0) && (
            <div className="text-center py-6 sm:py-8">
              <div className="text-4xl sm:text-6xl mb-4">🏆</div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-2">
                No Rewards Yet
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                Reach Level 10 with {process.env.REACT_APP_MONTHLY_REWARD_QUIZ_REQUIREMENT || 220} high-score quizzes and compete for monthly Top 10
                positions to earn from ₹{process.env.REACT_APP_MONTHLY_REWARD_PRIZE_POOL || 10000} total pool!
              </p>
            </div>
          )}

        {/* Requirements Info */}
        <MonthlyRewardsInfo className="mt-4 sm:mt-6" />

        <div className="relative overflow-hidden rounded-xl border border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-900/40 p-4 sm:p-6 lg:p-8 mt-6 shadow-sm">
          <div className="flex items-center justify-center gap-3">
            <div className="text-sm sm:text-base lg:text-lg font-semibold text-red-800 dark:text-red-100 space-y-3">
              <p>
                🏆 <strong>Top 10 winners</strong> receive{" "}
                <span className="text-red-600 dark:text-red-300">
                  cash prizes
                </span>{" "}
                within <strong>7 days</strong> of result declaration.
              </p>
              <p>
                📣 Winners are <strong>publicly declared</strong> and prizes are
                directly transferred to their accounts.
              </p>
              <p>
                💳{" "}
                <span className="text-red-700 dark:text-red-300">
                  To receive cash rewards, you must{" "}
                  <strong>add your bank details</strong> once you reach{" "}
                  <strong>Level 10</strong>.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsDashboard;
