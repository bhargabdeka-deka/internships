const mongoose = require('mongoose');

const KycSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  meterNumber: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  aadhaarNumber: {
    type: String,
    required: true
  },
  panNumber: {
    type: String,
    required: true
  },
  docs: {
    aadhaar: {
      type: String,
      required: true
    },
    proof: {
      type: String,
      required: true
    }
  },
  kycStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  adminRemarks: String,
  decisionDate: Date,
  uploadTime: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('KycSubmission', KycSchema);