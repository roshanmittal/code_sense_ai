const mongoose = require('mongoose');
const CodeAnalysis = require('../models/CodeAnalysis');
const Optimization = require('../models/Optimization');
const CodeSubmission = require('../models/CodeSubmission');
const ExecutionResult = require('../models/ExecutionResult');

const getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // 1. Total counts
    const [totalAnalyses, totalOptimizations, totalSubmissions, totalExecutions] = await Promise.all([
      CodeAnalysis.countDocuments({ userId }),
      Optimization.countDocuments({ userId }),
      CodeSubmission.countDocuments({ userId }),
      ExecutionResult.countDocuments({ userId }),
    ]);

    // 2. Language breakdown
    const languageStats = await CodeAnalysis.aggregate([
      { $match: { userId } },
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // 3. Algorithmic patterns frequency
    const patternStats = await CodeAnalysis.aggregate([
      { $match: { userId } },
      { $unwind: '$algorithm.detectedPatterns' },
      { $group: { _id: '$algorithm.detectedPatterns', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    // 4. Complexity breakdown (e.g. O(1), O(log n), O(n), O(n^2))
    const complexityStats = await CodeAnalysis.aggregate([
      { $match: { userId } },
      { $group: { _id: '$timeComplexity.worst', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]);

    // 5. Recent submissions
    const recentSubmissions = await CodeSubmission.find({ userId })
      .sort({ createdAt: -1 })
      .limit(6)
      .select('title language status createdAt');

    // 6. Recent optimizations
    const recentOptimizations = await Optimization.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('language originalAnalysis.timeComplexity optimizedAnalysis.timeComplexity tradeOffs.timeGain createdAt');

    // 7. Activity Timeline (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const timelineStats = await CodeAnalysis.aggregate([
      {
        $match: {
          userId,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format 7 days activity with zero-filling
    const activityTimeline = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const match = timelineStats.find((item) => item._id === dateStr);
      activityTimeline.push({
        date: dateStr,
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        analyses: match ? match.count : 0,
      });
    }

    res.json({
      success: true,
      stats: {
        totalAnalyses,
        totalOptimizations,
        totalSubmissions,
        totalExecutions,
        languages: languageStats.map((l) => ({ name: l._id, count: l.count })),
        patterns: patternStats.map((p) => ({ pattern: p._id, count: p.count })),
        complexities: complexityStats.map((c) => ({ complexity: c._id, count: c.count })),
        recentSubmissions,
        recentOptimizations,
        activityTimeline,
      },
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDashboardStats,
};
