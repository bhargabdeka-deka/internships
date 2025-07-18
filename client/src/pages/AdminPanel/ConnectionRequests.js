import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ConnectionRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    axios.get('/api/admin/applications', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setRequests(res.data));
  }, []);

  return (
    <div>
      <h3>📋 Pending Connection Requests</h3>
      {requests.map((r, i) => (
        <div key={i}>
          <p>Name: {r.name}</p>
          <p>District: {r.district}</p>
          <button>Approve</button> {/* Wire this up later */}
        </div>
      ))}
    </div>
  );
};

export default ConnectionRequests;