// backend/utils/jwtUtils.js
const jwt = require('jsonwebtoken');

// Generate JWT Token for authentication
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
      email: user.email
    },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '7d' }
  );
};

// Verify JWT Token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
  } catch (error) {
    throw new Error('Invalid token');
  }
};

module.exports = {
  generateToken,
  verifyToken
};