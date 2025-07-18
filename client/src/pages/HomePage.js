import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import profileIcon from '../assets/profile-icon.png'; // Make sure this image exists

function HomePage() {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  return (
    <div className="home-container">
      {/* 👤 Profile Icon + Dropdown */}
      <div className="topbar">
        <img
          src={profileIcon}
          alt="Profile"
          className="profile-avatar"
          onClick={() => setShowProfile(!showProfile)}
        />

        {showProfile && (
          <div className="profile-dropdown">
            <p><strong>Meter No:</strong> 101456789012</p>
            <p><strong>Email:</strong> {localStorage.getItem('userEmail') || 'Not logged in'}</p>
            <button className="logout-button" onClick={handleLogout}>🚪 Logout</button>
          </div>
        )}
      </div>

      {/* 💡 Main Dashboard */}
      <h1>⚡ Welcome to Your Electricity Dashboard</h1>
      <p className="greeting">Explore our services below</p>

      <div className="card-grid">
        <div className="service-card" onClick={() => navigate('/apply')}>
          <div className="icon">📝</div>
          <h3>Apply for New Connection</h3>
          <p>Submit a request for a fresh electricity connection.</p>
        </div>

        <div className="service-card">
          <div className="icon">💳</div>
          <h3>Bill & KYC Update</h3>
          <p>Pay electricity bills and upload KYC documents.</p>
        </div>

        <div className="service-card">
          <div className="icon">📞</div>
          <h3>Helpdesk</h3>
          <p>Submit complaints or maintenance requests.</p>
        </div>

        <div className="service-card" onClick={() => navigate('/tracker')}>
          <div className="icon">📊</div>
          <h3>Energy Tracker</h3>
          <p>View electricity usage stats and patterns.</p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;