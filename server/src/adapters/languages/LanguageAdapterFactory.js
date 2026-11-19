const CppAdapter = require('./cpp/cppAdapter');
const PythonAdapter = require('./python/pythonAdapter');
const JavaAdapter = require('./java/javaAdapter');
const JavascriptAdapter = require('./javascript/javascriptAdapter');

class LanguageAdapterFactory {
  constructor() {
    this.adapters = new Map();
    this.registerAdapter(new PythonAdapter());
    this.registerAdapter(new JavascriptAdapter());
    this.registerAdapter(new CppAdapter());
    this.registerAdapter(new JavaAdapter());
  }

  registerAdapter(adapter) {
    this.adapters.set(adapter.getLanguageId().toLowerCase(), adapter);
  }

  getAdapter(language) {
    if (!language) return null;
    const key = language.toLowerCase();
    const adapter = this.adapters.get(key);
    if (!adapter) {
      throw new Error(`Unsupported programming language: ${language}. Supported languages: ${this.getSupportedLanguages().join(', ')}`);
    }
    return adapter;
  }

  getSupportedLanguages() {
    return Array.from(this.adapters.keys());
  }

  getAllLanguageMeta() {
    return Array.from(this.adapters.values()).map((adapter) => ({
      id: adapter.getLanguageId(),
      displayName: adapter.getDisplayName(),
      monacoLanguage: adapter.getMonacoLanguage(),
      boilerplate: adapter.getDefaultBoilerplate(),
    }));
  }
}

// Export singleton instance
module.exports = new LanguageAdapterFactory();
