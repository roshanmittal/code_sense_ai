const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Support both root .env and server/.env
const rootEnvPath = path.resolve(__dirname, '../../../.env');
const serverEnvPath = path.resolve(__dirname, '../../.env');

if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
}
if (fs.existsSync(serverEnvPath)) {
  dotenv.config({ path: serverEnvPath, override: true });
}

module.exports = {
  PORT: process.env.PORT || 5050,
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codesense_ai',
  JWT_SECRET: process.env.JWT_SECRET || 'codesense_default_jwt_secret_key_super_secure_32chars',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  
  // AI Config
  LLM_PROVIDER: process.env.LLM_PROVIDER || 'gemini',
  LLM_API_KEY: process.env.LLM_API_KEY || process.env.GEMINI_API_KEY || '',
  LLM_MODEL: process.env.LLM_MODEL || 'gemini-3.5-flash-lite',

  // Judge0 / Code Execution Config
  JUDGE0_API_URL: process.env.JUDGE0_API_URL || 'https://ce.judge0.com',
  JUDGE0_API_KEY: process.env.JUDGE0_API_KEY || '',
  JUDGE0_HOST: process.env.JUDGE0_HOST || 'ce.judge0.com',
  PISTON_API_URL: process.env.PISTON_API_URL || 'https://emkc.org/api/v2/piston',
  EXECUTION_TIMEOUT_MS: parseInt(process.env.EXECUTION_TIMEOUT_MS || '7000', 10),
  MAX_MEMORY_KB: parseInt(process.env.MAX_MEMORY_KB || '128000', 10),
  MAX_OUTPUT_CHARS: parseInt(process.env.MAX_OUTPUT_CHARS || '10000', 10),
};
