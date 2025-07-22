const jwt = require('jsonwebtoken');

// 🔐 Token Verification
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('🔐 Raw Authorization header:', authHeader); // Log it

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or malformed token' });
  }

  const token = authHeader.split(' ')[1];
  console.log('🧪 Extracted token:', token); // Log token value

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ Token verification failed:', err.message);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// 🛡️ Admin Check
exports.isAdmin = (req, res, next) => {
  const role = req.user.role;
  if (role !== 'admin' && role !== 'superadmin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

// 🦸 Super Admin Check
exports.isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Super admin access only' });
  }
  next();
};

// 🧩 Specific Permission Check
exports.hasPermission = (permission) => {
  return (req, res, next) => {
    const permissions = req.user.permissions || [];
    if (!permissions.includes(permission)) {
      return res.status(403).json({ message: `Missing permission: ${permission}` });
    }
    next();
  };
};