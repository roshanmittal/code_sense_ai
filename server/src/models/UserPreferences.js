const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    defaultLanguage: {
      type: String,
      enum: ['cpp', 'python', 'java', 'javascript'],
      default: 'python',
    },
    editorTheme: {
      type: String,
      enum: ['vs-dark', 'light', 'hc-black'],
      default: 'vs-dark',
    },
    fontSize: {
      type: Number,
      default: 14,
      min: 10,
      max: 24,
    },
    tabSize: {
      type: Number,
      default: 4,
      enum: [2, 4],
    },
    autoFormat: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);
