const express = require('express');
const router = express.Router();
const { analyzeCode, getAnalysisById } = require('../controllers/analysisController');
const { optionalAuth, protect } = require('../middleware/auth');
const { validateSubmission } = require('../middleware/validation');
const { aiLimiter } = require('../middleware/rateLimiter');

router.post('/', aiLimiter, optionalAuth, validateSubmission, analyzeCode);
router.get('/:id', optionalAuth, getAnalysisById);

module.exports = router;
