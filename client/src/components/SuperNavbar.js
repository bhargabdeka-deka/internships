import React from 'react';
import { Link } from 'react-router-dom';

const SuperNavbar = () => (
  <nav>
    <Link to="/super/dashboard">Dashboard</Link>
    <Link to="/super/promote-user">Promote User</Link>
    <Link to="/super/analytics">Analytics</Link>
    <Link to="/logout">Logout</Link>
  </nav>
);

export default SuperNavbar;