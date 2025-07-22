// src/pages/KycBillPortal/KycUpload.js
import React, { useState } from 'react';
import './KycBillPortal.css';

export default function KycUpload({ kycInfo, onSuccess, token: externalToken }) {
  const [files, setFiles] = useState({ aadhaar: null, proof: null });
  const [formFields, setFormFields] = useState({
    fullName: '',
    aadhaarNumber: '',
    panNumber: ''
  });
  const [message, setMessage] = useState('');

  // 🔐 Fallback token handler
  const getValidToken = () => {
    if (externalToken) return externalToken;
    const stored = localStorage.getItem('user');
    const parsed = stored ? JSON.parse(stored) : null;
    return parsed?.token || null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');

    const { fullName, aadhaarNumber, panNumber } = formFields;
    if (!fullName || !aadhaarNumber || !panNumber) {
      setMessage('❌ Please fill in all text fields.');
      return;
    }

    if (!files.aadhaar || !files.proof) {
      setMessage('❌ Please upload both Aadhaar and proof documents.');
      return;
    }

    const token = getValidToken();
    if (!token) {
      console.warn('🚫 Missing token. Cannot submit KYC.');
      setMessage('❗ Authentication error. Please log in again.');
      return;
    }

    const form = new FormData();
    form.append('fullName', fullName);
    form.append('aadhaarNumber', aadhaarNumber);
    form.append('panNumber', panNumber);
    form.append('aadhaar', files.aadhaar);
    form.append('proof', files.proof);

    try {
      const res = await fetch('/api/users/kyc', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: form
      });

      if (!res.ok) {
        throw new Error('Upload failed');
      }

      const data = await res.json();
      setMessage('✅ KYC submitted successfully!');
      if (onSuccess) onSuccess(data);
    } catch (err) {
      console.error('❌ KYC submission error:', err);
      setMessage('❌ Upload failed. Please try again.');
    }
  };

  const previewName = file =>
    file ? `📎 Selected: ${file.name}` : 'No file selected';

  return (
    <div className="kyc-status">
      <h3>KYC Status</h3>

      {/* ✅ Always show status section if kycStatus is available */}
      {kycInfo?.kycStatus && (
        <div className="status-section">
          <span className={`badge ${kycInfo.kycStatus.toLowerCase()}`}>
            {kycInfo.kycStatus}
          </span>
          {kycInfo.decisionDate && (
            <p>📅 Reviewed on: {new Date(kycInfo.decisionDate).toLocaleDateString()}</p>
          )}
          {kycInfo.adminRemarks && (
            <p>📝 Admin Remarks: {kycInfo.adminRemarks}</p>
          )}
        </div>
      )}

      {/* ✅ Upload form appears only if not yet approved */}
      {(kycInfo?.kycStatus !== 'Approved') && (
        <form className="kyc-upload" onSubmit={handleSubmit}>
          <h4>Submit / Resubmit Documents</h4>

          {/* ✏️ Text Fields */}
          <label>
            Full Name:
            <input
              type="text"
              placeholder="👤 Full Name"
              value={formFields.fullName}
              onChange={e =>
                setFormFields({ ...formFields, fullName: e.target.value })
              }
              required
            />
          </label>

          <label>
            Aadhaar Number:
            <input
              type="text"
              placeholder="🔢 Aadhaar Number"
              value={formFields.aadhaarNumber}
              onChange={e =>
                setFormFields({ ...formFields, aadhaarNumber: e.target.value })
              }
              required
            />
          </label>

          <label>
            PAN Number:
            <input
              type="text"
              placeholder="🆔 PAN Number"
              value={formFields.panNumber}
              onChange={e =>
                setFormFields({ ...formFields, panNumber: e.target.value })
              }
              required
            />
          </label>

          {/* 📎 File Uploads */}
          <label>
            Aadhaar Document:
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={e =>
                setFiles({ ...files, aadhaar: e.target.files[0] })
              }
              required
            />
            <small>{previewName(files.aadhaar)}</small>
          </label>

          <label>
            Proof of Ownership:
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={e =>
                setFiles({ ...files, proof: e.target.files[0] })
              }
              required
            />
            <small>{previewName(files.proof)}</small>
          </label>

          <button type="submit">📤 Upload KYC</button>

          {message && <p className="upload-message">{message}</p>}
        </form>
      )}
    </div>
  );
}