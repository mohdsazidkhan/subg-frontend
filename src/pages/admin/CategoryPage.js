import { useState, useEffect } from 'react';
import API from '../../utils/api';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Pagination from '../../components/Pagination';
import ViewToggle from '../../components/ViewToggle';
import SearchFilter from '../../components/SearchFilter';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({});
  const [viewMode, setViewMode] = useState('table');
  const [showForm, setShowForm] = useState(false);

  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const fetchCategories = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: itemsPerPage,
        ...(search && { search })
      };
      const response = await API.getAdminCategories(params);
      setCategories(response.categories || response);
      setPagination(response.pagination || {});
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories(currentPage, searchTerm);
  }, [currentPage, searchTerm, itemsPerPage]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.updateCategory(editingId, { name, description });
        toast.success('Category updated successfully!');
        setEditingId(null);
      } else {
        await API.createCategory({ name, description });
        toast.success('Category created successfully!');
      }
      setName('');
      setDescription('');
      setShowForm(false);
      fetchCategories(currentPage, searchTerm);
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(error.message || 'Failed to save category');
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setName(category.name);
    setDescription(category.description || '');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await API.deleteCategory(id);
        toast.success('Category deleted successfully!');
        fetchCategories(currentPage, searchTerm);
      } catch (error) {
        console.error('Error deleting category:', error);
        toast.error('Failed to delete category');
      }
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setName('');
    setDescription('');
    setShowForm(false);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Table View Component
  const TableView = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {categories.map((category) => (
              <tr key={category._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {category.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                  {category.description || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {new Date(category.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <FaEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category._id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Card View Component
  const CardView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) => (
        <div key={category._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                {category.name}
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
              {category.description || 'No description available'}
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              Created: {new Date(category.createdAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  // List View Component
  const ListView = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {categories.map((category) => (
          <div key={category._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {category.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mt-1">
                  {category.description || 'No description available'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Created: {new Date(category.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(category)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
      {user?.role === 'admin' && isAdminRoute && <Sidebar />}
      <div className="adminContent p-4 w-full text-gray-900 dark:text-white">
        <div className="mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Manage Categories
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Create, edit, and manage quiz categories
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FaPlus className="w-4 h-4 mr-2" />
              Add Category
            </button>
          </div>

          {/* Search and Filters */}
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            placeholder="Search categories..."
          />

          {/* View Toggle */}
          <div className="flex items-center justify-between mb-4">
            <ViewToggle
              currentView={viewMode}
              onViewChange={setViewMode}
            />
            <div className="flex items-center space-x-2">
              <label className="text-sm text-gray-600 dark:text-gray-400">Show:</label>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold mb-4">
                {editingId ? 'Edit Category' : 'Add New Category'}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Enter category description"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    {editingId ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : categories.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📚</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No categories found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search terms.' : 'Get started by creating your first category.'}
              </p>
            </div>
          ) : (
            <>
              {viewMode === 'table' && <TableView />}
              {viewMode === 'card' && <CardView />}
              {viewMode === 'list' && <ListView />}
            </>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
              totalItems={pagination.total}
              itemsPerPage={itemsPerPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
