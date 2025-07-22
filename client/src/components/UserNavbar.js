import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import profileIcon from '../assets/profile-icon.png'; // ✅ Ensure this image exists
import './UserNavbar.css';

const UserNavbar = () => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);

  // 🧠 Safely read user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user:", err);
        setUser(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear(); // 🧹 Clean all session data
    navigate('/login');
  };

  return (
    <nav className="user-navbar">
      <div className="navbar-left">
        <Link to="/homepage">🏠 Home</Link>
        <Link to="/apply">📝 Apply</Link>
        <Link to="/kyc-bill">📃 KYC & Bill</Link>
        <Link to="/helpdesk">📩 Helpdesk</Link>
        <Link to="/tracker">📊 Tracker</Link>

      </div>

      <div className="navbar-right">
        <img
          src={profileIcon}
          alt="Profile"
          className="profile-avatar"
          onClick={() => setShowProfile(!showProfile)}
        />

        {/* Optional inline greeting */}
        

        {/* Dropdown */}
        {showProfile && user && (
          <div className="profile-dropdown">
            <p><strong>Name:</strong> {user.name || '—'}</p>
            <p><strong>Meter No:</strong> {user.meterNumber || '—'}</p>
            <p><strong>Email:</strong> {user.email || '—'}</p>
            <button onClick={handleLogout}>🔴 Logout</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default UserNavbar;