const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
    trim: true
  },

  userType: {
    type: String,
    required: true,
    trim: true
  },

  address: {
    type: String,
    required: true,
    trim: true
  },

  pincode: {
    type: String,
    required: true,
    trim: true
  },

  load: {
    type: Number,
    required: true
  },

  meterType: {
    type: String,
    required: true,
    trim: true
  },

  contact: {
    type: String,
    required: true,
    trim: true
  },
  
  documents: {
    type: [String],
    required: true,
    validate: {
      validator: arr => arr.length === 2,
      message: 'Must upload both Aadhaar and proof documents'
    }
  },

  status: {
    type: String,
    enum: ['Pending', 'Under Review', 'Approved', 'Rejected'],
    default: 'Pending'
  },

  decisionDate: {
    type: Date
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  email: {
    type: String,
    required: true,
    trim: true
  },

  meterNumber: {
    type: String,
    required: true,
    trim: true,
    match: /^[A-Z0-9\-]{6,20}$/ // ✅ Optional pattern for validation (e.g. alphanumeric with hyphens)
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster retrieval/sorting
connectionRequestSchema.index({ createdAt: -1 });
connectionRequestSchema.index({ meterNumber: 1 });

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema);