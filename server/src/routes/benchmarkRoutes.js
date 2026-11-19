const express = require('express');
const router = express.Router();
const { runBenchmark } = require('../controllers/benchmarkController');
const { optionalAuth } = require('../middleware/auth');
const { executionLimiter } = require('../middleware/rateLimiter');

router.post('/', executionLimiter, optionalAuth, runBenchmark);

module.exports = router;
