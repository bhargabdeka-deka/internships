const express = require('express');
const router = express.Router();
const { verifyToken, isAdmin } = require('../middleware/auth');
const ConnectionRequest = require('../models/Connection'); // adjust if your model file differs
const Ticket = require('../models/Ticket'); // adjust if named differently

// 📥 Fetch all pending connection applications
router.get('/applications', verifyToken, isAdmin, async (req, res) => {
  try {
    const pending = await ConnectionRequest.find({ status: 'Pending' });
    res.json(pending);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch connection requests' });
  }
});

// ✅ Approve a connection request
router.put('/applications/:id/approve', verifyToken, isAdmin, async (req, res) => {
  try {
    await ConnectionRequest.findByIdAndUpdate(req.params.id, { status: 'Approved' });
    res.json({ message: 'Connection approved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Approval failed' });
  }
});

// 🆘 View all helpdesk tickets
router.get('/tickets', verifyToken, isAdmin, async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tickets' });
  }
});

// 📝 Respond to helpdesk ticket
router.put('/tickets/:id/reply', verifyToken, isAdmin, async (req, res) => {
  const { reply } = req.body;
  try {
    await Ticket.findByIdAndUpdate(req.params.id, {
      adminReply: reply,
      status: 'Resolved'
    });
    res.json({ message: 'Ticket resolved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Helpdesk reply failed' });
  }
});

module.exports = router;