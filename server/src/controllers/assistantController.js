const aiService = require('../services/ai/aiService');
const Conversation = require('../models/Conversation');

const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, message, language, codeContext } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Message content cannot be empty.' });
    }

    let conversation = null;

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation && req.user) {
      conversation = new Conversation({
        userId: req.user._id,
        title: message.slice(0, 40) + '...',
        language: language || 'general',
        codeContext: codeContext || '',
        messages: [],
      });
    }

    const history = conversation ? conversation.messages : [];

    // Query AI service
    const reply = await aiService.chat({
      language: language || conversation?.language || 'python',
      codeContext: codeContext || conversation?.codeContext || '',
      conversationHistory: history,
      userMessage: message,
    });

    if (conversation) {
      conversation.messages.push({
        role: 'user',
        content: message,
        timestamp: new Date(),
      });
      conversation.messages.push({
        role: 'assistant',
        content: reply,
        timestamp: new Date(),
      });
      if (codeContext) conversation.codeContext = codeContext;
      if (language) conversation.language = language;
      await conversation.save();
    }

    res.json({
      success: true,
      conversationId: conversation?._id || null,
      reply,
    });
  } catch (err) {
    next(err);
  }
};

const debugCode = async (req, res, next) => {
  try {
    const { language, code, compilerError, runtimeError, stdout, stderr } = req.body;

    const diagnosis = await aiService.debugCode({
      language,
      code,
      compilerError,
      runtimeError,
      stdout,
      stderr,
    });

    res.json({
      success: true,
      diagnosis,
    });
  } catch (err) {
    next(err);
  }
};

const getConversations = async (req, res, next) => {
  try {
    const conversations = await Conversation.find({ userId: req.user._id })
      .select('title language updatedAt createdAt')
      .sort({ updatedAt: -1 })
      .limit(20);

    res.json({
      success: true,
      conversations,
    });
  } catch (err) {
    next(err);
  }
};

const getConversationById = async (req, res, next) => {
  try {
    const conversation = await Conversation.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ success: false, message: 'Conversation not found.' });
    }

    res.json({
      success: true,
      conversation,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  sendMessage,
  debugCode,
  getConversations,
  getConversationById,
};
