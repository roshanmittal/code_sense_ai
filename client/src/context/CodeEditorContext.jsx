import React, { createContext, useContext, useState, useEffect } from 'react';
import { LANGUAGE_CONFIGS } from '../utils/languageTemplates';
import { useAuth } from './AuthContext';

const CodeEditorContext = createContext(null);

export const CodeEditorProvider = ({ children }) => {
  const { user } = useAuth();
  const initialLang = user?.preferences?.defaultLanguage || 'python';

  const [language, setLanguageState] = useState(initialLang);
  const [code, setCode] = useState(LANGUAGE_CONFIGS[initialLang]?.boilerplate || '');
  const [customInput, setCustomInput] = useState('');
  const [activeTab, setActiveTab] = useState('analysis'); // 'analysis' | 'execution' | 'testcases' | 'optimization'
  
  // Results
  const [analysisResult, setAnalysisResult] = useState(null);
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [testCases, setTestCases] = useState(LANGUAGE_CONFIGS[initialLang]?.defaultTestCases || []);
  const [testRunResult, setTestRunResult] = useState(null);
  const [benchmarkResult, setBenchmarkResult] = useState(null);

  // Status flags
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  // Update language and load default boilerplate if code hasn't been heavily modified
  const setLanguage = (newLang) => {
    if (newLang === language) return;
    setLanguageState(newLang);
    const config = LANGUAGE_CONFIGS[newLang];
    if (config) {
      setCode(config.boilerplate);
      setTestCases(config.defaultTestCases || []);
      // Reset state for new language session
      setAnalysisResult(null);
      setOptimizationResult(null);
      setExecutionResult(null);
      setTestRunResult(null);
    }
  };

  const resetEditor = () => {
    const config = LANGUAGE_CONFIGS[language];
    if (config) {
      setCode(config.boilerplate);
    }
  };

  return (
    <CodeEditorContext.Provider
      value={{
        language,
        setLanguage,
        code,
        setCode,
        customInput,
        setCustomInput,
        activeTab,
        setActiveTab,
        analysisResult,
        setAnalysisResult,
        optimizationResult,
        setOptimizationResult,
        executionResult,
        setExecutionResult,
        testCases,
        setTestCases,
        testRunResult,
        setTestRunResult,
        benchmarkResult,
        setBenchmarkResult,
        isAnalyzing,
        setIsAnalyzing,
        isOptimizing,
        setIsOptimizing,
        isExecuting,
        setIsExecuting,
        isBenchmarking,
        setIsBenchmarking,
        resetEditor,
      }}
    >
      {children}
    </CodeEditorContext.Provider>
  );
};

export const useCodeEditor = () => {
  const context = useContext(CodeEditorContext);
  if (!context) {
    throw new Error('useCodeEditor must be used within a CodeEditorProvider');
  }
  return context;
};
