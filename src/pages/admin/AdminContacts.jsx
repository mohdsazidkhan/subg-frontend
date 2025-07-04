import { useEffect, useState } from 'react';
import { getConfig } from '../../config/appConfig';
import { FaUser, FaEnvelope, FaRegCalendarAlt, FaCommentDots } from 'react-icons/fa';

const API_URL = getConfig('API_URL') + '/api/contacts';
const PAGE_LIMIT = 10;

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(PAGE_LIMIT);

  useEffect(() => {
    fetchContacts(page, limit);
    // eslint-disable-next-line
  }, [page, limit]);


  const fetchContacts = async (page, limit) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}?page=${page}&limit=${limit}`);
      const data = await res.json();
      if (data.success) {
        setContacts(data.contacts);
        setTotal(data.total);
        setLimit(data.limit);
      } else {
        setError('Failed to fetch contacts');
      }
    } catch (err) {
      setError('Failed to fetch contacts');
    }
    setLoading(false);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900 dark:from-gray-900 dark:via-blue-900 dark:to-purple-900 dark:text-white">
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div className="flex items-center gap-3">
            <FaCommentDots className="text-3xl text-blue-500 dark:text-purple-400" />
            <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Contacts
            </h1>
          </div>
        </div>
  
        {loading ? (
          <div className="text-center py-10 animate-pulse text-lg font-semibold">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-10 font-semibold">{error}</div>
        ) : contacts.length === 0 ? (
          <div className="text-center py-10 font-semibold">No contacts found.</div>
        ) : (
          <>
            <div className="grid gap-6 mb-4">
              {contacts.map((c) => (
                <div
                  key={c._id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-l-8 border-blue-500 dark:border-purple-500 p-6 hover:scale-[1.02] hover:shadow-blue-200 dark:hover:shadow-purple-700 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <FaUser className="text-blue-500 dark:text-purple-400 text-xl" />
                    <span className="font-bold text-lg">{c.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-300 mb-1">
                    <FaEnvelope className="text-blue-400 dark:text-purple-300" />
                    {c.email}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 whitespace-pre-line mb-2">
                    <FaCommentDots className="text-blue-400 dark:text-purple-300" />
                    <span>{c.message}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-400 mt-2">
                    <FaRegCalendarAlt />
                    {new Date(c.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
  
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900 text-blue-900 dark:text-purple-200 font-semibold disabled:opacity-50 shadow"
                >
                  Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`px-3 py-1 rounded-lg font-semibold shadow ${
                      p === page
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                        : 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-900 dark:text-purple-200'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded-lg bg-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-900 dark:to-purple-900 text-blue-900 dark:text-purple-200 font-semibold disabled:opacity-50 shadow"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
  
} 