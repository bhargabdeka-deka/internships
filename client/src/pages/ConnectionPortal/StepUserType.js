// src/ConnectionPortal/StepUserType.js
import React from 'react';
import './StepUserType.css';

export default function StepUserType({ formData, setFormData, next }) {
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="step-user-type">
      <label>
        Full Name
        <input
          name="fullName"
          value={formData.fullName || ''}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Contact Number
        <input
          name="contact"
          type="text"
          value={formData.contact || ''}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        User Type
        <select
          name="userType"
          value={formData.userType || ''}
          onChange={handleChange}
          required
        >
          <option value="">Select…</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
        </select>
      </label>

      <button type="button" onClick={next}>➡️ Next</button>
    </div>
  );
}