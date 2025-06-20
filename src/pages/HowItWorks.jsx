import React from 'react';

const HowItWorks = () => (
  <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800 dark:text-gray-200 transition-colors duration-300">
    <h1 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white">
      How It Works
    </h1>

    <ol className="space-y-6 list-decimal list-inside">
      <li>
        <strong>Register / Login:</strong>  
        Sign up using your mobile number or email to create your SUBG QUIZ account.
      </li>

      <li>
        <strong>Add Coins / Join Quiz:</strong>  
        Load your wallet using our secure payment gateway (Easebuzz). Use coins to enter quiz contests.
      </li>

      <li>
        <strong>Play Timed Quiz:</strong>  
        Participate in exciting multiple-choice quizzes. Each question is skill-based and timed.
      </li>

      <li>
        <strong>Score & Leaderboard:</strong>  
        Your score depends on correct answers and speed. Top scorers are automatically listed.
      </li>

      <li>
        <strong>Win Coins:</strong>  
        Winners earn coins based on performance. These coins reflect in your in-app wallet.
      </li>

      <li>
        <strong>Withdraw Winnings:</strong>  
        Users can request withdrawals via UPI or bank. Payouts are handled via API securely.
      </li>
    </ol>

    <p className="mt-6 text-sm text-gray-600 dark:text-gray-400">
      Note: SUBG QUIZ is a <strong>100% skill-based platform</strong>. There is no gambling, betting, or chance involved. Only knowledge, accuracy, and speed decide your rewards.
    </p>
  </div>
);

export default HowItWorks;
