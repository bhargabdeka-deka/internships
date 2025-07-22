// models/HelpdeskTicket.js
const mongoose = require('mongoose');

const HelpdeskTicketSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  meterNumber: {
    type: String,
    required: true
  },
  issueText: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Replied', 'Resolved'],
    default: 'Pending'
  },
  adminReply: {
    text: { type: String, default: '' },
    replyTime: { type: Date }
  },
  feedback: {
    rating:      { type: Number },
    comment:     { type: String },
    submittedAt: { type: Date }          // ← add this to match your route
  }
}, { timestamps: true });

module.exports = mongoose.model('HelpdeskTicket', HelpdeskTicketSchema);