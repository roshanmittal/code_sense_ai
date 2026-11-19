const axios = require('axios');
const env = require('../../config/env');

class PistonAdapter {
  constructor() {
    this.apiUrl = env.PISTON_API_URL;
  }

  async execute({ language, code, stdin = '' }) {
    const startTime = Date.now();
    try {
      const payload = {
        language: language === 'cpp' ? 'c++' : language,
        version: '*',
        files: [
          {
            name: language === 'java' ? 'Main.java' : `solution.${this.getFileExt(language)}`,
            content: code,
          },
        ],
        stdin: stdin || '',
        run_timeout: Math.floor(env.EXECUTION_TIMEOUT_MS / 1000),
      };

      const response = await axios.post(`${this.apiUrl}/execute`, payload, {
        timeout: env.EXECUTION_TIMEOUT_MS + 3000,
        headers: { 'Content-Type': 'application/json' },
      });

      const totalTimeMs = Date.now() - startTime;
      const data = response.data;
      const run = data.run || {};
      const compile = data.compile || {};

      const stdout = (run.stdout || '').slice(0, env.MAX_OUTPUT_CHARS);
      const stderr = (run.stderr || '').slice(0, env.MAX_OUTPUT_CHARS);
      const compileOutput = (compile.stderr || compile.stdout || '').slice(0, env.MAX_OUTPUT_CHARS);

      let status = 'Success';
      if (compile.code !== 0 && compileOutput) {
        status = 'Compilation Error';
      } else if (run.signal === 'SIGTERM' || run.signal === 'SIGKILL' || run.code === 124) {
        status = 'Time Limit Exceeded';
      } else if (run.code !== 0 || stderr) {
        status = 'Runtime Error';
      }

      return {
        provider: 'piston',
        status,
        stdout,
        stderr,
        compileOutput,
        executionTimeMs: run.time ? Math.round(run.time * 1000) : totalTimeMs,
        memoryKb: run.memory ? Math.round(run.memory / 1024) : 10240, // estimated or reported
        exitCode: run.code ?? compile.code ?? 0,
      };
    } catch (err) {
      if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
        return {
          provider: 'piston',
          status: 'Time Limit Exceeded',
          stdout: '',
          stderr: 'Execution timed out beyond service limit.',
          compileOutput: '',
          executionTimeMs: env.EXECUTION_TIMEOUT_MS,
          memoryKb: 0,
          exitCode: 124,
        };
      }

      return {
        provider: 'piston',
        status: 'Internal Error',
        stdout: '',
        stderr: err.response?.data?.message || err.message,
        compileOutput: '',
        executionTimeMs: Date.now() - startTime,
        memoryKb: 0,
        exitCode: 1,
      };
    }
  }

  getFileExt(lang) {
    switch (lang) {
      case 'python': return 'py';
      case 'javascript': return 'js';
      case 'cpp': return 'cpp';
      case 'java': return 'java';
      default: return 'txt';
    }
  }
}

module.exports = new PistonAdapter();
