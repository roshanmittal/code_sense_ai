const { spawn } = require('child_process');
const path = require('path');

console.log('====================================================');
console.log('🚀 Starting CodeSense AI Platform (Backend + Frontend)');
console.log('====================================================');

const isWindows = process.platform === 'win32';
const npmCmd = isWindows ? 'npm.cmd' : 'npm';

// 1. Start Express Backend
const server = spawn(npmCmd, ['start'], {
  cwd: path.resolve(__dirname, 'server'),
  stdio: 'inherit',
  shell: true,
});

// 2. Start Vite Frontend
const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: path.resolve(__dirname, 'client'),
  stdio: 'inherit',
  shell: true,
});

const cleanup = () => {
  console.log('\n🛑 Shutting down CodeSense AI services...');
  try {
    server.kill();
  } catch (e) {}
  try {
    client.kill();
  } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

server.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Backend process exited with code ${code}`);
  }
});

client.on('exit', (code) => {
  if (code !== 0 && code !== null) {
    console.error(`Frontend process exited with code ${code}`);
  }
});
