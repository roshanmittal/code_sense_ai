const mongoose = require('mongoose');

const codeSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: 'Untitled Submission',
      trim: true,
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
    customInput: {
      type: String,
      default: '',
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    status: {
      type: String,
      enum: ['draft', 'analyzed', 'optimized', 'executed'],
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

codeSubmissionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('CodeSubmission', codeSubmissionSchema);
