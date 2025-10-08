import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const FollowersList = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchFollowers();
  }, [username, page]);

  const fetchFollowers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` }
      } : {};

      // First get user ID from username
      const profileRes = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/profile/${username}`,
        config
      );
      
      if (profileRes.data.success) {
        const userId = profileRes.data.user.id;
        
        // Then fetch followers
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/users/${userId}/followers?page=${page}&limit=20`,
          config
        );

        if (response.data.success) {
          setFollowers(response.data.followers);
          setPagination(response.data.pagination);
        }
      }
    } catch (error) {
      console.error('Failed to load followers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userUsername) => {
    if (userUsername) {
      navigate(`/profile/${userUsername}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Followers</h1>
        <div className="w-20"></div>
      </div>

      {/* Content */}
      <div className="p-5">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-red-500 rounded-full animate-spin"></div>
          </div>
        ) : followers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">No followers yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {followers.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserClick(user.username)}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-yellow-600 flex items-center justify-center text-white text-xl font-bold">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                  {user.username && (
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">@{user.username}</p>
                  )}
                  {user.level && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user.level.levelName}</p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user.followersCount || 0} followers
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-900 dark:text-white">
              Page {page} of {pagination.totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={page === pagination.totalPages}
              className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowersList;

