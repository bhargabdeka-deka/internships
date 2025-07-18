import React from 'react';
import { Link } from 'react-router-dom';

const SuperAdminPanel = () => (
  <div className="super-dashboard">
    <h2>👑 Super Admin Panel</h2>
    <ul>
      <li><Link to="/superadmin/users">📋 Manage Users</Link></li>
      <li><Link to="/superadmin/promote">🔼 Promote to Admin</Link></li>
    </ul>
  </div>
);

export default SuperAdminPanel;