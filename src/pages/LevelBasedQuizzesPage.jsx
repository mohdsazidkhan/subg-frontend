import React from 'react';
import LevelBasedQuizzes from '../components/LevelBasedQuizzes';

const LevelBasedQuizzesPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="pt-16">
        <LevelBasedQuizzes />
      </div>
    </div>
  );
};

export default LevelBasedQuizzesPage; 