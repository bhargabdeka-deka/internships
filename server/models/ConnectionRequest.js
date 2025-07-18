const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  connectionType: String, // 'Residential' or 'Commercial'
  documents: {
    aadhaar: String, // File path or URL
    addressProof: String,
  },
  status: {
    type: String,
    default: 'Pending', // 'Pending', 'Under Review', 'Approved', 'Rejected'
  },
  schedule: {
    visitDate: Date,
    engineerAssigned: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('ConnectionRequest', connectionSchema);