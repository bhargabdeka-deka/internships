import React, { useState } from 'react';
import axios from 'axios';
import './HelpdeskPage.css';

export default function FeedbackForm({ meterNumber, onFeedbackSubmitted }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (rating === 0) return alert('Please select a rating');

    try {
      await axios.post('/api/users/helpdesk/feedback', {
        meterNumber,
        rating,
        comment
      });
      alert('✅ Feedback submitted—thank you!');
      setRating(0);
      setComment('');
      if (onFeedbackSubmitted) onFeedbackSubmitted();
    } catch (err) {
      console.error('❌ Feedback submission failed:', err.message);
      alert('Could not send feedback');
    }
  };

  return (
    <div className="feedback-box">
      <h4>⭐ Share Your Feedback</h4>
      <div className="stars">
        {[1, 2, 3, 4, 5].map(num => (
          <span
            key={num}
            className={rating >= num ? 'star filled' : 'star'}
            onClick={() => setRating(num)}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        placeholder="Additional comments (optional)"
        value={comment}
        onChange={e => setComment(e.target.value)}
      />
      <button onClick={handleSubmit}>Submit Feedback</button>
    </div>
  );
}