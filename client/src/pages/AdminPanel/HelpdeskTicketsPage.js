import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HelpdeskTicketsPage.css';

export default function HelpdeskTicketsPage() {
  const [tickets, setTickets]   = useState([]);
  const [replyMap, setReplyMap] = useState({});

  // 🔐 Pull token once and set default header
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem('user'))?.token;
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // 📥 Fetch all tickets
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await axios.get('/api/admin/tickets');
        setTickets(res.data);
      } catch (err) {
        console.error('Error fetching tickets:', err);
      }
    };
    fetchTickets();
  }, []);

  // 📨 Send a reply for a given ticket
  const sendReply = async (ticketId) => {
    const replyText = replyMap[ticketId]?.trim();
    if (!replyText) {
      return alert('Please enter a reply.');
    }

    try {
      await axios.put(
        `/api/admin/tickets/${ticketId}/reply`,
        { reply: replyText }
      );
      alert('Reply sent successfully!');
      setReplyMap(prev => ({ ...prev, [ticketId]: '' }));

      // Refresh list
      const updated = await axios.get('/api/admin/tickets');
      setTickets(updated.data);
    } catch (err) {
      console.error('Reply failed:', err);
      alert('Failed to send reply');
    }
  };

  return (
    <div className="helpdesk-container">
      <h2>🆘 Helpdesk Tickets</h2>

      {!tickets.length && <p>No tickets found.</p>}

      {tickets.map(ticket => {
        // Determine exactly what to show for the user
        const userLabel = ticket.user
          ? (ticket.user.name
              ? `${ticket.user.name} (${ticket.user.meterNumber})`
              : ticket.user.meterNumber
            )
          : ticket.meterNumber;

        return (
          <div className="ticket-card" key={ticket._id}>
            <p>
              <strong>User:</strong> {userLabel}
            </p>
            <p><strong>Issue:</strong> {ticket.issueText}</p>
            <p><strong>Status:</strong> {ticket.status}</p>

            {ticket.adminReply?.text ? (
              <>
                <p><strong>✅ Admin Reply:</strong> {ticket.adminReply.text}</p>
                {ticket.adminReply.replyTime && (
                  <small>
                    {new Date(ticket.adminReply.replyTime)
                      .toLocaleString()}
                  </small>
                )}
              </>
            ) : (
              <>
                <textarea
                  value={replyMap[ticket._id] || ''}
                  onChange={e =>
                    setReplyMap(prev => ({
                      ...prev,
                      [ticket._id]: e.target.value
                    }))
                  }
                  placeholder="Type your reply here…"
                />
                <button onClick={() => sendReply(ticket._id)}>
                  Send Reply
                </button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}