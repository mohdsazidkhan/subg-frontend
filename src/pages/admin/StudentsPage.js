import { useState, useEffect } from 'react';
import API from '../../utils/api';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Pagination from '../../components/Pagination';
import ViewToggle from '../../components/ViewToggle';
import SearchFilter from '../../components/SearchFilter';
import { FaTrash, FaEnvelope, FaPhone } from 'react-icons/fa';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({});
  const [viewMode, setViewMode] = useState('table');
  const [filters, setFilters] = useState({
    status: '',
    level: ''
  });

  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const fetchStudents = async (page = 1, search = '', filterParams = {}) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: itemsPerPage,
        ...(search && { search }),
        ...filterParams
      };
      const response = await API.getAdminStudents(params);
      setStudents(response.students || response);
      setPagination(response.pagination || {});
    } catch (error) {
      console.error('Error fetching students:', error);
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(currentPage, searchTerm, filters);
  }, [currentPage, searchTerm, itemsPerPage, filters]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ status: '', level: '' });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      await API.updateStudent(studentId, { status: newStatus });
      toast.success('Student status updated successfully!');
      fetchStudents(currentPage, searchTerm, filters);
    } catch (error) {
      console.error('Error updating student status:', error);
      toast.error('Failed to update student status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await API.deleteStudent(id);
        toast.success('Student deleted successfully!');
        fetchStudents(currentPage, searchTerm, filters);
      } catch (error) {
        console.error('Error deleting student:', error);
        toast.error('Failed to delete student');
      }
    }
  };

  const getLevelName = (level) => {
    const levelNames = {
      1: 'Rookie', 2: 'Explorer', 3: 'Thinker', 4: 'Strategist', 5: 'Achiever',
      6: 'Mastermind', 7: 'Champion', 8: 'Prodigy', 9: 'Quiz Wizard', 10: 'Legend'
    };
    return levelNames[level] || 'Unknown';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      inactive: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const filterOptions = {
    status: {
      label: 'Status',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'inactive', label: 'Inactive' },
        { value: 'pending', label: 'Pending' }
      ]
    },
    level: {
      label: 'Level',
      options: Array.from({ length: 10 }, (_, i) => ({
        value: (i + 1).toString(),
        label: `Level ${i + 1} - ${getLevelName(i + 1)}`
      }))
    }
  };

  // Table View Component
  const TableView = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Student
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {students.map((student) => (
              <tr key={student._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center">
                        <span className="text-white font-medium">
                          {student.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {student.name}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">{student.email}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">{student.phone || 'No phone'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    Level {student.level?.currentLevel || 1}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {getLevelName(student.level?.currentLevel || 1)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(student.status)}`}>
                    {student.status || 'active'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {new Date(student.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <select
                      value={student.status || 'active'}
                      onChange={(e) => handleStatusChange(student._id, e.target.value)}
                      className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                    <button
                      onClick={() => handleDelete(student._id)}
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
      {students.map((student) => (
        <div key={student._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 h-12 w-12">
                <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                  <span className="text-white font-medium text-lg">
                    {student.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                  {student.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {student.email}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <FaPhone className="w-4 h-4 mr-2" />
                {student.phone || 'No phone'}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-300">Level:</span>
                  <span className="ml-1 font-medium text-gray-900 dark:text-white">
                    {student.level?.currentLevel || 1} - {getLevelName(student.level?.currentLevel || 1)}
                  </span>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(student.status)}`}>
                  {student.status || 'active'}
                </span>
              </div>
              
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Joined: {new Date(student.createdAt).toLocaleDateString()}
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <select
                value={student.status || 'active'}
                onChange={(e) => handleStatusChange(student._id, e.target.value)}
                className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
              <button
                onClick={() => handleDelete(student._id)}
                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
              >
                <FaTrash className="w-4 h-4" />
              </button>
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
        {students.map((student) => (
          <div key={student._id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1">
                <div className="flex-shrink-0 h-12 w-12">
                  <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {student.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
                <div className="ml-4 flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {student.name}
                  </h3>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
                    <span className="flex items-center">
                      <FaEnvelope className="w-4 h-4 mr-1" />
                      {student.email}
                    </span>
                    {student.phone && (
                      <span className="flex items-center">
                        <FaPhone className="w-4 h-4 mr-1" />
                        {student.phone}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="text-sm text-gray-600 dark:text-gray-300">
                      Level {student.level?.currentLevel || 1} - {getLevelName(student.level?.currentLevel || 1)}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(student.status)}`}>
                      {student.status || 'active'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Joined: {new Date(student.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <select
                  value={student.status || 'active'}
                  onChange={(e) => handleStatusChange(student._id, e.target.value)}
                  className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
                <button
                  onClick={() => handleDelete(student._id)}
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
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Manage Students
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              View and manage student accounts, levels, and status
            </p>
          </div>

          {/* Search and Filters */}
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            filterOptions={filterOptions}
            placeholder="Search students by name, email, or phone..."
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

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">👥</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No students found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search terms.' : 'No students have registered yet.'}
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

export default StudentsPage;
