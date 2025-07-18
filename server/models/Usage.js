const mongoose = require('mongoose');

const monthlyUsageSchema = new mongoose.Schema({
  month: String,      // Format: "YYYY-MM"
  units: Number       // kWh consumed
});

const usageSchema = new mongoose.Schema({
  meterNumber: { type: String, unique: true },
  monthlyUsage: [monthlyUsageSchema],
  lastUpdated: Date
});

module.exports = mongoose.model('Usage', usageSchema);