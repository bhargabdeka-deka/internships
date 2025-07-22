import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  // 🔐 Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.token) {
          setUser(parsedUser);
        } else {
          console.warn('⛔ Token missing in stored user. Redirecting.');
          localStorage.clear();
          navigate('/login');
        }
      } catch (error) {
        console.error('❌ Failed to parse user from localStorage:', error);
        localStorage.clear();
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
    setLoading(false);
  }, [navigate]);

  // 📊 Fetch dashboard info
  const fetchDashboard = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await axios.get('http://localhost:5000/api/users/dashboard', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      console.log('📊 Dashboard info:', res.data);
      setDashboardData(res.data);
    } catch (err) {
      console.error('❌ Dashboard fetch failed:', err);
    }
  }, [user?.token]);

  // 📌 Fetch connection status
  const fetchStatus = useCallback(async () => {
    if (!user?.meterNumber || !user?.token) return;
    setStatusLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/connections/user/${user.meterNumber}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );
      setStatus(res.data?.status || 'Not Applied');
      setLastChecked(new Date());
    } catch (err) {
      console.error('❌ Status fetch error:', err);
      setStatus('Not Applied');
    } finally {
      setStatusLoading(false);
    }
  }, [user?.meterNumber, user?.token]);

  // 🔁 Load dashboard + status when user is ready
  useEffect(() => {
    if (user?.token && user?.meterNumber) {
      fetchStatus();
      fetchDashboard();
    }
  }, [user?.token, user?.meterNumber, fetchStatus, fetchDashboard]);

  if (loading) return <div className="home-container">Loading dashboard...</div>;
  if (!user) return null;

  return (
    <div className="home-container">
      <h1>
        ⚡ Welcome{dashboardData?.name ? `, ${dashboardData.name.split(' ')[0]}` : ''}!
      </h1>
      {dashboardData?.district && (
        <p className="greeting">Serving district: {dashboardData.district}</p>
      )}
      <p className="greeting">Explore our services below</p>

      {status && (
        <p className="status-banner">
          📌 Connection Request Status:{' '}
          <strong>{statusLoading ? 'Loading...' : status}</strong>
        </p>
      )}

      <div className="card-grid">
        <div className="service-card" onClick={() => navigate('/apply')}>
          <div className="icon">📝</div>
          <h3>Apply for New Connection</h3>
          <p>Submit a request for a fresh electricity connection.</p>
        </div>

        <div className="service-card" onClick={() => navigate('/kyc-bill')}>
          <div className="icon">💳</div>
          <h3>Bill & KYC Update</h3>
          <p>Pay electricity bills and upload KYC documents.</p>
        </div>

        <div className="service-card" onClick={() => navigate('/helpdesk')}>
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

      <div className="refresh-container">
        <button
          className="refresh-button"
          onClick={() => {
            fetchStatus();
            fetchDashboard();
          }}
          disabled={statusLoading}
        >
          {statusLoading ? '⏳ Checking...' : '🔁 Refresh Connection Status'}
        </button>
        {!statusLoading && lastChecked && (
          <p className="last-updated">
            ✅ Last checked: {lastChecked.toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
}

export default HomePage;