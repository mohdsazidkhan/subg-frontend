import React, { useState, useEffect } from 'react';
import { FaTrophy, FaCrown, FaMedal, FaAward, FaRupeeSign } from 'react-icons/fa';
import API from '../utils/api';

const MonthlyWinnersDisplay = ({ title = "🏆 Previous Month Legends", showTitle = true, className = "" }) => {
  const [monthlyWinners, setMonthlyWinners] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMonthlyWinners();
  }, []);

  const fetchMonthlyWinners = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get previous month's winners by default
      const previousMonth = getPreviousMonth();
      const response = await API.getRecentMonthlyWinners(1, previousMonth);
      
      if (response.success && response.data && response.data.length > 0) {
        setMonthlyWinners(response.data[0]);
      } else {
        // If no previous month winners, try to get the most recent winners
        const recentResponse = await API.getRecentMonthlyWinners(1);
        if (recentResponse.success && recentResponse.data.length > 0) {
          setMonthlyWinners(recentResponse.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch monthly winners:', err);
      setError('Failed to load monthly winners');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get previous month in YYYY-MM format
  const getPreviousMonth = () => {
    const now = new Date();
    const previousMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const year = previousMonth.getFullYear();
    const month = String(previousMonth.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  if (loading) {
    return (
      <div className={`bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-600 p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-yellow-500"></div>
        </div>
      </div>
    );
  }

  if (error || !monthlyWinners || !monthlyWinners.winners || monthlyWinners.winners.length === 0) {
    return (
      <div className={`bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-600 p-6 ${className}`}>
        <div className="text-center py-0 md:py-2 lg:py-4 xl:py-6">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🏆</div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
            Previous Month Winners Coming Soon!
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 max-w-md mx-auto">
            Our monthly competition system processes winners on the <strong>last date of each month after 9:00 PM IST</strong>. Previous month's results will appear here once processed.
          </p>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-yellow-200 dark:border-yellow-600">
            <div className="text-center">
              <div className="text-xl lg:text-2xl font-bold text-yellow-600 mb-2">₹9,999</div>
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">Monthly Prize Pool</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Top 3 users at Level 10 with ≥75% accuracy win prizes in 3:2:1 ratio
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
            🎯 Play quizzes now to qualify for next month's rewards!
          </p>
        </div>
      </div>
    );
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <FaCrown className="text-yellow-500 text-xl" />;
      case 2:
        return <FaMedal className="text-gray-400 text-xl" />;
      case 3:
        return <FaAward className="text-orange-600 text-xl" />;
      default:
        return <FaTrophy className="text-blue-500 text-xl" />;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1:
        return 'from-yellow-900 to-yellow-600';
      case 2:
        return 'from-red-900 to-red-600';
      case 3:
        return 'from-orange-900 to-orange-600';
      default:
        return 'from-blue-900 to-blue-600';
    }
  };

  return (
    <div className={`bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 rounded-xl border border-yellow-200 dark:border-yellow-600 p-6 ${className}`}>
      {showTitle && (
        <div className="flex items-center gap-3 mb-6">
          <FaTrophy className="text-3xl text-yellow-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {monthlyWinners.monthYear} • Total Prize: ₹{monthlyWinners.totalPrizePool?.toLocaleString()}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {monthlyWinners.winners.map((winner, index) => (
          <div 
            key={winner._id || index} 
            className={`bg-gradient-to-r ${getRankColor(winner.rank)} rounded-lg p-4 text-white shadow-lg`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getRankIcon(winner.rank)}
                  <span className="text-lg font-bold">#{winner.rank}</span>
                </div>
                <div>
                  <div className="font-semibold text-lg">{winner.userName}</div>
                  <div className="text-sm opacity-90">{winner.userEmail}</div>
                  <div className="text-xs opacity-80 mt-1">
                    {winner.highScoreWins} wins • {winner.accuracy}% accuracy
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2">
                  <FaRupeeSign className="text-2xl" />
                  <div>
                    <div className="text-xl lg:text-2xl font-bold">{winner.rewardAmount?.toLocaleString()}</div>
                    <div className="text-xs opacity-80">Prize</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          🎯 Previous month's champions! Current month's competition is ongoing - play quizzes to qualify for next month's rewards.
        </p>
      </div>
    </div>
  );
};

export default MonthlyWinnersDisplay;
