import React from 'react';
import { FaCalendarAlt, FaPercent } from 'react-icons/fa';

/**
 * PricingToggle Component
 * Allows users to switch between monthly and yearly pricing
 */
const PricingToggle = ({ isYearly, onToggle }) => {
  return (
    <div className="flex justify-center items-center gap-4 mb-8">
      <button
        onClick={() => onToggle(false)}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
          !isYearly
            ? 'bg-gradient-to-r from-yellow-600 to-red-600 text-white shadow-lg scale-105'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-yellow-500'
        }`}
      >
        <FaCalendarAlt className="text-lg" />
        <span>Monthly</span>
      </button>

      <div className="text-2xl font-bold text-gray-400 dark:text-gray-500">|</div>

      <button
        onClick={() => onToggle(true)}
        className={`relative flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
          isYearly
            ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg scale-105'
            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:border-green-500'
        }`}
      >
        <FaCalendarAlt className="text-lg" />
        <span>Yearly</span>
        {!isYearly && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
            <span>Save 15.91%</span>
          </span>
        )}
      </button>
    </div>
  );
};

export default PricingToggle;

