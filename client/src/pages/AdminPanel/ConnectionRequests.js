import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ConnectionRequests.css';

const ConnectionRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (user?.token && user?.role === 'admin') {
      fetchRequests();
    }
    // eslint-disable-next-line
  }, []);

  const fetchRequests = async () => {
    if (!user?.token || user?.role !== 'admin') {
      setError('⛔ Access denied. Admin role required.');
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get('/api/admin/applications', {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      setRequests(res.data);
    } catch (err) {
      setError(err.response?.data?.message || '❗ Failed to fetch requests.');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/applications/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${user.token}` }
      });
      alert(`✅ Application ${status} successfully!`);
      fetchRequests();
    } catch (err) {
      alert('⚠️ Failed to update application.');
    }
  };

  const pending = requests.filter((r) => r.status?.trim() === 'Pending');
  const processed = requests.filter((r) => {
    const status = r.status?.trim();
    return status === 'Approved' || status === 'Rejected';
  });

  return (
    <div className="request-dashboard">
      {/* 🟡 Pending Panel */}
      <div className="pending-section">
        <h3>📋 Pending Connection Requests</h3>
        {loading ? (
          <p>🔄 Loading...</p>
        ) : error ? (
          <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>
        ) : pending.length === 0 ? (
          <p>✅ No pending requests.</p>
        ) : (
          pending.map((r) => (
            <div key={r._id} className="request-card">
              <p><strong>Name:</strong> {r.fullName}</p>
              <p><strong>Type:</strong> {r.userType}</p>
              <p><strong>Address:</strong> {r.address}</p>
              <p><strong>Pincode:</strong> {r.pincode}</p>
              <p><strong>Meter:</strong> {r.meterType}</p>
              <p><strong>Meter Number:</strong> {r.meterNumber}</p> {/* ✅ Added */}
              <p><strong>Load:</strong> {r.load} kW</p>
              <p><strong>Submitted:</strong> {r.createdAt?.slice(0, 10)}</p>

              <div className="request-actions">
                <button className="btn-approve" onClick={() => updateStatus(r._id, 'Approved')}>
                  ✅ Approve
                </button>
                <button className="btn-reject" onClick={() => updateStatus(r._id, 'Rejected')}>
                  ❌ Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ✅ Processed Panel */}
      <div className="processed-section">
        <h3>📁 Processed Applications</h3>
        {processed.length === 0 ? (
          <p>📭 No approved or rejected requests.</p>
        ) : (
          processed.map((r) => (
            <div key={r._id} className="request-card processed">
              <p><strong>Name:</strong> {r.fullName}</p>
              <p><strong>Contact:</strong> {r.contact}</p>
              <p><strong>Pincode:</strong> {r.pincode}</p>
              <p><strong>Meter:</strong> {r.meterType}</p>
              <p><strong>Meter Number:</strong> {r.meterNumber}</p> {/* ✅ Added */}
              <p>
                <strong>Status:</strong>{' '}
                <span className={r.status === 'Approved' ? 'status-approved' : 'status-rejected'}>
                  {r.status}
                </span>
              </p>
              <p><strong>Decision Date:</strong> {r.decisionDate?.slice(0, 10) || '—'}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ConnectionRequests;