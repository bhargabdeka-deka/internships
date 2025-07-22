// src/pages/KycBillPortal/MeterGate.js
import React, { useState, useEffect } from 'react';
import './KycBillPortal.css';

export default function MeterGate({ onSubmit }) {
  const [meter, setMeter] = useState('');
  const [error, setError] = useState('');

  // Autofill from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.meterNumber) {
      setMeter(user.meterNumber);
      onSubmit(user.meterNumber); // Optional: auto-trigger submission
    }
  }, [onSubmit]);

  const handleSubmit = e => {
    e.preventDefault();
    const trimmed = meter.trim();
    if (!trimmed) {
      setError('❌ Meter number is required.');
      return;
    }
    setError('');
    onSubmit(trimmed);
  };

  return (
    <form className="meter-gate" onSubmit={handleSubmit}>
      <label htmlFor="meter-number">Meter Number:</label>
      <input
        id="meter-number"
        type="text"
        placeholder="Enter your 12-digit meter number"
        value={meter}
        onChange={e => setMeter(e.target.value)}
      />
      <button type="submit" disabled={!meter.trim()}>
        Load My Portal
      </button>
      {error && <p className="meter-error">{error}</p>}
    </form>
  );
}