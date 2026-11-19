const executionService = require('../services/execution/executionService');
const languageAdapterFactory = require('../adapters/languages/LanguageAdapterFactory');
const ExecutionResult = require('../models/ExecutionResult');

const executeCode = async (req, res, next) => {
  try {
    const { language, code, customInput, submissionId } = req.body;

    const result = await executionService.execute({
      language,
      code,
      stdin: customInput || '',
    });

    let savedResultId = null;

    if (req.user) {
      const saved = await ExecutionResult.create({
        userId: req.user._id,
        submissionId: submissionId || null,
        language,
        sourceCode: code,
        stdin: customInput || '',
        stdout: result.stdout,
        stderr: result.stderr,
        compileOutput: result.compileOutput,
        status: result.status,
        executionTimeMs: result.executionTimeMs,
        memoryKb: result.memoryKb,
      });
      savedResultId = saved._id;
    }

    res.json({
      success: true,
      executionId: savedResultId,
      result,
    });
  } catch (err) {
    next(err);
  }
};

const runTestCases = async (req, res, next) => {
  try {
    const { language, code, testCases, submissionId } = req.body;

    if (!Array.isArray(testCases) || testCases.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one test case.',
      });
    }

    const evaluation = await executionService.runTestCases({
      language,
      code,
      testCases,
    });

    let savedResultId = null;

    if (req.user) {
      const saved = await ExecutionResult.create({
        userId: req.user._id,
        submissionId: submissionId || null,
        language,
        sourceCode: code,
        status: evaluation.status,
        executionTimeMs: evaluation.averageTimeMs,
        memoryKb: evaluation.maxMemoryKb,
        testCaseResults: evaluation.testCaseResults,
      });
      savedResultId = saved._id;
    }

    res.json({
      success: true,
      executionId: savedResultId,
      evaluation,
    });
  } catch (err) {
    next(err);
  }
};

const getSupportedLanguages = (req, res) => {
  const languages = languageAdapterFactory.getAllLanguageMeta();
  res.json({
    success: true,
    languages,
  });
};

module.exports = {
  executeCode,
  runTestCases,
  getSupportedLanguages,
};
