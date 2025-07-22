import React from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';

const user = JSON.parse(localStorage.getItem('user')); // Personalize greeting if available

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard-container">
      <header className="admin-header">
        <h2>⚙️ Admin Control Panel</h2>
        <p>
          Welcome, <strong>{user?.name}</strong> (<em>{user?.role}</em>)
        </p>
      </header>

      <section className="admin-grid">
        {/* 🔌 Connection Requests */}
        <Link to="/admin/connections" className="admin-card">
          <div>
            <h3>📥 Connection Requests</h3>
            <p>Review and approve new connection applications.</p>
          </div>
          <span className="admin-action">View →</span>
        </Link>

        {/* 🛠 Helpdesk Tickets */}
        <Link to="/admin/helpdesk" className="admin-card">
          <div>
            <h3>🆘 Helpdesk Tickets</h3>
            <p>Manage complaints and track issue resolutions.</p>
          </div>
          <span className="admin-action">View →</span>
        </Link>

        {/* 📋 KYC Approvals */}
        <Link to="/admin/kyc-review" className="admin-card">
          <div>
            <h3>📄 KYC Verification</h3>
            <p>Approve user-uploaded KYC documents securely.</p>
          </div>
          <span className="admin-action">Review →</span>
        </Link>
      </section>
    </div>
  );
};

export default AdminDashboard;