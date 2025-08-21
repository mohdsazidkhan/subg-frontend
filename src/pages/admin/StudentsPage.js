import { useState, useEffect, useCallback } from 'react';
import API from '../../utils/api';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ResponsiveTable from '../../components/ResponsiveTable';
import { FaTrash, FaEnvelope, FaPhone, FaEye, FaEdit } from 'react-icons/fa';
import { isMobile } from 'react-device-detect';
import useDebounce from "../../utils/useDebounce";

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({});
  const [viewMode, setViewMode] = useState(isMobile ? 'list' : 'table');
  const [filters, setFilters] = useState({
    status: '',
    level: ''
  });

  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const fetchStudents = useCallback(async (page = 1, search = '', filterParams = {}, limit = itemsPerPage) => {
  try {
    setLoading(true);
    const params = {
      page,
      limit,
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
  fetchStudents(currentPage, debouncedSearch, filters, itemsPerPage);
}, [currentPage, debouncedSearch, filters, itemsPerPage, fetchStudents]);


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

  // Define table columns for ResponsiveTable
  const columns = [
    {
      key: 'student',
      header: 'Student',
      render: (_, student) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-8 w-8 sm:h-10 sm:w-10">
            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-500 flex items-center justify-center">
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
      header: 'Referral Code',
      render: (_, student) => (
        <div className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          {student.referralCode || 'N/A'}
        </div>
      )
    },
    {
      key: 'referralCount',
      header: 'Referral Count',
      render: (_, student) => (
        <div className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-gray-800 dark:bg-gray-900 dark:text-white">
          {student.referralCount || 0}
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (_, student) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(student.status)}`}>
          {student.status || 'active'}
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

  // Define actions for ResponsiveTable
  const actions = [
    {
      label: 'Change Status',
      icon: <FaEdit className="w-3 h-3 sm:w-4 sm:h-4" />,
      variant: 'success',
      onClick: (student) => {
        // This will be handled by the status dropdown in the table
      }
    },
    {
      label: 'Delete',
      icon: <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />,
      variant: 'danger',
      onClick: (student) => handleDelete(student._id)
    }
  ];

  // Custom render function for student actions that includes status dropdown
  const renderStudentActions = (student) => (
    <div className="flex items-center space-x-2">
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
        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-1.5 sm:p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
      >
        <FaTrash className="w-3 h-3 sm:w-4 sm:h-4" />
      </button>
    </div>
  );



  return (
    <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
      {user?.role === 'admin' && isAdminRoute && <Sidebar />}
      <div className="adminContent p-2 md:p-6 w-full text-gray-900 dark:text-white">
        {/* Enhanced Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl flex items-center justify-center">
              <span className="text-3xl">👥</span>
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Student Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Manage and monitor student accounts, performance, and engagement
              </p>
            </div>
          </div>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 text-lg">📊</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                    {pagination.total || 0}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                    Total Students
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-200 dark:border-green-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 dark:text-green-400 text-lg">✅</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                    {students.filter(s => s.status === 'active').length}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400 font-medium">
                    Active Students
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-4 rounded-xl border border-yellow-200 dark:border-yellow-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-yellow-600 dark:text-yellow-400 text-lg">📈</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                    {students.filter(s => s.level?.currentLevel >= 5).length}
                  </div>
                  <div className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                    Advanced Level
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl border border-purple-200 dark:border-purple-600">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 dark:text-purple-400 text-lg">💎</span>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">
                    {students.filter(s => s.subscriptionStatus === 'pro' || s.subscriptionStatus === 'premium').length}
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                    Premium Users
                  </div>
                </div>
              </div>
            </div>
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
          <ResponsiveTable
            data={students}
            columns={columns}
            actions={actions}
            viewModes={['table', 'list', 'grid']}
            defaultView={viewMode}
            itemsPerPage={itemsPerPage}
            showPagination={true}
            showViewToggle={true}
            loading={loading}
            emptyMessage="No students found"
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            filterOptions={filterOptions}
            onRowClick={(student) => {
              // Handle row click if needed
              console.log('Student clicked:', student);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default StudentsPage;
