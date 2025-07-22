const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // 👤 Basic Info
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true
  },
  district: {
    type: String,
    required: true,
    trim: true
  },
  meterNumber: {
    type: String,
    required: true,
    unique: true,
    index: true // ⚡ Optional: for faster queries
  },

  // 🔐 Role & Zone
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
  },
  zone: {
    type: String,
    default: null
  },

  // 🧩 Advanced Permissions
  permissions: {
    type: [String],
    default: []
  },

  // 📄 KYC Tracking
  kycStatus: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  adminRemarks: {
    type: String,
    default: ''
  },
  decisionDate: {
    type: Date
  },
  kycSubmittedAt: {
    type: Date
  },

  // 📎 Uploaded KYC Docs
  aadhaarUrl: {
    type: String,
    default: ''
  },
  proofUrl: {
    type: String,
    default: ''
  },

  // 🪪 Additional Legacy Docs
  docs: {
    aadhaar: { type: String, default: '' },
    panCard: { type: String, default: '' }
  }
}, {
  timestamps: true // 🕒 Adds createdAt, updatedAt
});

// 🔒 Auto-hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);