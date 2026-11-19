const express = require('express');
const router = express.Router();
const { executeCode, runTestCases, getSupportedLanguages } = require('../controllers/executionController');
const { optionalAuth } = require('../middleware/auth');
const { validateExecution } = require('../middleware/validation');
const { executionLimiter } = require('../middleware/rateLimiter');

router.get('/languages', getSupportedLanguages);
router.post('/run', executionLimiter, optionalAuth, validateExecution, executeCode);
router.post('/test-cases', executionLimiter, optionalAuth, validateExecution, runTestCases);

module.exports = router;
