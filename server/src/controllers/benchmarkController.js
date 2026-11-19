const benchmarkService = require('../services/benchmarking/benchmarkService');

const runBenchmark = async (req, res, next) => {
  try {
    const { language, originalCode, optimizedCode, customBenchmarkCases, iterations } = req.body;

    if (!originalCode || !optimizedCode) {
      return res.status(400).json({
        success: false,
        message: 'Both original and optimized code are required for benchmarking.',
      });
    }

    const results = await benchmarkService.benchmark({
      language,
      originalCode,
      optimizedCode,
      customBenchmarkCases,
      iterations: iterations || 2,
    });

    res.json({
      success: true,
      ...results,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  runBenchmark,
};
