const mongoose = require('mongoose');

const optimizationSchema = new mongoose.Schema(
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
    originalCode: {
      type: String,
      required: true,
    },
    originalAnalysis: {
      timeComplexity: { type: String, default: 'O(n^2)' },
      spaceComplexity: { type: String, default: 'O(1)' },
      algorithm: { type: String, default: '' },
      explanation: { type: String, default: '' },
    },
    optimizedCode: {
      type: String,
      required: true,
    },
    optimizedAnalysis: {
      timeComplexity: { type: String, default: 'O(n)' },
      spaceComplexity: { type: String, default: 'O(n)' },
      algorithm: { type: String, default: '' },
      explanation: { type: String, default: '' },
    },
    approachExplanation: {
      type: String,
      default: '',
    },
    dataStructuresIntroduced: [{ type: String }],
    tradeOffs: {
      timeGain: { type: String, default: '' },
      spaceCost: { type: String, default: '' },
      summary: { type: String, default: '' },
    },
    validationStatus: {
      validated: { type: Boolean, default: false },
      testCasesRun: { type: Number, default: 0 },
      testCasesPassed: { type: Number, default: 0 },
      notes: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

optimizationSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Optimization', optimizationSchema);
