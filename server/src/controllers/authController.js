const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserPreferences = require('../models/UserPreferences');
const env = require('../config/env');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists.',
      });
    }

    const user = await User.create({ name, email, password });

    // Initialize default preferences
    await UserPreferences.create({
      userId: user._id,
      defaultLanguage: 'python',
      editorTheme: 'vs-dark',
      fontSize: 14,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. User not found.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials. Incorrect password.',
      });
    }

    const token = generateToken(user._id);

    const preferences = await UserPreferences.findOne({ userId: user._id });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences: preferences || null,
      },
    });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const preferences = await UserPreferences.findOne({ userId: req.user.id });

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferences,
      },
    });
  } catch (err) {
    next(err);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const { defaultLanguage, editorTheme, fontSize, tabSize, autoFormat } = req.body;

    let preferences = await UserPreferences.findOne({ userId: req.user.id });
    if (!preferences) {
      preferences = new UserPreferences({ userId: req.user.id });
    }

    if (defaultLanguage) preferences.defaultLanguage = defaultLanguage;
    if (editorTheme) preferences.editorTheme = editorTheme;
    if (fontSize) preferences.fontSize = fontSize;
    if (tabSize) preferences.tabSize = tabSize;
    if (autoFormat !== undefined) preferences.autoFormat = autoFormat;

    await preferences.save();

    res.json({
      success: true,
      preferences,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updatePreferences,
};
