const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token provided. Access denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info
    next(); // move on to the actual route
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = verifyToken;