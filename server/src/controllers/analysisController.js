const complexityEngine = require('../services/analysis/complexityEngine');
const recommendationService = require('../services/recommendations/recommendationService');
const CodeAnalysis = require('../models/CodeAnalysis');
const CodeSubmission = require('../models/CodeSubmission');

const analyzeCode = async (req, res, next) => {
  try {
    const { language, code, title, submissionId } = req.body;

    // Run hybrid analysis
    const analysis = await complexityEngine.analyze({ language, code });

    // Fetch matching DSA problem recommendations based on detected patterns & structures
    const recommendations = recommendationService.getRecommendations({
      detectedPatterns: analysis.algorithm.detectedPatterns,
      dataStructures: analysis.algorithm.dataStructures,
      limit: 5,
    });

    let savedSubmissionId = submissionId;
    let savedAnalysisId = null;

    // Persist to database if authenticated or user is present
    if (req.user) {
      if (!savedSubmissionId) {
        const submission = await CodeSubmission.create({
          userId: req.user._id,
          title: title || `${language.toUpperCase()} Analysis - ${new Date().toLocaleDateString()}`,
          language,
          code,
          status: 'analyzed',
        });
        savedSubmissionId = submission._id;
      }

      const savedAnalysis = await CodeAnalysis.create({
        userId: req.user._id,
        submissionId: savedSubmissionId,
        language,
        code,
        timeComplexity: analysis.timeComplexity,
        spaceComplexity: analysis.spaceComplexity,
        algorithm: analysis.algorithm,
        codeQuality: analysis.codeQuality,
        staticMetrics: analysis.staticMetrics,
        assumptionsAndUncertainties: analysis.assumptionsAndUncertainties,
      });
      savedAnalysisId = savedAnalysis._id;
    }

    res.json({
      success: true,
      analysisId: savedAnalysisId,
      submissionId: savedSubmissionId,
      analysis,
      recommendations,
    });
  } catch (err) {
    next(err);
  }
};

const getAnalysisById = async (req, res, next) => {
  try {
    const analysis = await CodeAnalysis.findById(req.params.id);
    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Analysis record not found' });
    }

    // Verify ownership
    if (req.user && analysis.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const recommendations = recommendationService.getRecommendations({
      detectedPatterns: analysis.algorithm.detectedPatterns,
      dataStructures: analysis.algorithm.dataStructures,
    });

    res.json({
      success: true,
      analysis,
      recommendations,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  analyzeCode,
  getAnalysisById,
};
