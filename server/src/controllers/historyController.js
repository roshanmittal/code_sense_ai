const CodeSubmission = require('../models/CodeSubmission');
const CodeAnalysis = require('../models/CodeAnalysis');
const Optimization = require('../models/Optimization');

const getHistory = async (req, res, next) => {
  try {
    const { language, search, page = 1, limit = 15 } = req.query;

    const query = { userId: req.user._id };

    if (language && language !== 'all') {
      query.language = language;
    }

    if (search) {
      query.$or = [
        { code: { $regex: search, $options: 'i' } },
        { 'algorithm.primaryAlgorithm': { $regex: search, $options: 'i' } },
        { 'algorithm.detectedPatterns': { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [analyses, total] = await Promise.all([
      CodeAnalysis.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit, 10))
        .populate('submissionId', 'title status'),
      CodeAnalysis.countDocuments(query),
    ]);

    res.json({
      success: true,
      total,
      page: parseInt(page, 10),
      totalPages: Math.ceil(total / limit),
      analyses,
    });
  } catch (err) {
    next(err);
  }
};

const getHistoryItem = async (req, res, next) => {
  try {
    const analysis = await CodeAnalysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'History record not found.' });
    }

    // Also look up any optimizations made for this submission
    let optimization = null;
    if (analysis.submissionId) {
      optimization = await Optimization.findOne({
        submissionId: analysis.submissionId,
        userId: req.user._id,
      });
    }

    res.json({
      success: true,
      analysis,
      optimization,
    });
  } catch (err) {
    next(err);
  }
};

const deleteHistoryItem = async (req, res, next) => {
  try {
    const analysis = await CodeAnalysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({ success: false, message: 'Record not found.' });
    }

    // Cleanup related submission if exists
    if (analysis.submissionId) {
      await CodeSubmission.findByIdAndDelete(analysis.submissionId);
      await Optimization.deleteMany({ submissionId: analysis.submissionId });
    }

    res.json({
      success: true,
      message: 'Analysis record deleted successfully.',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getHistory,
  getHistoryItem,
  deleteHistoryItem,
};
