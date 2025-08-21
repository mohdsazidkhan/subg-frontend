import React, { useState } from 'react';
import { FaList, FaTh, FaTable, FaEye, FaEdit, FaTrash, FaPhone, FaEnvelope } from 'react-icons/fa';
import Pagination from './Pagination';
import ViewToggle from './ViewToggle';

const ResponsiveTable = ({
  data = [],
  columns = [],
  actions = [],
  viewModes = ['table', 'list', 'grid'],
  defaultView = 'table',
  itemsPerPage = 10,
  showPagination = true,
  showViewToggle = true,
  className = '',
  onRowClick = null,
  loading = false,
  emptyMessage = "No data available",
  searchTerm = '',
  onSearchChange = null,
  filters = {},
  onFilterChange = null,
  onClearFilters = null,
  filterOptions = {}
}) => {
  const [currentView, setCurrentView] = useState(defaultView);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPageState, setItemsPerPage] = useState(itemsPerPage);

  // Calculate pagination
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPageState);
  const startIndex = (currentPage - 1) * itemsPerPageState;
  const endIndex = startIndex + itemsPerPageState;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    setCurrentPage(1); // Reset to first page when changing view
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  };

  // Render table view
  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                className="px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-4 text-left text-xs sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600"
              >
                {column.header}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-4 text-left text-xs sm:text-sm md:text-base font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
          {currentData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150 ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className="px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-4 text-xs sm:text-sm md:text-base text-gray-900 dark:text-gray-100 whitespace-nowrap"
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
              {actions.length > 0 && (
                <td className="px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-4 text-xs sm:text-sm md:text-base text-gray-900 dark:text-gray-100">
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    {actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(row);
                        }}
                        className={`p-1.5 sm:p-2 rounded-md transition-all duration-200 hover:scale-110 ${
                          action.variant === 'danger'
                            ? 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20'
                            : action.variant === 'success'
                            ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'
                            : 'text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                        }`}
                        title={action.label}
                      >
                        {action.icon}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Render list view
  const renderListView = () => (
    <div className="space-y-3 sm:space-y-4">
      {currentData.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-5 md:p-6 shadow-sm hover:shadow-md transition-all duration-200 ${
            onRowClick ? 'cursor-pointer hover:scale-[1.02]' : ''
          }`}
          onClick={() => onRowClick && onRowClick(row)}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex-1 space-y-2 sm:space-y-3">
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 min-w-[80px] sm:min-w-[100px]">
                    {column.header}:
                  </span>
                  <span className="text-sm sm:text-base text-gray-900 dark:text-gray-100">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </span>
                </div>
              ))}
            </div>
            {actions.length > 0 && (
              <div className="flex items-center space-x-2 sm:space-x-3">
                {actions.map((action, actionIndex) => (
                  <button
                    key={actionIndex}
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick(row);
                    }}
                    className={`p-2 sm:p-2.5 rounded-md transition-all duration-200 hover:scale-110 ${
                      action.variant === 'danger'
                        ? 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20'
                        : action.variant === 'success'
                        ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'
                        : 'text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                    }`}
                    title={action.label}
                  >
                    {action.icon}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Render grid view
  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
      {currentData.map((row, rowIndex) => (
        <div
          key={rowIndex}
          className={`bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 sm:p-5 shadow-sm hover:shadow-md transition-all duration-200 ${
            onRowClick ? 'cursor-pointer hover:scale-105' : ''
          }`}
          onClick={() => onRowClick && onRowClick(row)}
        >
          <div className="space-y-3 sm:space-y-4">
            {columns.slice(0, 3).map((column, colIndex) => (
              <div key={colIndex} className="text-center">
                <div className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  {column.header}
                </div>
                <div className="text-sm sm:text-base text-gray-900 dark:text-gray-100 font-semibold">
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </div>
              </div>
            ))}
            {actions.length > 0 && (
              <div className="flex items-center justify-center space-x-2 pt-2 border-t border-gray-200 dark:border-gray-600">
                {actions.map((action, actionIndex) => (
                  <button
                    key={actionIndex}
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick(row);
                    }}
                    className={`p-1.5 sm:p-2 rounded-md transition-all duration-200 hover:scale-110 ${
                      action.variant === 'danger'
                        ? 'text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20'
                        : action.variant === 'success'
                        ? 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20'
                        : 'text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                    }`}
                    title={action.label}
                  >
                    {action.icon}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Render empty state
  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 dark:text-gray-400 text-lg sm:text-xl md:text-2xl">
          {emptyMessage}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {/* Header with view toggle and items per page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {showViewToggle && (
          <ViewToggle
            currentView={currentView}
            onViewChange={handleViewChange}
            views={viewModes}
          />
        )}
        
        {/* Items per page selector */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <label className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
            Items per page:
          </label>
          <select
            value={itemsPerPageState}
            onChange={handleItemsPerPageChange}
            className="px-2 py-1.5 sm:px-3 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

      {/* Content based on view mode */}
      {currentView === 'table' && renderTableView()}
      {currentView === 'list' && renderListView()}
      {currentView === 'grid' && renderGridView()}

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={totalItems}
          itemsPerPage={itemsPerPageState}
        />
      )}
    </div>
  );
};

export default ResponsiveTable;
