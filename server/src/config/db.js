const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const env = require('./env');

let memoryServerInstance = null;

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);

    // First attempt connecting to configured MONGODB_URI with 2s timeout
    await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] Connected successfully to MongoDB: ${mongoose.connection.host}`);
  } catch (initialErr) {
    console.warn(`[Database] Primary MONGODB_URI not reachable (${initialErr.message}).`);
    console.log(`[Database] Initializing resilient In-Memory MongoDB Server...`);

    try {
      // Point to system mongod binary if available on Windows
      const systemMongod = 'C:\\Program Files\\MongoDB\\Server\\8.2\\bin\\mongod.exe';
      if (fs.existsSync(systemMongod)) {
        process.env.MONGOMS_SYSTEM_BINARY = systemMongod;
      }
      process.env.MONGOMS_DOWNLOAD_DIR = path.resolve(__dirname, '../../../.mongo_cache');

      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create();
      const memoryUri = memoryServerInstance.getUri();
      await mongoose.connect(memoryUri);
      console.log(`[Database] Connected to In-Memory MongoDB Server at: ${memoryUri}`);
    } catch (memErr) {
      console.error(`[Database] Failed to initialize in-memory MongoDB:`, memErr.message);
      throw memErr;
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServerInstance) {
      await memoryServerInstance.stop();
    }
  } catch (err) {
    console.error(`[Database] Error while disconnecting: ${err.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
