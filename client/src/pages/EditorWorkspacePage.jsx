import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Zap, 
  Terminal, 
  CheckSquare, 
  Clock, 
  HardDrive, 
  Layers, 
  ExternalLink,
  GitCompare,
  AlertCircle
} from 'lucide-react';
import { useCodeEditor } from '../context/CodeEditorContext';
import { analysisService } from '../services/analysisService';
import { optimizationService } from '../services/optimizationService';
import { executionService } from '../services/executionService';
import { assistantService } from '../services/assistantService';
import { MonacoCodeEditor } from '../components/editor/MonacoCodeEditor';
import { EditorControls } from '../components/editor/EditorControls';
import { CustomInputPanel } from '../components/editor/CustomInputPanel';
import { ComplexityCard } from '../components/analysis/ComplexityCard';
import { BottleneckList } from '../components/analysis/BottleneckList';
import { ExecutionOutput } from '../components/execution/ExecutionOutput';
import { TestCaseRunner } from '../components/execution/TestCaseRunner';
import { ComplexityComparison } from '../components/optimization/ComplexityComparison';
import { Badge, DifficultyBadge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';

export const EditorWorkspacePage = () => {
  const navigate = useNavigate();
  const {
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
    isAnalyzing,
    setIsAnalyzing,
    isOptimizing,
    setIsOptimizing,
    isExecuting,
    setIsExecuting,
    resetEditor,
  } = useCodeEditor();

  const [showCustomInput, setShowCustomInput] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [recommendations, setRecommendations] = useState([]);

  // 1. Analyze Code Handler
  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      const data = await analysisService.analyzeCode({
        language,
        code,
      });
      if (data.success) {
        setAnalysisResult(data.analysis);
        if (data.recommendations) {
          setRecommendations(data.recommendations);
        }
        setActiveTab('analysis');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Analysis request failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 2. Optimize Code Handler
  const handleOptimize = async () => {
    setIsOptimizing(true);
    setErrorMessage(null);
    try {
      const data = await optimizationService.optimizeCode({
        language,
        code,
        testCases,
      });
      if (data.success) {
        setOptimizationResult(data);
        setActiveTab('optimization');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Optimization request failed');
    } finally {
      setIsOptimizing(false);
    }
  };

  // 3. Execute Code Handler
  const handleExecute = async () => {
    setIsExecuting(true);
    setErrorMessage(null);
    try {
      const data = await executionService.executeCode({
        language,
        code,
        customInput,
      });
      if (data.success) {
        setExecutionResult(data.result);
        setActiveTab('execution');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Execution request failed');
    } finally {
      setIsExecuting(false);
    }
  };

  // 4. Run Test Cases Handler
  const handleRunTestCases = async () => {
    setIsExecuting(true);
    setErrorMessage(null);
    try {
      const data = await executionService.runTestCases({
        language,
        code,
        testCases,
      });
      if (data.success) {
        setTestRunResult(data.evaluation);
        setActiveTab('testcases');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || err.message || 'Test case run failed');
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 flex-1">
      {/* Top Controls Toolbar */}
      <EditorControls
        language={language}
        onLanguageChange={setLanguage}
        onAnalyze={handleAnalyze}
        onOptimize={handleOptimize}
        onExecute={handleExecute}
        onRunTestCases={handleRunTestCases}
        isAnalyzing={isAnalyzing}
        isOptimizing={isOptimizing}
        isExecuting={isExecuting}
        showCustomInput={showCustomInput}
        onToggleCustomInput={() => setShowCustomInput(!showCustomInput)}
      />

      {/* Error Alert if any */}
      {errorMessage && (
        <Alert type="danger" title="Operation Error">
          {errorMessage}
        </Alert>
      )}

      {/* Main Workspace Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Monaco Code Editor (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-3">
          <MonacoCodeEditor
            language={language}
            code={code}
            onChange={setCode}
            onReset={resetEditor}
            height="560px"
          />

          {/* Stdin Panel if toggled */}
          {showCustomInput && (
            <CustomInputPanel
              value={customInput}
              onChange={setCustomInput}
              onClose={() => setShowCustomInput(false)}
            />
          )}
        </div>

        {/* Right Column: Tabbed Output and Analysis Panels (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3 bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-xl min-h-[560px]">
          {/* Panel Tab Navigation */}
          <div className="flex items-center border-b border-[#30363d] bg-[#0d1117] text-xs font-medium px-2 pt-2 gap-1 overflow-x-auto">
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-colors border-t border-x ${
                activeTab === 'analysis'
                  ? 'bg-[#161b22] text-white border-[#30363d] border-b-transparent font-semibold'
                  : 'text-gray-400 hover:text-gray-200 border-transparent'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Complexity</span>
            </button>

            <button
              onClick={() => setActiveTab('optimization')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-colors border-t border-x ${
                activeTab === 'optimization'
                  ? 'bg-[#161b22] text-white border-[#30363d] border-b-transparent font-semibold'
                  : 'text-gray-400 hover:text-gray-200 border-transparent'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Optimization</span>
            </button>

            <button
              onClick={() => setActiveTab('execution')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-colors border-t border-x ${
                activeTab === 'execution'
                  ? 'bg-[#161b22] text-white border-[#30363d] border-b-transparent font-semibold'
                  : 'text-gray-400 hover:text-gray-200 border-transparent'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Console</span>
            </button>

            <button
              onClick={() => setActiveTab('testcases')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-t-lg transition-colors border-t border-x ${
                activeTab === 'testcases'
                  ? 'bg-[#161b22] text-white border-[#30363d] border-b-transparent font-semibold'
                  : 'text-gray-400 hover:text-gray-200 border-transparent'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5 text-sky-400" />
              <span>Test Cases</span>
            </button>
          </div>

          {/* Active Tab Body */}
          <div className="p-4 flex-1 overflow-y-auto max-h-[580px]">
            {/* 1. Analysis Tab */}
            {activeTab === 'analysis' && (
              <div>
                {analysisResult ? (
                  <div className="flex flex-col gap-4">
                    {/* Primary Complexity */}
                    <ComplexityCard analysis={analysisResult} />

                    {/* Detected Pattern Badges */}
                    {analysisResult.algorithm?.detectedPatterns && (
                      <div className="p-3 bg-[#0d1117] rounded-xl border border-[#21262d]">
                        <div className="text-xs font-semibold text-gray-300 mb-1.5">Detected Patterns:</div>
                        <div className="flex flex-wrap gap-1.5">
                          {analysisResult.algorithm.detectedPatterns.map((pat, idx) => (
                            <Badge key={idx} variant="purple" size="sm">{pat}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bottlenecks and Quality */}
                    <BottleneckList codeQuality={analysisResult.codeQuality} />

                    {/* Matched DSA Problem Recommendations */}
                    {recommendations.length > 0 && (
                      <div className="p-4 bg-[#0d1117] rounded-xl border border-[#21262d] flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                            Recommended DSA Practice:
                          </span>
                          <span className="text-[11px] text-gray-500">Based on detected pattern</span>
                        </div>
                        <div className="flex flex-col gap-2">
                          {recommendations.slice(0, 3).map((prob) => (
                            <a
                              key={prob.id}
                              href={prob.url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 rounded-lg bg-[#161b22] hover:bg-[#21262d] border border-[#30363d] transition-colors flex items-center justify-between group"
                            >
                              <div className="flex flex-col">
                                <span className="text-xs font-medium text-gray-200 group-hover:text-indigo-400">
                                  {prob.title}
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono">
                                  Time: {prob.timeComplexity} • Space: {prob.spaceComplexity}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <DifficultyBadge difficulty={prob.difficulty} />
                                <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-indigo-400" />
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400 flex flex-col items-center justify-center min-h-[300px]">
                    <Sparkles className="w-8 h-8 text-indigo-400 mb-2" />
                    <p className="text-sm font-medium text-gray-200">No complexity analysis yet</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Click <span className="text-indigo-400 font-medium">Analyze</span> to run hybrid AST and complexity evaluation.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 2. Optimization Tab */}
            {activeTab === 'optimization' && (
              <div>
                {optimizationResult ? (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-300">Optimization Overview</span>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate('/comparison')}
                        leftIcon={<GitCompare className="w-3.5 h-3.5" />}
                      >
                        Full Side-by-Side Diff
                      </Button>
                    </div>

                    <ComplexityComparison optimization={optimizationResult} />
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-400 flex flex-col items-center justify-center min-h-[300px]">
                    <Zap className="w-8 h-8 text-amber-400 mb-2" />
                    <p className="text-sm font-medium text-gray-200">No optimization generated yet</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Click <span className="text-amber-400 font-medium">Optimize</span> to generate an AI-optimized solution with dual complexity comparison.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* 3. Execution Console Tab */}
            {activeTab === 'execution' && (
              <ExecutionOutput
                result={executionResult}
                onDebugWithAi={(errMsg) => {
                  assistantService.debugCode({
                    language,
                    code,
                    compilerError: executionResult?.compileOutput,
                    stderr: executionResult?.stderr,
                  }).then((res) => {
                    alert(`AI Debug Diagnosis:\n\n${res.diagnosis.rootCause}\n\nSuggested Fix: ${res.diagnosis.fixExplanation}`);
                  });
                }}
              />
            )}

            {/* 4. Test Cases Tab */}
            {activeTab === 'testcases' && (
              <TestCaseRunner
                testCases={testCases}
                onUpdateTestCases={setTestCases}
                onRunTestCases={handleRunTestCases}
                testRunResult={testRunResult}
                isRunning={isExecuting}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
