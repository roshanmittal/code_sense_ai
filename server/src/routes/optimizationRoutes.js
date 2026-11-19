const express = require('express');
const router = express.Router();
const { optimizeCode, getOptimizationById } = require('../controllers/optimizationController');
const { optionalAuth } = require('../middleware/auth');
const { validateSubmission } = require('../middleware/validation');
const { aiLimiter } = require('../middleware/rateLimiter');

router.post('/', aiLimiter, optionalAuth, validateSubmission, optimizeCode);
router.get('/:id', optionalAuth, getOptimizationById);

module.exports = router;
