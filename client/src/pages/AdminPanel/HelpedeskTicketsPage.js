import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HelpdeskTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [reply, setReply] = useState('');

  useEffect(() => {
    axios.get('/api/admin/tickets', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setTickets(res.data));
  }, []);

  const sendReply = async (id) => {
    try {
      await axios.put(`/api/admin/tickets/${id}/reply`, { reply }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Reply sent successfully!');
      setReply('');
      // Optionally refresh the list
      const updated = await axios.get('/api/admin/tickets', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setTickets(updated.data);
    } catch (error) {
      alert('Reply failed!');
    }
  };

  return (
    <div>
      <h2>🆘 Helpdesk Tickets</h2>
      {tickets.length === 0 ? (
        <p>No tickets found</p>
      ) : (
        tickets.map((ticket) => (
          <div key={ticket._id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <p><strong>User:</strong> {ticket.userName}</p>
            <p><strong>Issue:</strong> {ticket.message}</p>
            <p><strong>Status:</strong> {ticket.status}</p>
            {ticket.adminReply ? (
              <p><strong>✅ Admin Reply:</strong> {ticket.adminReply}</p>
            ) : (
              <>
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder="Type your reply..."
                />
                <button onClick={() => sendReply(ticket._id)}>Send Reply</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default HelpdeskTickets;