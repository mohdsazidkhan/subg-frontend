import React from 'react';
import { FaList, FaTh, FaTable } from 'react-icons/fa';

const ViewToggle = ({ currentView, onViewChange, views = ['list', 'card', 'table'] }) => {
  const viewIcons = {
    list: FaList,
    card: FaTh,
    table: FaTable
  };

  const viewLabels = {
    list: 'List',
    card: 'Card',
    table: 'Table'
  };

  return (
    <div className="flex items-center space-x-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
      {views.map((view) => {
        const Icon = viewIcons[view];
        const isActive = currentView === view;
        
        return (
          <button
            key={view}
            onClick={() => onViewChange(view)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
            title={`${viewLabels[view]} View`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{viewLabels[view]}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ViewToggle; 