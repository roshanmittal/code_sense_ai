const axios = require('axios');
const env = require('../../config/env');
const languageAdapterFactory = require('../../adapters/languages/LanguageAdapterFactory');

class Judge0Adapter {
  constructor() {
    this.apiUrl = env.JUDGE0_API_URL.replace(/\/$/, '');
    this.apiKey = env.JUDGE0_API_KEY;
    this.host = env.JUDGE0_HOST;
  }

  isConfigured() {
    return Boolean(
      (this.apiKey && this.apiKey.trim().length > 0) ||
      this.apiUrl.includes('ce.judge0.com') ||
      this.apiUrl.includes('localhost') ||
      this.apiUrl.includes('127.0.0.1')
    );
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (this.apiKey) {
      headers['X-RapidAPI-Key'] = this.apiKey;
      headers['X-RapidAPI-Host'] = this.host;
    }
    return headers;
  }

  async execute({ language, code, stdin = '' }) {
    const startTime = Date.now();
    const adapter = languageAdapterFactory.getAdapter(language);
    const languageId = adapter ? adapter.getJudge0Id() : 71;

    try {
      // 1. Submit execution request with wait=true for fast response
      const submitRes = await axios.post(
        `${this.apiUrl}/submissions?base64_encoded=false&wait=true`,
        {
          source_code: code,
          language_id: languageId,
          stdin: stdin || '',
          cpu_time_limit: Math.min(Math.floor(env.EXECUTION_TIMEOUT_MS / 1000), 5),
          memory_limit: env.MAX_MEMORY_KB,
        },
        {
          headers: this.getHeaders(),
          timeout: 12000,
        }
      );

      let result = submitRes.data;

      // If not finished immediately, poll by token
      if (result && result.token && (!result.status || result.status.id < 3)) {
        const token = result.token;
        const pollStart = Date.now();
        while (Date.now() - pollStart < env.EXECUTION_TIMEOUT_MS + 2000) {
          await new Promise((r) => setTimeout(r, 800));
          const statusRes = await axios.get(
            `${this.apiUrl}/submissions/${token}?base64_encoded=false`,
            {
              headers: this.getHeaders(),
              timeout: 5000,
            }
          );
          const sub = statusRes.data;
          if (sub.status && sub.status.id >= 3) {
            result = sub;
            break;
          }
        }
      }

      if (!result || !result.status) {
        return {
          provider: 'judge0',
          status: 'Time Limit Exceeded',
          stdout: '',
          stderr: 'Execution timed out waiting for Judge0 worker.',
          compileOutput: '',
          executionTimeMs: env.EXECUTION_TIMEOUT_MS,
          memoryKb: 0,
          exitCode: 124,
        };
      }

      let status = 'Success';
      const statusId = result.status.id;
      if (statusId === 3) status = 'Accepted';
      else if (statusId === 4) status = 'Wrong Answer';
      else if (statusId === 5) status = 'Time Limit Exceeded';
      else if (statusId === 6) status = 'Compilation Error';
      else if (statusId >= 7 && statusId <= 12) status = 'Runtime Error';

      return {
        provider: 'judge0',
        status,
        stdout: (result.stdout || '').slice(0, env.MAX_OUTPUT_CHARS),
        stderr: (result.stderr || '').slice(0, env.MAX_OUTPUT_CHARS),
        compileOutput: (result.compile_output || '').slice(0, env.MAX_OUTPUT_CHARS),
        executionTimeMs: result.time ? Math.round(parseFloat(result.time) * 1000) : Date.now() - startTime,
        memoryKb: result.memory || 0,
        exitCode: result.exit_code ?? 0,
      };
    } catch (err) {
      throw new Error(`Judge0 execution failed: ${err.message}`);
    }
  }
}

module.exports = new Judge0Adapter();
