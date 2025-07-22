// routes/ConnectionRoutes.js

const express = require('express');
const router  = express.Router();
const multer  = require('multer');
const ConnectionRequest = require('../models/ConnectionRequest');
const User = require('../models/User');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/',
  verifyToken,
  upload.fields([
    { name: 'aadhaar', maxCount: 1 },
    { name: 'proof',   maxCount: 1 }
  ]),
  async (req, res) => {
    console.log('🆕 New Connection Request by:', req.user?.email);
    console.log('📥 Request Body:', req.body);
    console.log('📂 Uploaded Files:', Object.keys(req.files || {}));

    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const requiredFields = [
        'fullName', 'userType', 'address',
        'pincode', 'load', 'meterType',
        'contact', 'visitDate', 'meterNumber'
      ];
      for (const field of requiredFields) {
        if (!req.body[field]?.toString().trim()) {
          return res
            .status(400)
            .json({ message: `Missing or empty field: ${field}` });
        }
      }

      if (!req.files?.aadhaar?.length || !req.files?.proof?.length) {
        return res
          .status(400)
          .json({ message: 'Both Aadhaar and proof documents are required' });
      }

      const castedLoad = Number(req.body.load);
      const submittedMeterNumber = req.body.meterNumber.trim();

      if (isNaN(castedLoad)) {
        return res.status(400).json({ message: 'Invalid load value' });
      }

      const newRequest = new ConnectionRequest({
        fullName:    req.body.fullName,
        userType:    req.body.userType,
        address:     req.body.address,
        pincode:     req.body.pincode,
        load:        castedLoad,
        meterType:   req.body.meterType,
        contact:     req.body.contact,
        status:      'Pending',
        meterNumber: submittedMeterNumber,
        userId:      user._id,
        email:       user.email,
        documents: [
          req.files.aadhaar[0].originalname,
          req.files.proof[0].originalname
        ]
      });

      await newRequest.save();
      console.log('✅ Application saved:', newRequest._id);
      res.status(201).json({ message: 'Application submitted successfully!' });

    } catch (err) {
      console.error('❌ Submission error:', err);

      if (err.name === 'ValidationError') {
        const field = Object.keys(err.errors)[0];
        const msg = err.errors[field]?.message || 'Validation failed';
        return res.status(400).json({ message: `Validation error at '${field}': ${msg}` });
      }

      res.status(500).json({ message: `Failed to submit application: ${err.message}` });
    }
  }
);

// ← This export is mandatory!
module.exports = router;