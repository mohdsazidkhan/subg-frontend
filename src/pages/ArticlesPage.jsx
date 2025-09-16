import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import API from '../utils/api';
import MobileAppWrapper from '../components/MobileAppWrapper';
import Sidebar from '../components/Sidebar';
import { useSelector } from 'react-redux';

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [featuredArticles, setFeaturedArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    featured: false
  });
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState(() => {
    const saved = localStorage.getItem('articlesViewMode');
    return saved || 'grid';
  }); // 'grid' or 'list'

  const user = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: 9,
        ...filters
      };

      const response = await API.getPublishedArticles(params);
      setArticles(response.data.articles || []);
      setPagination(response.data.pagination || {});
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, [currentPage, filters]);

  const fetchFeaturedArticles = async () => {
    try {
      const response = await API.getFeaturedArticles(3);
      setFeaturedArticles(response.data || []);
    } catch (err) {
      console.error('Error fetching featured articles:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await API.getPublicCategories();
      setCategories(response.data || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchArticles();
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('articlesViewMode', mode);
  };

  useEffect(() => {
    fetchArticles();
    fetchFeaturedArticles();
    fetchCategories();
  }, [fetchArticles]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Grid View Component
  const GridView = ({ articles }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <Link
          key={article._id}
          to={`/articles/${article.slug}`}
          className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          {article.featuredImage && (
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={article.featuredImage}
                alt={article.featuredImageAlt || article.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center mb-2">
              {article.isFeatured && (
                <span className="text-yellow-500 text-sm font-medium mr-2">⭐</span>
              )}
              {article.isPinned && (
                <span className="text-blue-500 text-sm font-medium mr-2">📌</span>
              )}
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors mb-2">
              {article.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {truncateText(article.excerpt || article.content, 120)}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span>👁️ {article.views || 0}</span>
                <span>❤️ {article.likes || 0}</span>
                <span>⏱️ {article.readingTime || 5} min</span>
              </div>
              <span className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                Read More →
              </span>
            </div>
            {article.category && (
              <div className="mt-3">
                <span className="inline-block bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                  {article.category.name}
                </span>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );

  // List View Component
  const ListView = ({ articles }) => (
    <div className="space-y-4">
      {articles.map((article) => (
        <Link
          key={article._id}
          to={`/articles/${article.slug}`}
          className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row"
        >
          {article.featuredImage && (
            <div className="md:w-64 h-48 md:h-auto flex-shrink-0">
              <img
                src={article.featuredImage}
                alt={article.featuredImageAlt || article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
          <div className="p-6 flex-1">
            <div className="flex items-center mb-2">
              {article.isFeatured && (
                <span className="text-yellow-500 text-sm font-medium mr-2">⭐</span>
              )}
              {article.isPinned && (
                <span className="text-blue-500 text-sm font-medium mr-2">📌</span>
              )}
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {formatDate(article.publishedAt || article.createdAt)}
              </span>
              {article.category && (
                <span className="ml-auto bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                  {article.category.name}
                </span>
              )}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors mb-2">
              {article.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              {truncateText(article.excerpt || article.content, 200)}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span>👁️ {article.views || 0}</span>
                <span>❤️ {article.likes || 0}</span>
                <span>⏱️ {article.readingTime || 5} min read</span>
              </div>
              <span className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                Read More →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );

  if (loading) {
    return (
      <MobileAppWrapper title="Articles">
        <div className={`mainContent ${isOpen ? 'showPanel' : 'hidePanel'}`}>
          {user && user.role === 'admin' && <Sidebar />}
          <div className="p-4 w-full text-gray-900 dark:text-white">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                <div className="text-lg">Loading articles...</div>
              </div>
            </div>
          </div>
        </div>
      </MobileAppWrapper>
    );
  }

  return (
    <MobileAppWrapper title="Articles">
      <div className={`mainContent ${isOpen ? 'showPanel' : 'hidePanel'}`}>
        {user && user.role === 'admin' && <Sidebar />}
        <div className="p-4 w-full text-gray-900 dark:text-white">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  📚 Articles & Blog
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Discover insights, tips, and knowledge from our community
                </p>
              </div>
            </div>
          </div>

          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                ⭐ Featured Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredArticles.map((article) => (
                  <Link
                    key={article._id}
                    to={`/articles/${article.slug}`}
                    className="group bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
                  >
                    {article.featuredImage && (
                      <div className="aspect-w-16 aspect-h-9">
                        <img
                          src={article.featuredImage}
                          alt={article.featuredImageAlt || article.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center mb-2">
                        <span className="text-yellow-500 text-sm font-medium">⭐ Featured</span>
                        <span className="mx-2 text-gray-300">•</span>
                        <span className="text-gray-500 dark:text-gray-400 text-sm">
                          {formatDate(article.publishedAt || article.createdAt)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors mb-2">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                        {truncateText(article.excerpt || article.content, 120)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                          <span>👁️ {article.views || 0}</span>
                          <span>❤️ {article.likes || 0}</span>
                          <span>⏱️ {article.readingTime || 5} min read</span>
                        </div>
                        <span className="text-yellow-600 dark:text-yellow-400 text-sm font-medium">
                          Read More →
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 mb-8 shadow-sm border border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Search Articles
                  </label>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search articles..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-end mb-2 lg:mb-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={filters.featured}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                      Featured Only
                    </span>
                  </label>
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-500 to-red-500 text-white 
              dark:from-yellow-600 dark:to-red-700 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Search
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Articles Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                All Articles
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {pagination.total ? `${pagination.total} articles found` : ''}
              </div>
              {/* View Toggle */}
              <div className="mt-4 sm:mt-0 flex items-center space-x-2">
                <span className="hidden sm:inline text-sm text-gray-600 dark:text-gray-400">View:</span>
                <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                  <button
                    onClick={() => handleViewModeChange('grid')}
                    className={`px-2 sm:px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    title="Grid View"
                  >
                    <span className="flex items-center space-x-1">
                      <span>⊞</span>
                      <span className="hidden sm:inline">Grid</span>
                    </span>
                  </button>
                  <button
                    onClick={() => handleViewModeChange('list')}
                    className={`px-2 sm:px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                    title="List View"
                  >
                    <span className="flex items-center space-x-1">
                      <span>☰</span>
                      <span className="hidden sm:inline">List</span>
                    </span>
                  </button>
                </div>
              </div>
            </div>
            
            {articles.length > 0 ? (
              viewMode === 'grid' ? (
                <GridView articles={articles} />
              ) : (
                <ListView articles={articles} />
              )
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try adjusting your search criteria or check back later for new content.
                </p>
              </div>
            )}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={!pagination.hasPrev}
                  className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={!pagination.hasNext}
                  className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="text-red-800 dark:text-red-200">{error}</div>
            </div>
          )}
        </div>
      </div>
    </MobileAppWrapper>
  );
};

export default ArticlesPage;
