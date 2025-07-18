import React from 'react';
import { Link } from 'react-router-dom';

const user = JSON.parse(localStorage.getItem('user'));

const Navbar = () => {
  return (
    <nav className="navbar">
      {/* Common Links */}
      <Link to="/home">🏠 Home</Link>
      <Link to="/apply">⚡ Apply Connection</Link>
      <Link to="/tracker">📊 Energy Tracker</Link>

      {/* Admin Links */}
      {(user?.role === 'admin' || user?.role === 'superadmin') && (
        <Link to="/admin">🔧 Admin Panel</Link>
      )}

      {/* Superadmin Exclusive */}
      {user?.role === 'superadmin' && (
        <Link to="/superadmin">👑 Super Admin Panel</Link>
      )}

      {/* Auth */}
      <Link to="/login">🔐 Login</Link>
    </nav>
  );
};

export default Navbar;