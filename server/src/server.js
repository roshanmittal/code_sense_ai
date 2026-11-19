const app = require('./app');
const { connectDB } = require('./config/db');
const env = require('./config/env');

const startServer = async () => {
  try {
    // Connect to MongoDB (with resilient in-memory fallback)
    await connectDB();

    const server = app.listen(env.PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 CodeSense AI Server running on port ${env.PORT}`);
      console.log(`⚡ Environment: ${env.NODE_ENV}`);
      console.log(`🧠 LLM Provider: ${env.LLM_PROVIDER} (${env.LLM_MODEL})`);
      console.log(`🔑 LLM Key Configured: ${Boolean(env.LLM_API_KEY)}`);
      console.log(`💻 Judge0 Host: ${env.JUDGE0_HOST} (Configured: ${Boolean(env.JUDGE0_API_KEY)})`);
      console.log(`====================================================`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! Shutting down gracefully...', err);
      server.close(() => {
        process.exit(1);
      });
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();
