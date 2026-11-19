const languageAdapterFactory = require('../../adapters/languages/LanguageAdapterFactory');
const aiService = require('../ai/aiService');

class ComplexityEngine {
  /**
   * Run hybrid analysis combining AST/static parser and AI reasoning
   * @param {Object} param0 
   * @returns {Object} full complexity and algorithmic analysis
   */
  async analyze({ language, code }) {
    const adapter = languageAdapterFactory.getAdapter(language);
    const staticMetrics = adapter.analyzeStaticStructure(code);

    // Call AI service with static clues
    const analysis = await aiService.analyzeCode({
      language,
      code,
      staticMetrics,
    });

    return {
      language,
      code,
      ...analysis,
    };
  }
}

module.exports = new ComplexityEngine();
