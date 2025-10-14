import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import API from '../../utils/api';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';
import AdminMobileAppWrapper from '../../components/AdminMobileAppWrapper';
import { MdAdd, MdEdit, MdDelete, MdClose, MdSave, MdCancel, MdSearch, MdRefresh } from 'react-icons/md';
import { useLocation } from 'react-router-dom';

const LevelsPage = () => {
  const isOpen = useSelector((state) => state.sidebar?.isOpen);
  const user = useSelector((state) => state.auth?.user);
  const location = useLocation();
  
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    levelNumber: '',
    name: '',
    description: '',
    quizzesRequired: '',
    emoji: '🎯',
    requiredSubscription: 'free',
    color: '#3B82F6',
    icon: '',
    isActive: true
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState('all');

  const isAdminRoute = location.pathname?.startsWith('/admin');

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get('/admin/levels', {
        params: {
          limit: 100,
          isActive: filterActive === 'all' ? undefined : filterActive === 'active'
        }
      });
      
      if (response.data.success) {
        setLevels(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch levels');
      console.error('Error fetching levels:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const resetForm = () => {
    setFormData({
      levelNumber: '',
      name: '',
      description: '',
      quizzesRequired: '',
      emoji: '🎯',
      requiredSubscription: 'free',
      color: '#3B82F6',
      icon: '',
      isActive: true
    });
    setEditingLevel(null);
  };

  const handleCreateLevel = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await API.post('/admin/levels', {
        ...formData,
        levelNumber: parseInt(formData.levelNumber),
        quizzesRequired: parseInt(formData.quizzesRequired)
      });
      
      if (response.data.success) {
        setSuccess('Level created successfully!');
        fetchLevels();
        setShowModal(false);
        resetForm();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create level');
    }
  };

  const handleUpdateLevel = async (e) => {
    e.preventDefault();
    try {
      setError(null);
      const response = await API.put(`/admin/levels/${editingLevel._id}`, {
        ...formData,
        levelNumber: parseInt(formData.levelNumber),
        quizzesRequired: parseInt(formData.quizzesRequired)
      });
      
      if (response.data.success) {
        setSuccess('Level updated successfully!');
        fetchLevels();
        setShowModal(false);
        resetForm();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update level');
    }
  };

  const handleDeleteLevel = async (levelId) => {
    try {
      setError(null);
      const response = await API.delete(`/admin/levels/${levelId}`);
      
      if (response.data.success) {
        setSuccess('Level deleted successfully!');
        fetchLevels();
        setShowDeleteConfirm(null);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete level');
      setShowDeleteConfirm(null);
    }
  };

  const openEditModal = (level) => {
    setEditingLevel(level);
    setFormData({
      levelNumber: level.levelNumber,
      name: level.name,
      description: level.description,
      quizzesRequired: level.quizzesRequired,
      emoji: level.emoji || '🎯',
      requiredSubscription: level.requiredSubscription || 'free',
      color: level.color || '#3B82F6',
      icon: level.icon || '',
      isActive: level.isActive
    });
    setShowModal(true);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const filteredLevels = levels.filter(level => {
    const matchesSearch = 
      level.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      level.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      level.levelNumber.toString().includes(searchTerm);
    
    return matchesSearch;
  });

  return (
    <AdminMobileAppWrapper title="Levels Management">
      <Helmet>
        <title>Levels Management - Admin Panel</title>
      </Helmet>
      <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
        {user?.role === 'admin' && isAdminRoute && <Sidebar />}
        <div className="adminContent p-2 md:p-6 w-full text-gray-900 dark:text-white">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              🎯 Levels Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage user progression levels and requirements
            </p>
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div className="mb-4 p-4 bg-green-100 dark:bg-green-900 border border-green-400 dark:border-green-700 text-green-700 dark:text-green-200 rounded-lg">
              {success}
            </div>
          )}
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 rounded-lg">
              {error}
            </div>
          )}

          {/* Actions Bar */}
          <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex flex-col md:flex-row gap-4 flex-1 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 md:max-w-md">
                <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search levels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Filter */}
              <select
                value={filterActive}
                onChange={(e) => {
                  setFilterActive(e.target.value);
                  fetchLevels();
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Levels</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 w-full md:w-auto">
              <button
                onClick={fetchLevels}
                className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                <MdRefresh /> Refresh
              </button>
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <MdAdd /> Create Level
              </button>
            </div>
          </div>

          {/* Levels Table */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-2xl text-gray-600 dark:text-gray-400">Loading levels...</div>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Quizzes Required
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Subscription
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredLevels.map((level) => (
                    <tr key={level._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{level.emoji}</span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {level.levelNumber}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {level.name}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                          {level.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {level.quizzesRequired}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${level.requiredSubscription === 'free' ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' : ''}
                          ${level.requiredSubscription === 'basic' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
                          ${level.requiredSubscription === 'premium' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : ''}
                          ${level.requiredSubscription === 'pro' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : ''}
                        `}>
                          {level.requiredSubscription}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${level.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                          {level.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openEditModal(level)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                        >
                          <MdEdit className="inline text-xl" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(level)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <MdDelete className="inline text-xl" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredLevels.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  No levels found
                </div>
              )}
            </div>
          )}

          {/* Create/Edit Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {editingLevel ? 'Edit Level' : 'Create New Level'}
                    </h2>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        resetForm();
                      }}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <MdClose className="text-2xl" />
                    </button>
                  </div>

                  <form onSubmit={editingLevel ? handleUpdateLevel : handleCreateLevel} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Level Number *
                        </label>
                        <input
                          type="number"
                          name="levelNumber"
                          value={formData.levelNumber}
                          onChange={handleInputChange}
                          required
                          min="0"
                          max="100"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Emoji
                        </label>
                        <input
                          type="text"
                          name="emoji"
                          value={formData.emoji}
                          onChange={handleInputChange}
                          placeholder="🎯"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g., Starter, Rookie, Legend"
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                        rows="3"
                        placeholder="Describe this level..."
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Quizzes Required *
                        </label>
                        <input
                          type="number"
                          name="quizzesRequired"
                          value={formData.quizzesRequired}
                          onChange={handleInputChange}
                          required
                          min="0"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Required Subscription
                        </label>
                        <select
                          name="requiredSubscription"
                          value={formData.requiredSubscription}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="free">Free</option>
                          <option value="basic">Basic</option>
                          <option value="premium">Premium</option>
                          <option value="pro">Pro</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Color
                        </label>
                        <input
                          type="color"
                          name="color"
                          value={formData.color}
                          onChange={handleInputChange}
                          className="w-full h-10 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleInputChange}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Active
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="flex gap-4 justify-end pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          resetForm();
                        }}
                        className="flex items-center gap-2 px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <MdCancel /> Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <MdSave /> {editingLevel ? 'Update' : 'Create'} Level
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {showDeleteConfirm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  Confirm Delete
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Are you sure you want to delete <strong>{showDeleteConfirm.name}</strong> (Level {showDeleteConfirm.levelNumber})?
                  This action cannot be undone.
                </p>
                <div className="flex gap-4 justify-end">
                  <button
                    onClick={() => setShowDeleteConfirm(null)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDeleteLevel(showDeleteConfirm._id)}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminMobileAppWrapper>
  );
};

export default LevelsPage;

