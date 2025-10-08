import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './UserSearch.css';

const UserSearch = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchUsers();
      } else {
        setUsers([]);
        setSearched(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const searchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/users/search?query=${query}`
      );

      if (response.data.success) {
        setUsers(response.data.users);
        setSearched(true);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (username) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="user-search-container">
      <div className="search-box">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users by name or username..."
          className="search-input"
        />
        {loading && <span className="search-spinner"></span>}
      </div>

      {searched && users.length === 0 && !loading && (
        <div className="no-results">
          <p>No users found for "{query}"</p>
        </div>
      )}

      {users.length > 0 && (
        <div className="search-results">
          {users.map((user) => (
            <div
              key={user._id}
              className="user-result-item"
              onClick={() => handleUserClick(user.username)}
            >
              <img
                src={user.profilePicture || '/logo.png'}
                alt={user.name}
                className="user-result-avatar"
              />
              <div className="user-result-info">
                <h4>{user.name}</h4>
                <p className="user-result-username">@{user.username}</p>
                {user.bio && <p className="user-result-bio">{user.bio}</p>}
              </div>
              <div className="user-result-stats">
                <div className="user-stat">
                  <span className="level-badge-small">
                    L{user.level?.currentLevel || 0}
                  </span>
                </div>
                <div className="user-stat">
                  <span>{user.followersCount || 0}</span>
                  <small>Followers</small>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;

