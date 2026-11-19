import React from 'react';
import { 
  Play, 
  Sparkles, 
  Zap, 
  Terminal, 
  CheckSquare, 
  FileText,
  ChevronDown
} from 'lucide-react';
import { Button } from '../common/Button';
import { LANGUAGE_CONFIGS } from '../../utils/languageTemplates';

export const EditorControls = ({
  language,
  onLanguageChange,
  onAnalyze,
  onOptimize,
  onExecute,
  onRunTestCases,
  isAnalyzing = false,
  isOptimizing = false,
  isExecuting = false,
  showCustomInput = false,
  onToggleCustomInput = () => {},
  hasTestCases = false,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#161b22] border border-[#30363d] rounded-xl shadow-md">
      {/* Left side: Language Selector */}
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-400 font-medium hidden sm:inline">Language:</label>
        <div className="relative">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="appearance-none bg-[#21262d] text-gray-100 text-xs sm:text-sm font-medium py-1.5 pl-3 pr-8 rounded-lg border border-[#30363d] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 cursor-pointer shadow-sm hover:border-gray-500 transition-colors"
          >
            {Object.values(LANGUAGE_CONFIGS).map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Custom Input Toggle Button */}
        <button
          onClick={onToggleCustomInput}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
            showCustomInput
              ? 'bg-indigo-600/20 border-indigo-500/40 text-indigo-300'
              : 'bg-[#21262d] border-[#30363d] text-gray-400 hover:text-gray-200'
          }`}
          title="Toggle custom stdin input"
        >
          <Terminal className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Stdin</span>
        </button>
      </div>

      {/* Right side: Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Run Code */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onExecute}
          isLoading={isExecuting}
          leftIcon={<Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />}
          title="Execute code with standard/custom input"
        >
          Run
        </Button>

        {/* Run Test Cases */}
        <Button
          variant="secondary"
          size="sm"
          onClick={onRunTestCases}
          isLoading={isExecuting}
          leftIcon={<CheckSquare className="w-3.5 h-3.5 text-sky-400" />}
          title="Validate against test cases"
        >
          Test Cases
        </Button>

        {/* Analyze Complexity */}
        <Button
          variant="primary"
          size="sm"
          onClick={onAnalyze}
          isLoading={isAnalyzing}
          leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-200" />}
          className="bg-indigo-600 hover:bg-indigo-500"
          title="Perform hybrid AST and AI complexity analysis"
        >
          Analyze
        </Button>

        {/* Optimize with AI */}
        <Button
          variant="accent"
          size="sm"
          onClick={onOptimize}
          isLoading={isOptimizing}
          leftIcon={<Zap className="w-3.5 h-3.5 text-amber-200 fill-amber-200" />}
          title="Generate AI-optimized solution with dual complexity comparison"
        >
          Optimize
        </Button>
      </div>
    </div>
  );
};
