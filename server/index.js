// server/index.js

const express  = require('express');
const cors     = require('cors');
const mongoose = require('mongoose');
const fs       = require('fs');
require('dotenv').config();

// 🛠 Create uploads folder if missing
fs.mkdirSync('uploads/kyc', { recursive: true });

// 🎯 Initialize Express app
const app  = express();

// 🌐 Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Serve static files

// 📦 MongoDB Connection
console.log('Mongo URI:', process.env.MONGO_URI);
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

mongoose.connection.once('open', () => {
  console.log('🟢 MongoDB connection is open');
});
mongoose.connection.on('error', err => {
  console.error('🔴 MongoDB error:', err);
});

// 🔗 Route Imports
const connectionRoutes = require('./routes/ConnectionRoutes');
const userRoutes       = require('./routes/UserRoutes');
const adminRoutes      = require('./routes/AdminRoutes');
const superRoutes      = require('./routes/SuperRoutes');
const kycRoutes        = require('./routes/KycRoutes');
const helpdeskRoutes   = require('./routes/HelpdeskRoutes');

// 🧪 Debug Logs
console.log('🧪 Routes Initialized:', {
  connections: typeof connectionRoutes,
  users:       typeof userRoutes,
  admin:       typeof adminRoutes,
  superadmin:  typeof superRoutes
});

// 🚦 Route Handlers
app.use('/api/connections', connectionRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/superadmin', superRoutes);
app.use('/api/users', kycRoutes);
app.use('/api/users', helpdeskRoutes);

// 🩺 Health Check
app.get('/', (_req, res) => {
  res.send('✅ Backend is running smoothly!');
});

// 🚀 Dynamic Port Picker
const BASE_PORT = parseInt(process.env.PORT, 10) || 5000;

function startServer(port) {
  const server = app
    .listen(port, () => {
      console.log(`🚀 Server live at http://localhost:${port}`);
    })
    .on('error', err => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${port} in use, trying ${port + 1}...`);
        startServer(port + 1);
      } else {
        console.error('❌ Server error:', err);
        process.exit(1);
      }
    });
}

startServer(BASE_PORT);