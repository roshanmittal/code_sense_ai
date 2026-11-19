import api from './api';

export const benchmarkService = {
  async runBenchmark({ language, originalCode, optimizedCode, customBenchmarkCases, iterations }) {
    const res = await api.post('/benchmarks', {
      language,
      originalCode,
      optimizedCode,
      customBenchmarkCases,
      iterations,
    });
    return res.data;
  },
};
