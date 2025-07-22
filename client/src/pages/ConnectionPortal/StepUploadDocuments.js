// src/ConnectionPortal/StepUploadDocuments.js
import React from 'react';
import './StepUploadDocuments.css';

export default function StepUploadDocuments({
  formData,
  setFormData,
  submit,
  prev,
  loading
}) {
  const handleFile = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });

  return (
    <div className="step-upload-docs">
      <label>
        Aadhaar (PDF/JPG)
        <input
          name="aadhaar"
          type="file"
          accept=".pdf,image/*"
          onChange={handleFile}
          required
        />
      </label>

      <label>
        Proof of Address (PDF/JPG)
        <input
          name="proof"
          type="file"
          accept=".pdf,image/*"
          onChange={handleFile}
          required
        />
      </label>

      {/* ✅ Diagnostic Preview (Optional Debug Aid) */}
      <div className="file-preview">
        <p>📎 Aadhaar file: {formData.aadhaar?.name || 'None selected'}</p>
        <p>📎 Proof file: {formData.proof?.name || 'None selected'}</p>
      </div>

      <div className="step-buttons">
        <button type="button" onClick={prev}>⬅️ Back</button>

        <button
          type="button"
          onClick={() => {
            console.log('🚀 Submit button clicked!');
            console.log('📦 formData at submission:', formData);
            submit();
          }}
          disabled={loading}
        >
          Submit
        </button>
      </div>
    </div>
  );
}