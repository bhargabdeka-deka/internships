import React, { useState } from 'react';
import './ConnectionForm.css';

function ConnectionForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    pincode: '',
    load: '',
    meterType: '',
    date: '',
    contact: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('⚡ Connection request submitted!');
    // Next: Add backend integration to save form
  };

  return (
    <div className="form-container">
      <h2>📄 Electricity Connection Request</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="fullName" placeholder="👤 Full Name" value={formData.fullName} onChange={handleChange} required />
        <input type="text" name="address" placeholder="🏠 Address" value={formData.address} onChange={handleChange} required />
        <input type="text" name="pincode" placeholder="📍 Pincode / Region" value={formData.pincode} onChange={handleChange} required />
        <input type="number" name="load" placeholder="🔌 Load (in kW)" value={formData.load} onChange={handleChange} required />
        <select name="meterType" value={formData.meterType} onChange={handleChange} required>
          <option value="">⚙️ Select Meter Type</option>
          <option value="Single-phase">Single-phase</option>
          <option value="Three-phase">Three-phase</option>
        </select>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />
        <input type="tel" name="contact" placeholder="📞 Contact Number" value={formData.contact} onChange={handleChange} required />
        <button type="submit">Apply</button>
      </form>
    </div>
  );
}

export default ConnectionForm;