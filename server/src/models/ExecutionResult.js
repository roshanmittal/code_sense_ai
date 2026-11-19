const mongoose = require('mongoose');

const executionResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    submissionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodeSubmission',
      index: true,
    },
    language: {
      type: String,
      required: true,
      enum: ['cpp', 'python', 'java', 'javascript'],
    },
    sourceCode: {
      type: String,
      required: true,
    },
    stdin: {
      type: String,
      default: '',
    },
    stdout: {
      type: String,
      default: '',
    },
    stderr: {
      type: String,
      default: '',
    },
    compileOutput: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: [
        'Success',
        'Accepted',
        'Wrong Answer',
        'Time Limit Exceeded',
        'Memory Limit Exceeded',
        'Compilation Error',
        'Runtime Error',
        'Internal Error',
      ],
      default: 'Success',
    },
    executionTimeMs: {
      type: Number,
      default: 0,
    },
    memoryKb: {
      type: Number,
      default: 0,
    },
    testCaseResults: [
      {
        testCaseIndex: Number,
        input: String,
        expectedOutput: String,
        actualOutput: String,
        passed: Boolean,
        executionTimeMs: Number,
        memoryKb: Number,
        error: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

executionResultSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ExecutionResult', executionResultSchema);
