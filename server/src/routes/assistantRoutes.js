const express = require('express');
const router = express.Router();
const {
  sendMessage,
  debugCode,
  getConversations,
  getConversationById,
} = require('../controllers/assistantController');
const { optionalAuth, protect } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

router.post('/chat', aiLimiter, optionalAuth, sendMessage);
router.post('/debug', aiLimiter, optionalAuth, debugCode);
router.get('/conversations', protect, getConversations);
router.get('/conversations/:id', protect, getConversationById);

module.exports = router;
