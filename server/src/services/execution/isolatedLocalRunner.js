const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const env = require('../../config/env');

class IsolatedLocalRunner {
  constructor() {
    this.sandboxDir = path.resolve(__dirname, '../../../.sandbox_exec');
    if (!fs.existsSync(this.sandboxDir)) {
      try {
        fs.mkdirSync(this.sandboxDir, { recursive: true });
      } catch (e) {}
    }
  }

  isSupportedLocally(language) {
    return language === 'python' || language === 'javascript';
  }

  async execute({ language, code, stdin = '' }) {
    if (!this.isSupportedLocally(language)) {
      return {
        provider: 'local-isolated-sandbox',
        status: 'Compilation Error',
        stdout: '',
        stderr: `Local host environment does not have a native compiler for ${language}. To execute ${language}, please configure JUDGE0_API_KEY or a self-hosted PISTON_API_URL in server/.env. Python and JavaScript are natively supported locally.`,
        compileOutput: `Execution prerequisite missing: Host ${language} compiler or Judge0 credentials not configured.`,
        executionTimeMs: 0,
        memoryKb: 0,
        exitCode: 1,
      };
    }

    const runId = `exec_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const ext = language === 'python' ? 'py' : 'js';
    const filePath = path.join(this.sandboxDir, `${runId}.${ext}`);

    try {
      fs.writeFileSync(filePath, code, 'utf-8');
    } catch (writeErr) {
      return {
        provider: 'local-isolated-sandbox',
        status: 'Internal Error',
        stdout: '',
        stderr: `Failed to prepare sandbox execution file: ${writeErr.message}`,
        compileOutput: '',
        executionTimeMs: 0,
        memoryKb: 0,
        exitCode: 1,
      };
    }

    const command = language === 'python' ? 'python' : 'node';
    const args = [filePath];

    const startTime = Date.now();

    return new Promise((resolve) => {
      let stdout = '';
      let stderr = '';
      let timedOut = false;

      // Spawn child process with isolated environment and timeout
      const child = spawn(command, args, {
        cwd: this.sandboxDir,
        env: {
          PATH: process.env.PATH,
          SYSTEMROOT: process.env.SYSTEMROOT,
          TEMP: this.sandboxDir,
        },
        windowsHide: true,
      });

      const timeoutId = setTimeout(() => {
        timedOut = true;
        try {
          child.kill('SIGKILL');
        } catch (e) {}
      }, env.EXECUTION_TIMEOUT_MS);

      if (stdin) {
        try {
          child.stdin.write(stdin);
          child.stdin.end();
        } catch (e) {}
      } else {
        child.stdin.end();
      }

      child.stdout.on('data', (chunk) => {
        if (stdout.length < env.MAX_OUTPUT_CHARS) {
          stdout += chunk.toString();
        }
      });

      child.stderr.on('data', (chunk) => {
        if (stderr.length < env.MAX_OUTPUT_CHARS) {
          stderr += chunk.toString();
        }
      });

      child.on('error', (err) => {
        clearTimeout(timeoutId);
        this.cleanupFile(filePath);
        resolve({
          provider: 'local-isolated-sandbox',
          status: 'Runtime Error',
          stdout: stdout.slice(0, env.MAX_OUTPUT_CHARS),
          stderr: `Process execution error: ${err.message}`,
          compileOutput: '',
          executionTimeMs: Date.now() - startTime,
          memoryKb: 0,
          exitCode: 1,
        });
      });

      child.on('close', (code, signal) => {
        clearTimeout(timeoutId);
        this.cleanupFile(filePath);
        const totalTime = Date.now() - startTime;

        if (timedOut || signal === 'SIGTERM' || signal === 'SIGKILL') {
          return resolve({
            provider: 'local-isolated-sandbox',
            status: 'Time Limit Exceeded',
            stdout: stdout.slice(0, env.MAX_OUTPUT_CHARS),
            stderr: `Execution exceeded time limit of ${env.EXECUTION_TIMEOUT_MS}ms.`,
            compileOutput: '',
            executionTimeMs: env.EXECUTION_TIMEOUT_MS,
            memoryKb: 8192,
            exitCode: 124,
          });
        }

        let status = 'Success';
        if (code !== 0 || stderr.trim().length > 0) {
          if (stderr.includes('SyntaxError') || stderr.includes('IndentationError')) {
            status = 'Compilation Error';
          } else {
            status = 'Runtime Error';
          }
        }

        resolve({
          provider: 'local-isolated-sandbox',
          status,
          stdout: stdout.slice(0, env.MAX_OUTPUT_CHARS),
          stderr: stderr.slice(0, env.MAX_OUTPUT_CHARS),
          compileOutput: status === 'Compilation Error' ? stderr : '',
          executionTimeMs: totalTime,
          memoryKb: 8192, // standard process baseline
          exitCode: code ?? 0,
        });
      });
    });
  }

  cleanupFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (e) {}
  }
}

module.exports = new IsolatedLocalRunner();
