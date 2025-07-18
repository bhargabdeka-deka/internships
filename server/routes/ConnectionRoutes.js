const express = require('express');
const router = express.Router();
const ConnectionRequest = require('../models/ConnectionRequest');

// Create new connection request
router.post('/', async (req, res) => {
  try {
    const request = new ConnectionRequest(req.body);
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all requests
router.get('/', async (req, res) => {
  try {
    const requests = await ConnectionRequest.find();
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;