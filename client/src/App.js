import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 🌐 User Pages
import HomePage from './pages/HomePage';
import Signup from './pages/Signup';
import Login from './pages/Login';
import WelcomePage from './pages/WelcomePage';
import ConnectionForm from './pages/ConnectionForm';
import EnergyTrackerPage from './pages/EnergyTrackerPage';

// 🛠️ Admin Panel Pages
import AdminDashboard from './pages/AdminPanel/AdminDashboard';
import ConnectionRequests from './pages/AdminPanel/ConnectionRequests';
import HelpdeskTickets from './pages/AdminPanel/HelpdeskTickets';

// 👑 Super Admin Panel Pages
import SuperAdminPanel from './pages/SuperPanel/SuperAdminPanel';
import PromoteUser from './pages/SuperPanel/PromoteUser';

// 🧭 Global Navigation
import Navbar from './components/Navbar'; // Optional if you've created this

// 🔐 Load user from localStorage or global state
const user = JSON.parse(localStorage.getItem('user'));

function App() {
  return (
    <Router>
      <Navbar /> {/* Optional: comment out if not using navbar */}
      <Routes>
        {/* 🎉 Public/User Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/apply" element={<ConnectionForm />} />
        <Route path="/tracker" element={<EnergyTrackerPage />} />

        {/* 🔐 Admin Routes: accessible by admin or superadmin */}
        <Route
          path="/admin"
          element={['admin', 'superadmin'].includes(user?.role)
            ? <AdminDashboard />
            : <Navigate to="/" />}
        />
        <Route
          path="/admin/connections"
          element={['admin', 'superadmin'].includes(user?.role)
            ? <ConnectionRequests />
            : <Navigate to="/" />}
        />
        <Route
          path="/admin/helpdesk"
          element={['admin', 'superadmin'].includes(user?.role)
            ? <HelpdeskTickets />
            : <Navigate to="/" />}
        />

        {/* 👑 Superadmin Routes: exclusive access */}
        <Route
          path="/superadmin"
          element={user?.role === 'superadmin'
            ? <SuperAdminPanel />
            : <Navigate to="/" />}
        />
        <Route
          path="/superadmin/promote"
          element={user?.role === 'superadmin'
            ? <PromoteUser />
            : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;