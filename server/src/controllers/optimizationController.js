const optimizationService = require('../services/optimization/optimizationService');
const Optimization = require('../models/Optimization');

const optimizeCode = async (req, res, next) => {
  try {
    const { language, code, testCases, submissionId } = req.body;

    const result = await optimizationService.optimize({
      language,
      code,
      testCases,
    });

    let savedOptimizationId = null;

    if (req.user) {
      const savedOptimization = await Optimization.create({
        userId: req.user._id,
        submissionId: submissionId || null,
        language,
        originalCode: result.originalCode,
        originalAnalysis: result.originalAnalysis,
        optimizedCode: result.optimizedCode,
        optimizedAnalysis: result.optimizedAnalysis,
        approachExplanation: result.approachExplanation,
        dataStructuresIntroduced: result.dataStructuresIntroduced,
        tradeOffs: result.tradeOffs,
        validationStatus: result.validationStatus,
      });
      savedOptimizationId = savedOptimization._id;
    }

    res.json({
      success: true,
      optimizationId: savedOptimizationId,
      ...result,
    });
  } catch (err) {
    next(err);
  }
};

const getOptimizationById = async (req, res, next) => {
  try {
    const optimization = await Optimization.findById(req.params.id);
    if (!optimization) {
      return res.status(404).json({ success: false, message: 'Optimization record not found' });
    }

    if (req.user && optimization.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({
      success: true,
      optimization,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  optimizeCode,
  getOptimizationById,
};
