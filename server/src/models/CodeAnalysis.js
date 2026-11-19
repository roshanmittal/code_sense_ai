const mongoose = require('mongoose');

const codeAnalysisSchema = new mongoose.Schema(
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
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    timeComplexity: {
      best: { type: String, default: 'O(1)' },
      average: { type: String, default: 'O(n)' },
      worst: { type: String, default: 'O(n)' },
      explanation: { type: String, default: '' },
      nestedLoops: [
        {
          depth: Number,
          line: Number,
          description: String,
        },
      ],
      recursionDetected: { type: Boolean, default: false },
      recursionDetails: { type: String, default: '' },
      inputSensitivity: { type: String, default: '' },
    },
    spaceComplexity: {
      auxiliary: { type: String, default: 'O(1)' },
      total: { type: String, default: 'O(1)' },
      explanation: { type: String, default: '' },
      dataStructuresUsed: [{ type: String }],
      recursionStack: { type: String, default: 'O(1)' },
    },
    algorithm: {
      primaryAlgorithm: { type: String, default: 'Unclassified' },
      category: { type: String, default: 'General' },
      detectedPatterns: [{ type: String }],
      confidence: { type: Number, default: 0.8, min: 0, max: 1 },
      dataStructures: [{ type: String }],
    },
    codeQuality: {
      score: { type: Number, default: 80, min: 0, max: 100 },
      bottlenecks: [{ type: String }],
      redundantOperations: [{ type: String }],
      memoryUsageNotes: [{ type: String }],
      logicalIssues: [{ type: String }],
      suggestions: [{ type: String }],
    },
    staticMetrics: {
      lineCount: Number,
      maxLoopDepth: Number,
      hasRecursion: Boolean,
      ruleEstimatedTime: String,
      ruleEstimatedSpace: String,
      cyclomaticComplexity: Number,
    },
    assumptionsAndUncertainties: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

codeAnalysisSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('CodeAnalysis', codeAnalysisSchema);
