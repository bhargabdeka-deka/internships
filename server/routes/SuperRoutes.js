const express = require('express');
const router = express.Router();
const { verifyToken, isSuperAdmin } = require('../middleware/auth');
const User = require('../models/User');

// 🧑‍💼 View all users
router.get('/users', verifyToken, isSuperAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// 🔼 Promote user to admin
router.put('/promote/:id', verifyToken, isSuperAdmin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { role: 'admin' });
    res.json({ message: 'User promoted to admin' });
  } catch (error) {
    res.status(500).json({ message: 'Promotion failed' });
  }
});

// 📌 Optional: Demote admin back to user
router.put('/demote/:id', verifyToken, isSuperAdmin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { role: 'user' });
    res.json({ message: 'Admin demoted to user' });
  } catch (error) {
    res.status(500).json({ message: 'Demotion failed' });
  }
});

module.exports = router;