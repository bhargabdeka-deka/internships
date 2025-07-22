// routes/HelpdeskRoutes.js
const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const HelpdeskTicket = require('../models/HelpdeskTicket');

// 📝 Submit a new complaint
// POST /api/users/helpdesk
router.post('/helpdesk', verifyToken, async (req, res) => {
  const { issueText } = req.body;
  if (!issueText?.trim()) {
    return res.status(400).json({ message: 'Issue text is required' });
  }

  try {
    const ticket = await HelpdeskTicket.create({
      user: req.user.userId,
      meterNumber: req.user.meterNumber,
      issueText,
      status: 'Pending'
    });
    return res.status(201).json(ticket);
  } catch (err) {
    console.error('❌ Helpdesk submit error:', err);
    return res.status(500).json({ message: err.message });
  }
});

// 📬 Get the latest ticket + reply for this user
// GET /api/users/helpdesk
router.get('/helpdesk', verifyToken, async (req, res) => {
  try {
    const ticket = await HelpdeskTicket
      .findOne({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .populate('user', 'name meterNumber');

    // if no ticket yet, return null so front-end shows “no complaint”
    return res.status(200).json(ticket || null);
  } catch (err) {
    console.error('❌ Helpdesk fetch error:', err);
    return res.status(500).json({ message: err.message });
  }
});

// 🙋 Submit feedback on the latest ticket
// POST /api/users/helpdesk/feedback
router.post('/helpdesk/feedback', verifyToken, async (req, res) => {
  const { rating, comment } = req.body;
  if (rating == null) {
    return res.status(400).json({ message: 'Rating is required' });
  }

  try {
    // pick the most recent ticket for this user
    const ticket = await HelpdeskTicket
      .findOne({ user: req.user.userId })
      .sort({ createdAt: -1 });

    if (!ticket) {
      return res.status(404).json({ message: 'No ticket found for feedback' });
    }

    ticket.feedback = {
      rating,
      comment: comment || '',
      submittedAt: new Date()
    };
    await ticket.save();

    // send back the updated ticket
    return res.status(200).json(ticket);
  } catch (err) {
    console.error('❌ Feedback error:', err);
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;