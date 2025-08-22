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
  const [viewMode, setViewMode] = useState(isMobile ? 'list' : 'table');
  const [filters, setFilters] = useState({
    status: '',
    level: ''
  });

  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  const fetchStudents = useCallback(async (search = '', filterParams = {}) => {
  try {
    setLoading(true);
    const params = {
      ...(search && { search }),
      ...filterParams
    };
    const response = await API.getAdminStudents(params);
    setStudents(response.students || response);
  } catch (error) {
    console.error('Error fetching students:', error);
    toast.error('Failed to fetch students');
  } finally {
    setLoading(false);
  }
}, []);


  const debouncedSearch = useDebounce(searchTerm, 1000);

useEffect(() => {
  fetchStudents(debouncedSearch, filters);
}, [debouncedSearch, filters, fetchStudents]);


  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ status: '', level: '' });
  };

  const handleStatusChange = async (studentId, newStatus) => {
    try {
      await API.updateStudent(studentId, { status: newStatus });
      toast.success('Student status updated successfully!');
      fetchStudents(searchTerm, filters);
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
        fetchStudents(searchTerm, filters);
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

  // Custom render function for student actions that includes status dropdown
  const renderStudentActions = (student) => (
    <div className="flex items-center space-x-2">
      {/* Status Dropdown */}
      <select
        value={student.status || 'active'}
        onChange={(e) => handleStatusChange(student._id, e.target.value)}
        className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
        title="Change Status"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
        <option value="pending">Pending</option>
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
    <div className={`adminPanel ${isOpen ? 'showPanel' : 'hidePanel'}`}>
      {user?.role === 'admin' && isAdminRoute && <Sidebar />}
      <div className="adminContent p-2 md:p-6 w-full text-gray-900 dark:text-white">
        {/* Enhanced Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div>
              <h1 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 dark:text-white">
              Manage Students ({students.length})
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                Manage and monitor student accounts, performance, and engagement
              </p>
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
            viewModes={['table', 'list', 'grid']}
            defaultView={viewMode}
            showPagination={false}
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
