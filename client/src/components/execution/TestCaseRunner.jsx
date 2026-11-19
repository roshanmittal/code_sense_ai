import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  HardDrive,
  CheckSquare
} from 'lucide-react';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';

export const TestCaseRunner = ({
  testCases = [],
  onUpdateTestCases = () => {},
  onRunTestCases = () => {},
  testRunResult = null,
  isRunning = false,
}) => {
  const [activeCaseTab, setActiveCaseTab] = useState(0);

  const addTestCase = () => {
    const updated = [...testCases, { input: '', expectedOutput: '' }];
    onUpdateTestCases(updated);
    setActiveCaseTab(updated.length - 1);
  };

  const removeTestCase = (index, e) => {
    e.stopPropagation();
    if (testCases.length <= 1) return;
    const updated = testCases.filter((_, idx) => idx !== index);
    onUpdateTestCases(updated);
    if (activeCaseTab >= updated.length) {
      setActiveCaseTab(updated.length - 1);
    }
  };

  const updateTestCase = (field, value) => {
    const updated = [...testCases];
    if (updated[activeCaseTab]) {
      updated[activeCaseTab] = {
        ...updated[activeCaseTab],
        [field]: value,
      };
      onUpdateTestCases(updated);
    }
  };

  const currentResult = testRunResult?.testCaseResults?.[activeCaseTab];

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-md flex flex-col">
      {/* Test Case Header & Controls */}
      <div className="flex flex-wrap items-center justify-between p-3.5 bg-[#21262d] border-b border-[#30363d] gap-2">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-sky-400" />
          <span className="font-semibold text-xs sm:text-sm text-gray-200">Test Case Suite</span>
          {testRunResult && (
            <Badge
              variant={testRunResult.status === 'Accepted' ? 'success' : 'danger'}
              size="sm"
            >
              {testRunResult.passedCount}/{testRunResult.totalTestCases} Passed
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={addTestCase}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Add Case
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onRunTestCases}
            isLoading={isRunning}
            leftIcon={<Play className="w-3.5 h-3.5 text-emerald-300 fill-emerald-300" />}
          >
            Run All Cases
          </Button>
        </div>
      </div>

      {/* Test Case Tabs */}
      <div className="flex items-center gap-1 px-3 pt-2 bg-[#161b22] border-b border-[#30363d] overflow-x-auto">
        {testCases.map((tc, idx) => {
          const res = testRunResult?.testCaseResults?.[idx];
          return (
            <button
              key={idx}
              onClick={() => setActiveCaseTab(idx)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-t-lg transition-colors border-t border-x ${
                activeCaseTab === idx
                  ? 'bg-[#0d1117] text-white border-[#30363d] border-b-transparent font-semibold'
                  : 'bg-transparent text-gray-400 hover:text-gray-200 border-transparent'
              }`}
            >
              {res ? (
                res.passed ? (
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                ) : (
                  <XCircle className="w-3 h-3 text-rose-400" />
                )
              ) : null}
              <span>Case {idx + 1}</span>
              {testCases.length > 1 && (
                <span
                  onClick={(e) => removeTestCase(idx, e)}
                  className="hover:text-rose-400 p-0.5 rounded text-gray-500 ml-1"
                  title="Remove test case"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Test Case Editor & Results */}
      <div className="p-4 flex flex-col gap-3 font-mono text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Input field */}
          <div>
            <label className="text-gray-400 font-semibold mb-1 block">Input (stdin):</label>
            <textarea
              value={testCases[activeCaseTab]?.input || ''}
              onChange={(e) => updateTestCase('input', e.target.value)}
              placeholder="e.g. 5 or [2, 7, 11, 15] 9"
              rows={3}
              className="w-full bg-[#0d1117] text-gray-200 p-2.5 rounded-lg border border-[#30363d] focus:outline-none focus:border-indigo-500 resize-y"
            />
          </div>

          {/* Expected Output field */}
          <div>
            <label className="text-gray-400 font-semibold mb-1 block">Expected Output:</label>
            <textarea
              value={testCases[activeCaseTab]?.expectedOutput || ''}
              onChange={(e) => updateTestCase('expectedOutput', e.target.value)}
              placeholder="e.g. Result: [0, 1]"
              rows={3}
              className="w-full bg-[#0d1117] text-gray-200 p-2.5 rounded-lg border border-[#30363d] focus:outline-none focus:border-indigo-500 resize-y"
            />
          </div>
        </div>

        {/* Evaluation Output for this test case */}
        {currentResult && (
          <div className="mt-2 p-3 rounded-lg border bg-[#0d1117] flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {currentResult.passed ? (
                  <Badge variant="success" size="sm">Passed</Badge>
                ) : (
                  <Badge variant="danger" size="sm">Failed: {currentResult.error || 'Output Mismatch'}</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-[11px]">
                <Clock className="w-3 h-3" />
                <span>{currentResult.executionTimeMs} ms</span>
              </div>
            </div>

            <div>
              <div className="text-gray-400 text-[11px] mb-1">Actual Output:</div>
              <pre className={`p-2 rounded border text-xs whitespace-pre-wrap ${
                currentResult.passed
                  ? 'bg-emerald-950/20 text-emerald-300 border-emerald-900/30'
                  : 'bg-rose-950/20 text-rose-300 border-rose-900/30'
              }`}>
                {currentResult.actualOutput ? currentResult.actualOutput.trim() : '(No output returned)'}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
