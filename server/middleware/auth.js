const jwt = require('jsonwebtoken');

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ message: 'Invalid token' });
  }
};

exports.isAdmin = (req, res, next) => {
  const role = req.user.role;
  if (role !== 'admin' && role !== 'superadmin') {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
};

exports.isSuperAdmin = (req, res, next) => {
  if (req.user.role !== 'superadmin') {
    return res.status(403).json({ message: 'Super admin access only' });
  }
  next();
};

// Optional: Check for specific permissions
exports.hasPermission = (permission) => {
  return (req, res, next) => {
    const permissions = req.user.permissions || [];
    if (!permissions.includes(permission)) {
      return res.status(403).json({ message: `Missing permission: ${permission}` });
    }
    next();
  };
};