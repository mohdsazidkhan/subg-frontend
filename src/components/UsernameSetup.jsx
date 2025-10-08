import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UsernameSetup.css';

const UsernameSetup = ({ currentUsername, onUpdate }) => {
  const [username, setUsername] = useState(currentUsername || '');
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (currentUsername) {
      setUsername(currentUsername);
    }
  }, [currentUsername]);

  useEffect(() => {
    // Debounce username availability check
    const timer = setTimeout(() => {
      if (username && username !== currentUsername && username.length >= 3) {
        checkUsernameAvailability();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const checkUsernameAvailability = async () => {
    try {
      setChecking(true);
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/student/check-username?username=${username}`
      );

      if (response.data.success) {
        setAvailable(response.data.available);
        setMessage(response.data.message);
      }
    } catch (error) {
      console.error('Failed to check username:', error);
      setMessage('Failed to check username availability');
      setAvailable(false);
    } finally {
      setChecking(false);
    }
  };

  const handleUsernameChange = (e) => {
    const value = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
    setUsername(value);
    setAvailable(null);
    setMessage('');
  };

  const handleSave = async () => {
    if (!username || username.length < 3 || username.length > 20) {
      setMessage('Username must be 3-20 characters');
      return;
    }

    if (!available && username !== currentUsername) {
      setMessage('Please choose an available username');
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/student/username`,
        { username },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setMessage('Username updated successfully! ✓');
        onUpdate && onUpdate(response.data.username);
      }
    } catch (error) {
      console.error('Failed to update username:', error);
      setMessage(error.response?.data?.message || 'Failed to update username');
    } finally {
      setSaving(false);
    }
  };

  const isValid = username.length >= 3 && username.length <= 20;
  const canSave = isValid && (username === currentUsername || available === true);

  return (
    <div className="username-setup">
      <h3>Set Your Username</h3>
      <p className="username-info">
        Choose a unique username that others can use to find and follow you.
      </p>

      <div className="username-input-group">
        <div className="username-prefix">@</div>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="username"
          maxLength={20}
          className={`username-input ${
            username && username !== currentUsername 
              ? (available === true ? 'valid' : available === false ? 'invalid' : '') 
              : ''
          }`}
        />
        {checking && <span className="checking-spinner"></span>}
        {available === true && username !== currentUsername && (
          <span className="status-icon success">✓</span>
        )}
        {available === false && (
          <span className="status-icon error">✗</span>
        )}
      </div>

      <div className="username-rules">
        <small>
          • 3-20 characters<br />
          • Only letters, numbers, and underscores<br />
          • No spaces or special characters
        </small>
      </div>

      {message && (
        <div className={`username-message ${available === true ? 'success' : available === false ? 'error' : 'info'}`}>
          {message}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={!canSave || saving}
        className="save-username-btn"
      >
        {saving ? 'Saving...' : 'Save Username'}
      </button>
    </div>
  );
};

export default UsernameSetup;

