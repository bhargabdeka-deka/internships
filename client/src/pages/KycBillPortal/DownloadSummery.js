// src/pages/KycBillPortal/DownloadSummery.js
import React from 'react';
import './KycBillPortal.css';

export default function DownloadSummery({ bills }) {
  const handleDownload = () => {
    // Example: server might stream a PDF at /api/users/bills/download
    window.open('/api/users/bills/download', '_blank');
  };

  return (
    <div className="download-summery">
      <button onClick={handleDownload}>
        Download Full Bill Summary
      </button>
    </div>
  );
}