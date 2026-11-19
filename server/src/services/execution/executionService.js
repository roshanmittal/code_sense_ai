const judge0Adapter = require('./judge0Adapter');
const pistonAdapter = require('./pistonAdapter');
const isolatedLocalRunner = require('./isolatedLocalRunner');

class ExecutionService {
  async execute({ language, code, stdin = '' }) {
    // 1. Python and JavaScript execute natively in local isolated sandbox
    if (isolatedLocalRunner.isSupportedLocally(language)) {
      return await isolatedLocalRunner.execute({ language, code, stdin });
    }

    // 2. C++ and Java use Judge0 (defaults to public open-source https://ce.judge0.com)
    if (judge0Adapter.isConfigured()) {
      try {
        const j0Result = await judge0Adapter.execute({ language, code, stdin });
        return j0Result;
      } catch (judge0Err) {
        console.warn(`[ExecutionService] Judge0 execution failed (${judge0Err.message}). Falling back...`);
      }
    }

    // 3. Fallback to Piston runner if custom PISTON_API_URL provided
    const pistonResult = await pistonAdapter.execute({ language, code, stdin });
    if (pistonResult.stderr && pistonResult.stderr.includes('whitelist only')) {
      return {
        provider: 'execution-engine',
        status: 'Compilation Error',
        stdout: '',
        stderr: `To execute ${language}, please verify internet connectivity to https://ce.judge0.com or configure a self-hosted Piston URL in server/.env. (Python and JavaScript execute locally out-of-the-box).`,
        compileOutput: `Execution notice: Ensure connectivity to https://ce.judge0.com or set JUDGE0_API_KEY.`,
        executionTimeMs: 0,
        memoryKb: 0,
        exitCode: 1,
      };
    }

    return pistonResult;
  }

  /**
   * Run an array of test cases against the given code
   * @param {Object} param0 
   * @returns {Object} test case evaluation summary
   */
  async runTestCases({ language, code, testCases = [] }) {
    if (!Array.isArray(testCases) || testCases.length === 0) {
      throw new Error('No test cases provided for evaluation');
    }

    const results = [];
    let passedCount = 0;
    let failedCount = 0;
    let hasCompilationError = false;
    let totalTime = 0;
    let maxMemory = 0;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];
      const execResult = await this.execute({
        language,
        code,
        stdin: tc.input || '',
      });

      totalTime += execResult.executionTimeMs || 0;
      if (execResult.memoryKb > maxMemory) maxMemory = execResult.memoryKb;

      if (execResult.status === 'Compilation Error') {
        hasCompilationError = true;
        results.push({
          testCaseIndex: i + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: '',
          passed: false,
          error: execResult.compileOutput || execResult.stderr || 'Compilation Error',
          executionTimeMs: 0,
          memoryKb: 0,
        });
        break;
      }

      const normalizedActual = (execResult.stdout || '').trim();
      const normalizedExpected = (tc.expectedOutput || '').trim();
      const isPassed = !execResult.stderr && normalizedActual === normalizedExpected;

      if (isPassed) {
        passedCount++;
      } else {
        failedCount++;
      }

      results.push({
        testCaseIndex: i + 1,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: execResult.stdout || '',
        passed: isPassed,
        error: execResult.stderr || (!isPassed ? 'Output mismatch' : null),
        executionTimeMs: execResult.executionTimeMs,
        memoryKb: execResult.memoryKb,
      });
    }

    let overallStatus = 'Accepted';
    if (hasCompilationError) {
      overallStatus = 'Compilation Error';
    } else if (failedCount > 0) {
      overallStatus = 'Wrong Answer';
    }

    return {
      status: overallStatus,
      totalTestCases: testCases.length,
      passedCount,
      failedCount: hasCompilationError ? testCases.length : failedCount,
      averageTimeMs: testCases.length > 0 ? Math.round(totalTime / testCases.length) : 0,
      maxMemoryKb: maxMemory,
      testCaseResults: results,
    };
  }
}

module.exports = new ExecutionService();
