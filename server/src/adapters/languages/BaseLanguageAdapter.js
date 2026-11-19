/**
 * BaseLanguageAdapter
 * Abstract base class for all language-specific adapters.
 * Guarantees a common interface so new languages can be added seamlessly.
 */
class BaseLanguageAdapter {
  constructor(id, displayName, monacoLanguage, judge0Id, pistonConfig) {
    if (new.target === BaseLanguageAdapter) {
      throw new TypeError('Cannot construct BaseLanguageAdapter instances directly');
    }
    this.id = id;
    this.displayName = displayName;
    this.monacoLanguage = monacoLanguage;
    this.judge0Id = judge0Id;
    this.pistonConfig = pistonConfig;
  }

  getLanguageId() {
    return this.id;
  }

  getDisplayName() {
    return this.displayName;
  }

  getMonacoLanguage() {
    return this.monacoLanguage;
  }

  getJudge0Id() {
    return this.judge0Id;
  }

  getPistonConfig() {
    return this.pistonConfig;
  }

  /**
   * Default starter template for the language
   */
  getDefaultBoilerplate() {
    throw new Error('getDefaultBoilerplate() must be implemented by subclass');
  }

  /**
   * Performs static/heuristic AST or structural analysis
   * @param {string} code 
   * @returns {Object} static metrics and detected structural features
   */
  analyzeStaticStructure(code) {
    throw new Error('analyzeStaticStructure() must be implemented by subclass');
  }

  /**
   * Wraps code if necessary to execute test cases or inject stdin
   */
  prepareExecutableSource(code) {
    return code;
  }
}

module.exports = BaseLanguageAdapter;
