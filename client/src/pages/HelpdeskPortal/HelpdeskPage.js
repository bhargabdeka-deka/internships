import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './HelpdeskPage.css';
import ComplaintCard from './ComplaintCard';
import FeedbackForm from './FeedbackForm';

export default function HelpdeskPage() {
  // Grab token (we don’t need to send meterNumber—server reads it from the JWT)
  const { token } = JSON.parse(localStorage.getItem('user')) || {};

  const [issueText, setIssueText]           = useState('');
  const [ticketData, setTicketData]         = useState(null);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  // Set auth header once, and load ticket
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      fetchTicket();
    }
  }, [token]);

  // Fetch the user’s latest ticket
  const fetchTicket = async () => {
    try {
      const res = await axios.get('/api/users/helpdesk');
      const ticket = res.data;
      setTicketData(ticket);

      // Only show feedback form if adminReply.text exists and no feedback yet
      const needsFeedback = ticket?.adminReply?.text && !ticket.feedback;
      setShowFeedbackForm(needsFeedback);
    } catch (err) {
      console.error(
        '❌ Ticket fetch error:',
        err.response?.data?.message || err.message
      );
    }
  };

  // Submit a new complaint
  const submitTicket = async () => {
    if (!issueText.trim()) {
      return alert('Please describe your issue');
    }
    try {
      const res = await axios.post('/api/users/helpdesk', { issueText });
      console.log('✅ Ticket created:', res.data);
      alert('Complaint submitted');
      setIssueText('');
      fetchTicket();
    } catch (err) {
      console.error(
        '❌ Ticket submit error:',
        err.response?.data?.message || err.message
      );
      alert(err.response?.data?.message || 'Could not submit your request');
    }
  };

  return (
    <div className="helpdesk-container">
      <h2>📩 APDCL Helpdesk</h2>

      {/* Status badge */}
      {ticketData && (
        <p className={`status-chip ${ticketData.status === 'Pending' ? 'waiting' : ''}`}>
          <strong>Status:</strong> {ticketData.status}
        </p>
      )}

      {/* New complaint input */}
      <textarea
        placeholder="Describe your complaint or issue…"
        value={issueText}
        onChange={e => setIssueText(e.target.value)}
      />
      <button onClick={submitTicket}>Send Request</button>

      {/* Existing complaint & reply */}
      {ticketData ? (
        <ComplaintCard ticket={ticketData} />
      ) : (
        <p className="pending-note">🕒 No complaint found yet</p>
      )}

      {/* Feedback form (after a real adminReply.text) */}
      {showFeedbackForm && (
        <FeedbackForm
          onFeedbackSubmitted={() => {
            setShowFeedbackForm(false);
            fetchTicket();
          }}
        />
      )}
    </div>
  );
}