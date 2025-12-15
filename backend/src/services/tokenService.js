const jwt = require('jsonwebtoken');

const generateToken = (adminId) => {
  return jwt.sign(
    { adminId, type: 'access' },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

const generateRefreshToken = (adminId) => {
  return jwt.sign(
    { adminId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
    { expiresIn: '7d' }
  );
};

const generateResetToken = (adminId) => {
  return jwt.sign(
    { adminId, type: 'password_reset' },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '15m' }
  );
};

const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

module.exports = {
  generateToken,
  generateRefreshToken,
  generateResetToken,
  verifyToken
};