const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/auth.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { loginLimiter } = require('../middleware/rateLimiter.middleware');

router.post('/register', register);
router.post('/login', loginLimiter, login);
router.get('/me', authMiddleware, me);

module.exports = router;