const executionService = require('../execution/executionService');

class BenchmarkService {
  /**
   * Benchmark original vs optimized code across inputs / iterations
   */
  async benchmark({ language, originalCode, optimizedCode, customBenchmarkCases = [], iterations = 2 }) {
    // Default test inputs representing Small, Medium, Large scales if none provided
    const testSuites = customBenchmarkCases.length > 0 ? customBenchmarkCases : [
      { name: 'Small Input (N=10)', input: '10\n' },
      { name: 'Medium Input (N=1000)', input: '1000\n' },
      { name: 'Large Input (N=10000)', input: '10000\n' },
    ];

    const benchmarkResults = [];

    for (const testCase of testSuites) {
      const origTimes = [];
      const origMems = [];
      const optTimes = [];
      const optMems = [];

      let origOutput = '';
      let optOutput = '';
      let origStatus = 'Success';
      let optStatus = 'Success';

      // Run multiple iterations for original code
      for (let i = 0; i < iterations; i++) {
        const res = await executionService.execute({
          language,
          code: originalCode,
          stdin: testCase.input,
        });
        origTimes.push(res.executionTimeMs || 1);
        origMems.push(res.memoryKb || 512);
        origOutput = res.stdout;
        if (res.status !== 'Success' && res.status !== 'Accepted') {
          origStatus = res.status;
        }
      }

      // Run multiple iterations for optimized code
      for (let i = 0; i < iterations; i++) {
        const res = await executionService.execute({
          language,
          code: optimizedCode,
          stdin: testCase.input,
        });
        optTimes.push(res.executionTimeMs || 1);
        optMems.push(res.memoryKb || 512);
        optOutput = res.stdout;
        if (res.status !== 'Success' && res.status !== 'Accepted') {
          optStatus = res.status;
        }
      }

      const avgOrigTime = Math.round(origTimes.reduce((a, b) => a + b, 0) / origTimes.length);
      const avgOrigMem = Math.round(origMems.reduce((a, b) => a + b, 0) / origMems.length);

      const avgOptTime = Math.round(optTimes.reduce((a, b) => a + b, 0) / optTimes.length);
      const avgOptMem = Math.round(optMems.reduce((a, b) => a + b, 0) / optMems.length);

      const speedup = avgOptTime > 0 ? (avgOrigTime / avgOptTime).toFixed(2) + 'x' : '1.0x';

      benchmarkResults.push({
        name: testCase.name,
        input: testCase.input,
        originalTimeMs: avgOrigTime,
        optimizedTimeMs: avgOptTime,
        originalMemoryKb: avgOrigMem,
        optimizedMemoryKb: avgOptMem,
        speedup,
        originalStatus: origStatus,
        optimizedStatus: optStatus,
        outputsMatch: origOutput.trim() === optOutput.trim(),
      });
    }

    return {
      language,
      iterations,
      benchmarkResults,
      summary: {
        totalSuites: testSuites.length,
        averageOriginalTimeMs: Math.round(benchmarkResults.reduce((sum, r) => sum + r.originalTimeMs, 0) / benchmarkResults.length),
        averageOptimizedTimeMs: Math.round(benchmarkResults.reduce((sum, r) => sum + r.optimizedTimeMs, 0) / benchmarkResults.length),
      },
      disclaimer: 'Empirical runtime measurements reflect host execution latency and cold-start characteristics. Wall-clock benchmark timings provide practical comparison metrics but do not serve as formal mathematical proofs of theoretical Big-O asymptotic complexity.',
    };
  }
}

module.exports = new BenchmarkService();
