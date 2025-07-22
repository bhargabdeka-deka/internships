// ComplaintCard.js
import React from 'react';

export default function ComplaintCard({ ticket }) {
  return (
    <div className="reply-card">
      {/* ← New status line */}
      <p><strong>Status:</strong> {ticket.status}</p>

      <h4>Your Complaint:</h4>
      <p>{ticket.issueText}</p>

      {ticket.adminReply?.text ? (
        <>
          <h4>Reply from APDCL:</h4>
          <p>{ticket.adminReply.text}</p>
          {ticket.adminReply.replyTime && (
            <small>{new Date(ticket.adminReply.replyTime).toLocaleString()}</small>
          )}
        </>
      ) : (
        <p className="pending-note">🕒 Awaiting Response</p>
      )}
    </div>
  );
}