import React, { useState, useEffect } from 'react';
import axios from 'axios';

import StepUserType from './StepUserType';
import StepAddressMeter from './StepAddressMeter';
import StepUploadDocuments from './StepUploadDocuments';

import './ConnectionStepper.css';

export default function ConnectionStepper() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    contact: '',
    userType: '',
    address: '',
    pincode: '',
    load: '',
    meterType: '',
    visitDate: '',
    meterNumber: '',       // ✅ Pre-fill if available
    aadhaar: null,
    proof: null
  });

  useEffect(() => {
    // ✅ Safely extract user & token
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.meterNumber) {
          setFormData((prev) => ({ ...prev, meterNumber: parsed.meterNumber }));
        }
      } catch (err) {
        console.warn('⚠️ Could not parse user from localStorage');
      }
    }
  }, []);

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e) => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files[0] || null }));
  };

  const handleSubmit = async () => {
    setLoading(true);

    // ✅ Validate session
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      alert('Session expired. Please log in again.');
      setLoading(false);
      return;
    }

    let token = '';
    try {
      const parsed = JSON.parse(storedUser);
      token = parsed?.token;
      if (!token) {
        throw new Error('Token missing');
      }
    } catch (err) {
      alert('Invalid session. Please log in again.');
      setLoading(false);
      return;
    }

    // ✅ Prepare FormData
    const fd = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      fd.append(key, val);
    });

    console.log('📤 Submitting with token:', token);

    try {
      const res = await axios.post('/api/connections', fd, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        timeout: 7000
      });
      alert(res.data.message);
    } catch (err) {
      console.error('❌ Error submitting:', err);
      alert(err.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false); // ✅ Ensure button re-enables
    }
  };

  return (
    <div className="stepper-container">
      <h2>⚡ New Electricity Connection</h2>
      <div className="stepper-progress">
        <span className={step === 1 ? 'active-step' : ''}>1️⃣ User Info</span>
        <span className={step === 2 ? 'active-step' : ''}>2️⃣ Address</span>
        <span className={step === 3 ? 'active-step' : ''}>3️⃣ Upload</span>
      </div>

      {step === 1 && (
        <StepUserType
          formData={formData}
          setFormData={setFormData}
          next={nextStep}
          handleChange={handleChange}
        />
      )}
      {step === 2 && (
        <StepAddressMeter
          formData={formData}
          setFormData={setFormData}
          next={nextStep}
          prev={prevStep}
          handleChange={handleChange}
        />
      )}
      {step === 3 && (
        <StepUploadDocuments
          formData={formData}
          setFormData={setFormData}
          prev={prevStep}
          submit={handleSubmit}
          loading={loading}
          handleFile={handleFile}
        />
      )}
    </div>
  );
}