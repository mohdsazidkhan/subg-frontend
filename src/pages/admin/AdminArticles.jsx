import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../../utils/api';
import AdminMobileAppWrapper from '../../components/AdminMobileAppWrapper';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';
import ViewToggle from '../../components/ViewToggle';
import { isMobile } from 'react-device-detect';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    category: '',
    isFeatured: '',
    isPinned: ''
  });
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return (isMobile || window.innerWidth < 768) ? 'grid' : 'table';
      }
    } catch (e) {}
    return isMobile ? 'grid' : 'table';
  });

  // Ensure Grid on small screens after mount and on orientation change
  useEffect(() => {
    try {
      const enforceGridOnSmall = () => {
        if (typeof window !== 'undefined' && window.innerWidth < 768) {
          setViewMode('grid');
        }
      };
      enforceGridOnSmall();
      window.addEventListener('orientationchange', enforceGridOnSmall);
      return () => {
        window.removeEventListener('orientationchange', enforceGridOnSmall);
      };
    } catch (e) {}
  }, []);

  const user = JSON.parse(localStorage.getItem('userInfo'));
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  useEffect(() => {
    fetchArticles();
    fetchCategories();
  }, [currentPage, filters]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: currentPage,
        limit: 10,
        ...filters
      };

      const response = await API.getAdminArticles(params);
      setArticles(response.articles || []);
      setPagination(response.pagination || {});
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await API.getAdminCategories();
      setCategories(response.categories || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        await API.deleteArticle(id);
        fetchArticles();
      } catch (err) {
        console.error('Error deleting article:', err);
        alert('Failed to delete article');
      }
    }
  };

  const handlePublish = async (id) => {
    try {
      await API.publishArticle(id);
      fetchArticles();
    } catch (err) {
      console.error('Error publishing article:', err);
      alert('Failed to publish article');
    }
  };

  const handleUnpublish = async (id) => {
    try {
      await API.unpublishArticle(id);
      fetchArticles();
    } catch (err) {
      console.error('Error unpublishing article:', err);
      alert('Failed to unpublish article');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await API.toggleFeatured(id);
      fetchArticles();
    } catch (err) {
      console.error('Error toggling featured status:', err);
      alert('Failed to toggle featured status');
    }
  };

  const handleTogglePinned = async (id) => {
    try {
      await API.togglePinned(id);
      fetchArticles();
    } catch (err) {
      console.error('Error toggling pinned status:', err);
      alert('Failed to toggle pinned status');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { color: 'bg-green-100 text-green-800', text: 'Published' },
      draft: { color: 'bg-yellow-100 text-yellow-800', text: 'Draft' },
      archived: { color: 'bg-gray-100 text-gray-800', text: 'Archived' }
    };
    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const renderTableView = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Article
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Stats
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {articles.map((article) => (
              <tr key={article._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {article.featuredImage ? (
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={article.featuredImage}
                          alt={article.title}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 text-sm">📝</span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 max-w-96" >
                      <div className="text-sm font-medium text-gray-900 dark:text-white" title={article.title}>
                        {article.title?.length > 40 ? article.title?.substring(0, 40) + '...' : article.title}
                        {article.isFeatured && (
                          <span className="ml-2 text-yellow-500">⭐</span>
                        )}
                        {article.isPinned && (
                          <span className="ml-2 text-blue-500">📌</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(article.createdAt)}
                      </div>
                      {article.slug && (
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1" title={article.slug}>
                          <code>/articles/{article.slug?.length > 40 ? article.slug?.substring(0, 40) + '...' : article.slug}</code>
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {article.author?.name || 'Unknown'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {article.category?.name || 'Uncategorized'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(article.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex space-x-4">
                    <span>👁️ {article.views || 0}</span>
                    <span>❤️ {article.likes || 0}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/articles/${article._id}/edit`}
                      className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                    >
                      Edit
                    </Link>
                    {article.status === 'published' ? (
                      <button
                        onClick={() => handleUnpublish(article._id)}
                        className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                      >
                        Unpublish
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePublish(article._id)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        Publish
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleFeatured(article._id)}
                      className={`${article.isFeatured ? 'text-yellow-600' : 'text-gray-400'} hover:text-yellow-900 dark:hover:text-yellow-300`}
                    >
                      ⭐
                    </button>
                    <button
                      onClick={() => handleTogglePinned(article._id)}
                      className={`${article.isPinned ? 'text-blue-600' : 'text-gray-400'} hover:text-blue-900 dark:hover:text-blue-300`}
                    >
                      📌
                    </button>
                    <button
                      onClick={() => handleDelete(article._id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={!pagination.hasPrev}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
              disabled={!pagination.hasNext}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing{' '}
                <span className="font-medium">
                  {((pagination.page - 1) * pagination.limit) + 1}
                </span>{' '}
                to{' '}
                <span className="font-medium">
                  {Math.min(pagination.page * pagination.limit, pagination.total)}
                </span>{' '}
                of{' '}
                <span className="font-medium">{pagination.total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={!pagination.hasPrev}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={!pagination.hasNext}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {articles.map((article) => (
        <div key={article._id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="flex items-start gap-4">
            {article.featuredImage ? (
              <img src={article.featuredImage} alt={article.title} className="w-16 h-16 rounded-lg object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">📝</div>
            )}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{article.title}</h3>
                {getStatusBadge(article.status)}
                {article.isFeatured && <span className="text-yellow-500">⭐</span>}
                {article.isPinned && <span className="text-blue-500">📌</span>}
              </div>
              <div className="mt-1 text-sm text-gray-600 dark:text-gray-300 flex flex-wrap gap-4">
                <span>By {article.author?.name || 'Unknown'}</span>
                <span>In {article.category?.name || 'Uncategorized'}</span>
                <span>{formatDate(article.createdAt)}</span>
                <span>👁️ {article.views || 0}</span>
                <span>❤️ {article.likes || 0}</span>
              </div>
              {article.slug && (
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  <code>/articles/{article.slug}</code>
                </div>
              )}
              <div className="mt-3 flex items-center gap-3">
                <Link
                  to={`/admin/articles/${article._id}/edit`}
                  className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                >
                  Edit
                </Link>
                {article.status === 'published' ? (
                  <button onClick={() => handleUnpublish(article._id)} className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300">Unpublish</button>
                ) : (
                  <button onClick={() => handlePublish(article._id)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">Publish</button>
                )}
                <button onClick={() => handleToggleFeatured(article._id)} className={`${article.isFeatured ? 'text-yellow-600' : 'text-gray-400'} hover:text-yellow-900 dark:hover:text-yellow-300`}>⭐</button>
                <button onClick={() => handleTogglePinned(article._id)} className={`${article.isPinned ? 'text-blue-600' : 'text-gray-400'} hover:text-blue-900 dark:hover:text-blue-300`}>📌</button>
                <button onClick={() => handleDelete(article._id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {articles.map((article) => (
        <div key={article._id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
          <div className="mb-3">
            {article.featuredImage ? (
              <img src={article.featuredImage} alt={article.title} className="w-full h-40 rounded-lg object-cover" />
            ) : (
              <div className="w-full h-40 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-3xl">📝</div>
            )}
          </div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white line-clamp-2">{article.title}</h3>
            {getStatusBadge(article.status)}
          </div>
          <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 flex flex-wrap gap-3">
            <span>{article.author?.name || 'Unknown'}</span>
            <span>{article.category?.name || 'Uncategorized'}</span>
          </div>
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-4">
            <span>{formatDate(article.createdAt)}</span>
            <span>👁️ {article.views || 0}</span>
            <span>❤️ {article.likes || 0}</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Link to={`/admin/articles/${article._id}/edit`} className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300">Edit</Link>
            {article.status === 'published' ? (
              <button onClick={() => handleUnpublish(article._id)} className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300">Unpublish</button>
            ) : (
              <button onClick={() => handlePublish(article._id)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">Publish</button>
            )}
            <button onClick={() => handleToggleFeatured(article._id)} className={`${article.isFeatured ? 'text-yellow-600' : 'text-gray-400'} hover:text-yellow-900 dark:hover:text-yellow-300`}>⭐</button>
            <button onClick={() => handleTogglePinned(article._id)} className={`${article.isPinned ? 'text-blue-600' : 'text-gray-400'} hover:text-blue-900 dark:hover:text-blue-300`}>📌</button>
            <button onClick={() => handleDelete(article._id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  

  if (loading) {
    return (
      <AdminMobileAppWrapper title="Articles">
        <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
          {user?.role === 'admin' && <Sidebar />}
          <div className="adminContent p-4 w-full text-gray-900 dark:text-white">
            <div className="flex items-center justify-center h-64">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                <div className="text-lg">Loading articles...</div>
              </div>
            </div>
          </div>
        </div>
      </AdminMobileAppWrapper>
    );
  }

  return (
    <AdminMobileAppWrapper title="Articles">
      <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
        {user?.role === 'admin' && <Sidebar />}
        <div className="adminContent p-4 w-full text-gray-900 dark:text-white">
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  📝 Articles Management
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Manage your blog articles and content
                </p>
              </div>
              <Link
                to="/admin/articles/create"
                className="mt-4 sm:mt-0 bg-gradient-to-r from-yellow-500 to-red-500 text-white 
              dark:from-yellow-600 dark:to-red-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                + Create Article
              </Link>
            </div>
            <div className="mt-4">
              <ViewToggle currentView={viewMode} onViewChange={setViewMode} views={['table','list','grid']} />
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Search
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
                  Status
                </label>
                <select
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Featured
                </label>
                <select
                  name="isFeatured"
                  value={filters.isFeatured}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All</option>
                  <option value="true">Featured</option>
                  <option value="false">Not Featured</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pinned
                </label>
                <select
                  name="isPinned"
                  value={filters.isPinned}
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All</option>
                  <option value="true">Pinned</option>
                  <option value="false">Not Pinned</option>
                </select>
              </div>
            </div>
          </div>

          {/* Articles Content - View modes */}
          {viewMode === 'table' && renderTableView()}
          {viewMode === 'list' && renderListView()}
          {viewMode === 'grid' && renderGridView()}

          {error && (
            <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
              <div className="text-red-800 dark:text-red-200">{error}</div>
            </div>
          )}
        </div>
      </div>
    </AdminMobileAppWrapper>
  );
};

export default AdminArticles;
