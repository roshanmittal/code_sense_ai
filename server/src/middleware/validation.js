// Request validation helpers
const validateSubmission = (req, res, next) => {
  const { language, code } = req.body;
  const validLanguages = ['cpp', 'python', 'java', 'javascript'];

  if (!language || !validLanguages.includes(language.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid or missing language. Supported: ${validLanguages.join(', ')}`,
    });
  }

  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Code cannot be empty.',
    });
  }

  if (code.length > 50000) {
    return res.status(400).json({
      success: false,
      message: 'Source code exceeds maximum allowed size of 50KB.',
    });
  }

  req.body.language = language.toLowerCase();
  next();
};

const validateExecution = (req, res, next) => {
  const { language, code, customInput } = req.body;
  const validLanguages = ['cpp', 'python', 'java', 'javascript'];

  if (!language || !validLanguages.includes(language.toLowerCase())) {
    return res.status(400).json({
      success: false,
      message: `Invalid or missing language. Supported: ${validLanguages.join(', ')}`,
    });
  }

  if (!code || typeof code !== 'string' || code.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Code is required for execution.',
    });
  }

  if (customInput && typeof customInput === 'string' && customInput.length > 10000) {
    return res.status(400).json({
      success: false,
      message: 'Custom input exceeds maximum allowed size of 10KB.',
    });
  }

  req.body.language = language.toLowerCase();
  next();
};

module.exports = { validateSubmission, validateExecution };
