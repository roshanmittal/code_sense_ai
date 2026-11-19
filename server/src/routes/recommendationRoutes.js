const express = require('express');
const router = express.Router();
const recommendationService = require('../services/recommendations/recommendationService');

router.get('/problems', (req, res) => {
  const { pattern, difficulty } = req.query;
  const problems = recommendationService.getAllProblems({ pattern, difficulty });
  res.json({
    success: true,
    total: problems.length,
    problems,
  });
});

module.exports = router;
