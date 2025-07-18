const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Usage = require('../models/Usage'); // ✅ New model for monthly usage
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyToken = require('../middleware/authMiddleware');
require('dotenv').config();

// 📝 Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phoneNumber, district, meterNumber } = req.body;
    if (!name?.trim() || !email?.trim() || !password?.trim() || !phoneNumber?.trim() || !district?.trim() || !meterNumber?.trim()) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({ name, email, password, phoneNumber, district, meterNumber });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ message: 'Server error during signup' });
  }
});

// 🔐 Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email?.trim() || !password?.trim()) {
      return res.status(400).json({ message: 'Missing email or password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token, message: 'Login successful' });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// 🛡️ Protected Dashboard Route
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      name: user.name,
      email: user.email,
      district: user.district,
      meterNumber: user.meterNumber
    });
  } catch (err) {
    console.error('❌ Dashboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// 📊 Monthly Usage Tracker Route
router.get('/usage/:meterNumber', async (req, res) => {
  try {
    const meter = req.params.meterNumber;
    const currentMonth = new Date().toISOString().slice(0, 7); // "YYYY-MM"

    let record = await Usage.findOne({ meterNumber: meter });

    if (record) {
      const monthExists = record.monthlyUsage.some(entry => entry.month === currentMonth);

      if (!monthExists) {
        const mockUnits = Math.floor(Math.random() * 310 + 250);
        record.monthlyUsage.push({ month: currentMonth, units: mockUnits });
        record.lastUpdated = new Date();
        await record.save();
      }

      return res.json(record.monthlyUsage);
    }

    // First-time entry: generate last 6 months
    const monthlyUsage = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthStr = date.toISOString().slice(0, 7);
      monthlyUsage.push({
        month: monthStr,
        units: Math.floor(Math.random() * 310 + 250)
      });
    }

    await Usage.create({ meterNumber: meter, monthlyUsage, lastUpdated: new Date() });
    res.json(monthlyUsage);
  } catch (err) {
    console.error('❌ Monthly usage error:', err);
    res.status(500).json({ message: 'Server error while tracking usage' });
  }
});

module.exports = router;