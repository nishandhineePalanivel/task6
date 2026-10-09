/**
 * Cognifyz Web Development Internship - Level 3, Task 6
 * Server Authorization Middleware (JWT Verification & Role Checks)
 */

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'cognifyz_task6_jwt_secret_key_2026';

/**
 * Generates a signed JWT token for an authenticated user
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
}

/**
 * Middleware: Verifies JWT token on protected API endpoints
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.query.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Access denied. Authentication token required. Please log in to proceed."
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token. Please log in again."
    });
  }
}

/**
 * Middleware: Restricts API endpoint to Admin role
 */
function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: "Access forbidden. Administrator privileges required."
    });
  }
  next();
}

module.exports = {
  JWT_SECRET,
  generateToken,
  authenticateToken,
  requireAdmin
};
