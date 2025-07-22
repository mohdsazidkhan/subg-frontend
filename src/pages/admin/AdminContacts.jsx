import { useEffect, useState } from 'react';
import { getConfig } from '../../config/appConfig';
import { useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import Pagination from '../../components/Pagination';
import ViewToggle from '../../components/ViewToggle';
import SearchFilter from '../../components/SearchFilter';
import { isMobile } from 'react-device-detect';
import { 
  FaUser, 
  FaEnvelope, 
  FaRegCalendarAlt, 
  FaCommentDots, 
  FaEye, 
  FaTrash, 
  FaPhone,
  FaMapMarkerAlt
} from 'react-icons/fa';

const API_URL = getConfig('API_URL') + '/api/contacts';
const PAGE_LIMIT = 10;

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(PAGE_LIMIT);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState(isMobile ? 'list' : 'table');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [pagination, setPagination] = useState({});

  const user = JSON.parse(localStorage.getItem('userInfo'));
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isOpen = useSelector((state) => state.sidebar.isOpen);

  useEffect(() => {
    fetchContacts(page, limit, searchTerm);
    // eslint-disable-next-line
  }, [page, limit, searchTerm]);

  const fetchContacts = async (page, limit, search = '') => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search })
      });
      
      const res = await fetch(`${API_URL}?${params}`);
      const data = await res.json();
      if (data.success) {
        setContacts(data.contacts);
        setTotal(data.total);
        setLimit(data.limit);
        setPagination({
          currentPage: page,
          totalPages: Math.ceil(data.total / limit),
          total: data.total,
          hasNextPage: page < Math.ceil(data.total / limit),
          hasPrevPage: page > 1
        });
      } else {
        setError('Failed to fetch contacts');
      }
    } catch (err) {
      setError('Failed to fetch contacts');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (res.ok) {
          toast.success('Contact deleted successfully!');
          fetchContacts(page, limit, searchTerm);
        } else {
          toast.error('Failed to delete contact');
        }
      } catch (error) {
        console.error('Error deleting contact:', error);
        toast.error('Failed to delete contact');
      }
    }
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Table View Component
  const TableView = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-[1000px] md:w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Message
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {contacts.map((contact) => (
              <tr key={contact._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                      <FaUser className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {contact.name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                    <FaEnvelope className="w-4 h-4 mr-2" />
                    {contact.email}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                    {contact.message}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                  {formatDate(contact.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => window.open(`mailto:${contact.email}`, '_blank')}
                      className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      title="Send Email"
                    >
                      <FaEnvelope className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(contact._id)}
                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete Contact"
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
      {contacts.map((contact) => (
        <div key={contact._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                  <FaUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {contact.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {contact.email}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => window.open(`mailto:${contact.email}`, '_blank')}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  title="Send Email"
                >
                  <FaEnvelope className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(contact._id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Delete Contact"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
              {contact.message}
            </p>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <FaRegCalendarAlt className="inline mr-1" />
              {formatDate(contact.createdAt)}
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
        {contacts.map((contact) => (
          <div key={contact._id} className="p-2 md:p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                    <FaUser className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {contact.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {contact.email}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mt-2 mb-2">
                  {contact.message}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <FaRegCalendarAlt className="inline mr-1" />
                  {formatDate(contact.createdAt)}
                </p>
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => window.open(`mailto:${contact.email}`, '_blank')}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 p-2 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  title="Send Email"
                >
                  <FaEnvelope className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(contact._id)}
                  className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Delete Contact"
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
                Manage Contacts ({pagination.total})
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                View and manage contact form submissions
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={handleSearch}
            placeholder="Search contacts by name or email..."
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
                  setPage(1);
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
          ) : error ? (
            <div className="text-center py-12">
              <div className="text-red-500 text-6xl mb-4">⚠️</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Error loading contacts
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {error}
              </p>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📧</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No contacts found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search terms.' : 'No contact form submissions yet.'}
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
              currentPage={pagination.currentPage}
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
} 