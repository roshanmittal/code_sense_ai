const complexityEngine = require('../analysis/complexityEngine');
const aiService = require('../ai/aiService');
const executionService = require('../execution/executionService');

class OptimizationService {
  async optimize({ language, code, testCases = [] }) {
    // 1. Analyze original code first
    const originalAnalysis = await complexityEngine.analyze({ language, code });

    // 2. Generate AI-optimized code
    const optimizationResult = await aiService.optimizeCode({
      language,
      code,
      currentAnalysis: originalAnalysis,
    });

    // 3. If test cases are provided, validate both original and optimized solutions
    let validationStatus = {
      validated: false,
      testCasesRun: 0,
      testCasesPassed: 0,
      notes: 'No test cases provided for empirical validation.',
    };

    if (testCases && testCases.length > 0) {
      try {
        const originalTestRun = await executionService.runTestCases({
          language,
          code,
          testCases,
        });

        const optimizedTestRun = await executionService.runTestCases({
          language,
          code: optimizationResult.optimizedCode,
          testCases,
        });

        validationStatus = {
          validated: true,
          testCasesRun: testCases.length,
          testCasesPassed: optimizedTestRun.passedCount,
          originalPassed: originalTestRun.passedCount,
          notes: optimizedTestRun.status === 'Accepted'
            ? 'Optimized code passed all validation test cases successfully.'
            : `Optimized code passed ${optimizedTestRun.passedCount}/${testCases.length} test cases. (Status: ${optimizedTestRun.status})`,
        };
      } catch (valErr) {
        validationStatus = {
          validated: false,
          testCasesRun: testCases.length,
          testCasesPassed: 0,
          notes: `Validation run error: ${valErr.message}`,
        };
      }
    }

    return {
      originalCode: code,
      originalAnalysis: {
        timeComplexity: originalAnalysis.timeComplexity.worst,
        spaceComplexity: originalAnalysis.spaceComplexity.auxiliary,
        algorithm: originalAnalysis.algorithm.primaryAlgorithm,
        explanation: originalAnalysis.timeComplexity.explanation,
        dataStructures: originalAnalysis.algorithm.dataStructures,
      },
      optimizedCode: optimizationResult.optimizedCode,
      optimizedAnalysis: {
        timeComplexity: optimizationResult.optimizedAnalysis.timeComplexity,
        spaceComplexity: optimizationResult.optimizedAnalysis.spaceComplexity,
        algorithm: optimizationResult.optimizedAnalysis.algorithm,
        explanation: optimizationResult.optimizedAnalysis.explanation,
      },
      approachExplanation: optimizationResult.approachExplanation,
      dataStructuresIntroduced: optimizationResult.dataStructuresIntroduced || [],
      tradeOffs: optimizationResult.tradeOffs,
      isAlreadyOptimal: optimizationResult.isAlreadyOptimal || false,
      validationStatus,
    };
  }
}

module.exports = new OptimizationService();
