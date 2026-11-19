import React from 'react';
import { useNavigate } from 'react-router-dom';
import { GitCompare, Code2, Sparkles, Scale, ArrowLeft, BarChart3 } from 'lucide-react';
import { useCodeEditor } from '../context/CodeEditorContext';
import { SideBySideDiff } from '../components/optimization/SideBySideDiff';
import { ComplexityComparison } from '../components/optimization/ComplexityComparison';
import { Button } from '../components/common/Button';

export const ComparisonPage = () => {
  const navigate = useNavigate();
  const { language, code, optimizationResult } = useCodeEditor();

  const originalSource = optimizationResult?.originalCode || code;
  const optimizedSource = optimizationResult?.optimizedCode || code;

  return (
    <div className="flex flex-col gap-6 flex-1">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#30363d]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/workspace')}
            className="p-2 rounded-lg bg-[#161b22] hover:bg-[#21262d] text-gray-400 hover:text-white border border-[#30363d] transition-colors"
            title="Back to Workspace"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-100 flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-indigo-400" />
              <span>Original vs AI-Optimized Solution Comparison</span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Side-by-side code diff, algorithmic paradigm evaluation, and asymptotic trade-offs.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/benchmarks')}
            leftIcon={<BarChart3 className="w-3.5 h-3.5 text-sky-400" />}
          >
            Run Benchmarks
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/workspace')}
            leftIcon={<Code2 className="w-3.5 h-3.5" />}
          >
            Editor Workspace
          </Button>
        </div>
      </div>

      {/* Side-by-Side Monaco Diff Editor */}
      <SideBySideDiff
        language={language}
        originalCode={originalSource}
        optimizedCode={optimizedSource}
        height="480px"
      />

      {/* Dual Complexity & Trade-Offs Detailed Breakdown */}
      {optimizationResult ? (
        <ComplexityComparison optimization={optimizationResult} />
      ) : (
        <div className="p-6 bg-[#161b22] border border-[#30363d] rounded-xl text-center text-gray-400 flex flex-col items-center justify-center">
          <Scale className="w-8 h-8 text-amber-400 mb-2" />
          <p className="text-sm font-medium text-gray-200">No active optimization record loaded</p>
          <p className="text-xs text-gray-500 mt-1 max-w-md">
            Return to the Workspace and click "Optimize" on your code to generate a full dual-complexity comparison.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/workspace')}
            className="mt-4"
          >
            Go to Workspace
          </Button>
        </div>
      )}
    </div>
  );
};
