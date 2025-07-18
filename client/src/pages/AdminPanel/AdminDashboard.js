import React from 'react';
import { Link } from 'react-router-dom';

const user = JSON.parse(localStorage.getItem('user')); // Optional: to personalize greeting

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard" style={styles.container}>
      <h2 style={styles.heading}>⚙️ Admin Control Panel</h2>

      <p style={styles.welcome}>
        Welcome <strong>{user?.name}</strong> ({user?.role})
      </p>

      <div style={styles.cardContainer}>
        <div style={styles.card}>
          <h3>📥 Connection Requests</h3>
          <p>Approve pending service applications</p>
          <Link to="/admin/connections" style={styles.button}>View Requests</Link>
        </div>

        <div style={styles.card}>
          <h3>🆘 Helpdesk Tickets</h3>
          <p>Respond to complaints & resolve issues</p>
          <Link to="/admin/helpdesk" style={styles.button}>View Tickets</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#333'
  },
  welcome: {
    marginBottom: '2rem',
    fontSize: '1rem'
  },
  cardContainer: {
    display: 'flex',
    gap: '1.5rem',
    flexWrap: 'wrap'
  },
  card: {
    flex: '1',
    minWidth: '250px',
    padding: '1rem',
    border: '1px solid #ccc',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9'
  },
  button: {
    marginTop: '0.5rem',
    display: 'inline-block',
    padding: '8px 12px',
    backgroundColor: '#0078d4',
    color: '#fff',
    borderRadius: '4px',
    textDecoration: 'none'
  }
};

export default AdminDashboard;