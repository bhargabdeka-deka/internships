import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PromoteUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('/api/superadmin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch users');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const promote = async (id) => {
    try {
      await axios.put(`/api/superadmin/promote/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('✅ User promoted!');
      fetchUsers(); // refresh list after promotion
    } catch (err) {
      alert('❌ Promotion failed!');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>👤 Promote Users to Admin</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        users.length === 0 ? (
          <p>No users found</p>
        ) : (
          <div style={styles.userList}>
            {users.map((u) => (
              <div key={u._id} style={styles.card}>
                <p><strong>{u.name}</strong> <span style={styles.role}>({u.role})</span></p>
                <p>Email: {u.email}</p>
                <p>District: {u.district}</p>

                {u.role === 'user' ? (
                  <button style={styles.button} onClick={() => promote(u._id)}>Promote</button>
                ) : (
                  <span style={styles.badge}>Already {u.role}</span>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    fontFamily: 'Segoe UI, sans-serif'
  },
  heading: {
    fontSize: '1.8rem',
    marginBottom: '1rem',
    color: '#333'
  },
  userList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1rem',
    width: '280px',
    background: '#f9f9f9'
  },
  role: {
    color: '#555'
  },
  button: {
    marginTop: '0.5rem',
    padding: '6px 12px',
    background: '#0078D4',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  },
  badge: {
    marginTop: '0.5rem',
    display: 'inline-block',
    padding: '6px 12px',
    background: '#ccc',
    borderRadius: '4px',
    color: '#333'
  }
};

export default PromoteUser;