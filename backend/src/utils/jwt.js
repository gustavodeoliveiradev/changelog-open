const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

function generateToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: '15m' });
}

function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = { generateToken, verifyToken };