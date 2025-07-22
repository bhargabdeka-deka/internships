// routes/KycRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');
const KycSubmission = require('../models/KycSubmission');

// 📤 KYC Upload — scoped multer inside route
router.post('/kyc', verifyToken, (req, res, next) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/kyc/'),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(
        null,
        req.user.userId +
          '-' +
          file.fieldname +
          '-' +
          uniqueSuffix +
          path.extname(file.originalname)
      );
    }
  });

  const upload = multer({ storage });
  upload.fields([
    { name: 'aadhaar' },
    { name: 'proof' }
  ])(req, res, next);
}, userController.submitKYC);

// 🕵️‍♂️ KYC Status by Meter Number
router.get('/kyc-status', verifyToken, async (req, res) => {
  try {
    const meterNumber = req.query.meter;

    if (!meterNumber) {
      return res.status(400).json({ message: 'Meter number is required' });
    }

    const kyc = await KycSubmission.findOne({ meterNumber });

    if (!kyc) {
      return res.status(404).json({ message: 'No KYC submission found for this meter number' });
    }

    res.status(200).json({
      fullName: kyc.fullName,
      aadhaarNumber: kyc.aadhaarNumber,
      panNumber: kyc.panNumber,
      kycStatus: kyc.kycStatus,
      Remarks: kyc.adminRemarks || '',
      decisionDate: kyc.decisionDate || null
    });
  } catch (err) {
    console.error('❌ KYC status fetch error:', err.message);
    res.status(500).json({ message: 'Failed to fetch KYC status' });
  }
});

module.exports = router;