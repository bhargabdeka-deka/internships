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
    required: true
  },

  district: {
    type: String,
    required: true
  },

  meterNumber: {
    type: String,
    required: true,
    unique: true // 💡 Prevent duplicate meter IDs
  },

  // 🔐 Role Management
  role: {
    type: String,
    enum: ['user', 'admin', 'superadmin'],
    default: 'user'
  },

  // 🏘️ Admin Zone (optional)
  zone: {
    type: String,
    default: null
  },

  // 🧩 Scoped Permissions (advanced control)
  permissions: {
    type: [String], // e.g. ['approve_users', 'view_reports']
    default: []
  }
});

// 🔒 Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

module.exports = mongoose.model('User', userSchema);