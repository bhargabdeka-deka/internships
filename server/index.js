const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
console.log('Mongo URI:', process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 10000
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

mongoose.connection.once('open', () => {
  console.log('🟢 MongoDB connection is open');
});

mongoose.connection.on('error', (err) => {
  console.error('🔴 MongoDB error:', err);
});

// 💡 Import routes
const connectionRoutes = require('./routes/ConnectionRoutes');  // For connection forms
const userRoutes = require('./routes/UserRoutes');              // For signup/login + usage
const adminRoutes = require('./routes/AdminRoutes');            // Admin operations
const superRoutes = require('./routes/SuperRoutes');            // Superadmin tools (promote/demote)

// 🔗 Use routes
app.use('/api/connections', connectionRoutes);     // ⚡ Connection API
app.use('/api/users', userRoutes);                 // 🔐 User Signup/Login + Usage API
app.use('/api/admin', adminRoutes);                // 🛠 Admin panel logic
app.use('/api/superadmin', superRoutes);           // 👑 Superadmin panel logic

// Health Check Endpoint
app.get('/', (req, res) => {
  res.send('✅ Backend is running smoothly!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is live on port ${PORT}`);
});