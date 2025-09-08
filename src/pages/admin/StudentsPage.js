import { useState, useEffect, useCallback } from 'react';
import API from '../../utils/api';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ResponsiveTable from '../../components/ResponsiveTable';
import Pagination from '../../components/Pagination';
import ViewToggle from '../../components/ViewToggle';
import SearchFilter from '../../components/SearchFilter';
import { FaTrash, FaEnvelope, FaPhone, FaEye, FaEdit } from 'react-icons/fa';
import { isMobile } from 'react-device-detect';
import useDebounce from "../../utils/useDebounce";
import AdminMobileAppWrapper from '../../components/AdminMobileAppWrapper';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({});
  const [viewMode, setViewMode] = useState(isMobile ? 'list' : 'table');
  const [filters, setFilters] = useState({
    level: ''
  });

  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const fetchStudents = useCallback(async (page = 1, search = '', filterParams = {}) => {
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
  }, [itemsPerPage]);

  const debouncedSearch = useDebounce(searchTerm, 1000);

  useEffect(() => {
    fetchStudents(currentPage, debouncedSearch, filters);
  }, [debouncedSearch, filters, fetchStudents, currentPage]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ level: '' });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (e) => {
    const newItemsPerPage = parseInt(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleStatusChange = async (studentId, updateData) => {
    try {
      await API.updateStudent(studentId, updateData);
      toast.success('Student updated successfully!');
      fetchStudents(currentPage, searchTerm, filters);
    } catch (error) {
      console.error('Error updating student:', error);
      toast.error('Failed to update student');
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
      6: 'Mastermind', 7: 'Champion', 8: 'Prodigy', 9: 'Wizard', 10: 'Legend'
    };
    return levelNames[level] || 'Unknown';
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      free: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      basic: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      premium: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      pro: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
    };
    return statusConfig[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  };

  const filterOptions = {
    level: {
      label: 'Level',
      options: Array.from({ length: 10 }, (_, i) => ({
        value: (i + 1).toString(),
        label: `Level ${i + 1} - ${getLevelName(i + 1)}`
      }))
    }
  };

  // Define table columns for ResponsiveTable
  const columns = [
    {
      key: 'student',
      header: 'Student',
      render: (_, student) => (
                  <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-red-500 to-yellow-500 flex items-center justify-center">
              <span className="text-white font-medium text-sm sm:text-base">
                          {student.name?.charAt(0)?.toUpperCase() || 'U'}
                        </span>
                      </div>
                    </div>
          <div className="ml-3 sm:ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {student.name}
                      </div>
                    </div>
                  </div>
      )
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (_, student) => (
        <div>
                  <div className="text-sm text-gray-900 dark:text-white">{student.email}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">{student.phone || 'No phone'}</div>
        </div>
      )
    },
    {
      key: 'level',
      header: 'Level',
      render: (_, student) => (
        <div>
                  <div className="text-sm text-gray-900 dark:text-white">
                    Level {student.level?.currentLevel || 1}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-300">
                    {getLevelName(student.level?.currentLevel || 1)}
                  </div>
        </div>
      )
    },
    {
      key: 'referralCode',
      header: 'Ref. Code',
      render: (_, student) => (
                  <div className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {student.referralCode || 'N/A'}
                  </div>
      )
    },
    {
      key: 'referralCount',
      header: 'Ref Count',
      render: (_, student) => (
                  <div className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-gray-800 dark:bg-gray-900 dark:text-white">
                    {student.referralCount || 0}
                  </div>
      )
    },
    {
      key: 'subscriptionStatus',
      header: 'Subscription',
      render: (_, student) => (
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(student.subscriptionStatus)}`}>
                    {student.subscriptionStatus || 'free'}
                  </span>
      )
    },
    {
      key: 'joined',
      header: 'Joined',
      render: (_, student) => (
        <div className="text-sm text-gray-500 dark:text-gray-300">
                  {new Date(student.createdAt).toLocaleDateString()}
                  </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, student) => renderStudentActions(student)
    }
  ];

  // Custom render function for student actions that includes status dropdown
  const renderStudentActions = (student) => (
    <div className="flex items-center space-x-2">
      {/* Subscription Status Dropdown */}
      <select
        value={student.subscriptionStatus || 'free'}
        onChange={(e) => handleStatusChange(student._id, { subscriptionStatus: e.target.value })}
        className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        title="Change Subscription Status"
      >
        <option value="free">Free</option>
        <option value="basic">Basic</option>
        <option value="premium">Premium</option>
        <option value="pro">Pro</option>
      </select>
      
      {/* Edit Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          // Handle edit functionality
          console.log('Edit student:', student);
        }}
        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-1.5 sm:p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        title="Edit Student"
      >
        <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
      
      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(student._id);
        }}
        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1.5 sm:p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        title="Delete Student"
      >
        <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
    </div>
  );



  return (
    <AdminMobileAppWrapper title="Students">
      <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
        {user?.role === 'admin' && isAdminRoute && <Sidebar />}
        <div className="adminContent p-2 md:p-6 w-full text-gray-900 dark:text-white">
        {/* Enhanced Header */}
        <div className="mb-4">
          <div className="flex items-center gap-4 mb-2">
            <div>
              <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white">
              Manage Students ({pagination.total || students.length})
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Manage and monitor student accounts, performance, and engagement
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearch}
          placeholder="Search students by name, email, or phone..."
        />

        {/* Combined View Toggle and Page Size Controls */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <div className="flex-shrink-0">
            <ViewToggle
              currentView={viewMode}
              onViewChange={setViewMode}
              views={['table', 'list', 'grid']}
            />
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            <label className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">Show:</label>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white min-w-0"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={250}>250</option>
              <option value={500}>500</option>
              <option value={1000}>1000</option>
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
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
            <ResponsiveTable
              data={students}
              columns={columns}
              viewModes={['table', 'list', 'grid']}
              defaultView={viewMode}
              showPagination={false}
              showViewToggle={false}
              loading={loading}
              emptyMessage="No students found"
              onRowClick={(student) => {
                // Handle row click if needed
                console.log('Student clicked:', student);
              }}
            />

            {/* External Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                totalItems={pagination.total}
                itemsPerPage={itemsPerPage}
              />
            )}
          </>
        )}
        </div>
      </div>
    </AdminMobileAppWrapper>
  );
};

export default StudentsPage;
