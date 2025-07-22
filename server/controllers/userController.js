const KycSubmission = require('../models/KycSubmission'); // ✅ Import schema

exports.submitKYC = async (req, res) => {
  try {
    // 🔍 Log incoming form data for debugging
    console.log('📥 [submitKYC] req.body:', req.body);
    console.log('📎 [submitKYC] req.files:', req.files);

    const { fullName, aadhaarNumber, panNumber } = req.body;
    const userId = req.user.userId;
    const meterNumber = req.user.meterNumber;

    // 🚨 Field validations
    if (!fullName || !aadhaarNumber || !panNumber) {
      return res.status(400).json({ message: 'Missing form fields.' });
    }

    if (!req.files?.aadhaar || !req.files?.proof) {
      return res.status(400).json({ message: 'Both documents are required.' });
    }

    const aadhaarPath = req.files.aadhaar[0]?.path;
    const proofPath = req.files.proof[0]?.path;

    if (!aadhaarPath || !proofPath) {
      return res.status(400).json({ message: 'File paths missing.' });
    }

    // ✅ Normalize file paths for browser use (replaces \ with /)
    const normalizedAadhaar = aadhaarPath.replace(/\\/g, '/');
    const normalizedProof = proofPath.replace(/\\/g, '/');

    const newKyc = new KycSubmission({
      userId,
      meterNumber,
      fullName,
      aadhaarNumber,
      panNumber,
      docs: {
        aadhaar: normalizedAadhaar,
        proof: normalizedProof
      },
      kycStatus: 'Pending',
      uploadTime: new Date()
    });

    await newKyc.save();

    // 🟢 Return saved file paths for frontend display
    res.status(200).json({
      message: '✅ KYC submitted successfully!',
      kycId: newKyc._id,
      aadhaar: newKyc.docs.aadhaar,
      proof: newKyc.docs.proof
    });

  } catch (err) {
    console.error('❌ KYC submission error:', err.message);
    res.status(500).json({ message: 'Server error during KYC submission.' });
  }
};
//userController.js