import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchFilter = ({ 
  searchTerm, 
  onSearchChange, 
  onSearch,
  filters = {}, 
  onFilterChange, 
  onClearFilters,
  filterOptions = {},
  placeholder = "Search...",
  className = ""
}) => {

  const hasActiveFilters = Object.values(filters).some(value => value && value !== '');

  // Handle both onSearch and onSearchChange for backward compatibility
  const handleSearchChange = (value) => {
    if (onSearch) {
      onSearch(value);
    } else if (onSearchChange) {
      onSearchChange(value);
    }
  };

  return (
   <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 md:gap-6">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
            <input
              type="text"
              value={searchTerm || ''}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder={placeholder}
              className="w-full pl-8 pr-8 py-1 lg:py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base transition-all duration-200"
            />
          </div>
        </div>

        {/* Filters */}
        {Object.keys(filterOptions).length > 0 && (
          <div className="flex flex-col lg:flex-row gap-2 sm:gap-3">
            {Object.entries(filterOptions).map(([key, options]) => (
              <select
                key={key}
                value={filters[key] || ''}
                onChange={(e) => onFilterChange(key, e.target.value)}
                className="w-full lg:-w-auto px-2 py-1.5 sm:px-3 sm:py-2 max-w-full border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xs sm:text-sm transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
              >
                <option value="">{options.label || key}</option>
                {options.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ))}
          </div>
        )}

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-1 sm:space-x-2 px-2 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-all duration-200 hover:scale-105"
          >
            <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Clear</span>
          </button>
        )}
      </div>
  );
};

export default SearchFilter; 