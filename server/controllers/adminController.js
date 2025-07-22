// controllers/adminController.js

console.log('🔍 adminController loaded, exports so far:', exports);

const User               = require('../models/User');
const ConnectionRequest  = require('../models/ConnectionRequest');
const HelpdeskTicket     = require('../models/HelpdeskTicket');
const KycSubmission      = require('../models/KycSubmission');

/**
 * 📥 GET /api/admin/tickets
 * Fetch all helpdesk tickets *and* populate user.name + user.meterNumber
 */
exports.fetchHelpdeskTickets = async (req, res) => {
  try {
    const tickets = await HelpdeskTicket
      .find()
      .populate('user', 'name meterNumber')
      .sort({ createdAt: -1 });

    return res.json(tickets);
  } catch (error) {
    console.error('❌ Helpdesk fetch error:', error);
    return res
      .status(500)
      .json({ message: 'Failed to fetch helpdesk tickets' });
  }
};

/**
 * 📄 GET /api/admin/kyc-requests
 * Fetch all KYC submissions for review
 */
exports.fetchKycSubmissions = async (req, res) => {
  try {
    const submissions = await KycSubmission
      .find()
      .sort({ uploadTime: -1 });

    return res.json(submissions);
  } catch (error) {
    console.error('❌ KYC fetch error:', error.message);
    return res
      .status(500)
      .json({ message: 'Failed to fetch KYC submissions' });
  }
};

/**
 * ✅ PUT /api/admin/kyc-status/:kycId
 * Update KYC status and optional remarks
 */
exports.updateKycStatus = async (req, res) => {
  const { status, remarks } = req.body;
  const kycId               = req.params.kycId;

  try {
    const submission = await KycSubmission.findById(kycId);
    if (!submission) {
      return res
        .status(404)
        .json({ message: 'KYC submission not found' });
    }

    submission.kycStatus    = status;
    submission.adminRemarks = remarks || '';
    submission.decisionDate = new Date();
    await submission.save();

    console.log(
      `✅ Admin ${req.user?.email} marked ${submission.fullName}'s KYC as ${status}`
    );
    return res.json({ message: `KYC ${status}`, submission });
  } catch (error) {
    console.error('❌ KYC update error:', error.message);
    return res
      .status(500)
      .json({ message: 'Failed to update KYC status' });
  }
};