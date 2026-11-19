import React from 'react';
import { Clock, HardDrive, Repeat, AlertTriangle, Layers, Info } from 'lucide-react';
import { ComplexityBadge, Badge } from '../common/Badge';

export const ComplexityCard = ({ analysis }) => {
  if (!analysis) return null;

  const {
    timeComplexity = {},
    spaceComplexity = {},
    algorithm = {},
    assumptionsAndUncertainties = [],
    staticMetrics = {},
  } = analysis;

  return (
    <div className="flex flex-col gap-4">
      {/* Primary Complexity Badges Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* Time Complexity Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-200">
              <Clock className="w-4 h-4 text-indigo-400" />
              <span>Time Complexity</span>
            </div>
            <ComplexityBadge complexity={timeComplexity.worst || 'O(n)'} type="worst" />
          </div>

          <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-[#0d1117] rounded-lg border border-[#21262d] text-center mb-3">
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Best</div>
              <div className="font-mono text-xs font-semibold text-emerald-400">{timeComplexity.best || 'O(1)'}</div>
            </div>
            <div className="border-x border-[#21262d]">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Average</div>
              <div className="font-mono text-xs font-semibold text-indigo-300">{timeComplexity.average || 'O(n)'}</div>
            </div>
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Worst</div>
              <div className="font-mono text-xs font-semibold text-rose-400">{timeComplexity.worst || 'O(n)'}</div>
            </div>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            {timeComplexity.explanation || 'Analyzed via hybrid AST and algorithmic reasoning.'}
          </p>

          {/* Nested Loops Indicator */}
          {timeComplexity.nestedLoops && timeComplexity.nestedLoops.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#30363d]/60">
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium mb-1.5">
                <Repeat className="w-3.5 h-3.5" />
                <span>Loop Nesting Depth ({staticMetrics?.maxLoopDepth || timeComplexity.nestedLoops.length}):</span>
              </div>
              <div className="flex flex-col gap-1">
                {timeComplexity.nestedLoops.map((loop, idx) => (
                  <div key={idx} className="text-[11px] font-mono text-gray-400 flex items-center justify-between bg-[#0d1117] px-2 py-1 rounded">
                    <span>{loop.description || `Loop at line ${loop.line}`}</span>
                    <Badge variant="warning" size="sm">Depth {loop.depth}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recursion Indicator */}
          {timeComplexity.recursionDetected && (
            <div className="mt-2.5 p-2 rounded bg-purple-950/30 border border-purple-800/40 text-purple-200 text-xs flex items-start gap-2">
              <Layers className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Recursive Calls Detected: </span>
                <span>{timeComplexity.recursionDetails || 'Recursive branch traversal.'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Space Complexity Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-gray-200">
              <HardDrive className="w-4 h-4 text-sky-400" />
              <span>Space Complexity</span>
            </div>
            <ComplexityBadge complexity={spaceComplexity.auxiliary || 'O(1)'} type="space" />
          </div>

          <div className="grid grid-cols-2 gap-2 py-2 px-3 bg-[#0d1117] rounded-lg border border-[#21262d] text-center mb-3">
            <div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Auxiliary Memory</div>
              <div className="font-mono text-xs font-semibold text-sky-300">{spaceComplexity.auxiliary || 'O(1)'}</div>
            </div>
            <div className="border-l border-[#21262d]">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">Total Footprint</div>
              <div className="font-mono text-xs font-semibold text-indigo-300">{spaceComplexity.total || 'O(n)'}</div>
            </div>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">
            {spaceComplexity.explanation || 'Evaluated based on auxiliary data structures and call-stack frame depth.'}
          </p>

          {/* Allocated Data Structures */}
          {spaceComplexity.dataStructuresUsed && spaceComplexity.dataStructuresUsed.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#30363d]/60">
              <div className="text-[11px] text-gray-400 mb-1.5">Detected Data Structures:</div>
              <div className="flex flex-wrap gap-1.5">
                {spaceComplexity.dataStructuresUsed.map((ds, idx) => (
                  <Badge key={idx} variant="cyan" size="sm">{ds}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assumptions and Uncertainties Warning */}
      {assumptionsAndUncertainties && assumptionsAndUncertainties.length > 0 && (
        <div className="p-3 bg-[#161b22] border border-amber-800/40 rounded-xl text-xs text-amber-200/90 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-semibold text-amber-300 mb-1">Theoretical Assumptions & Confidence Notice:</div>
            <ul className="list-disc list-inside space-y-0.5 text-gray-300">
              {assumptionsAndUncertainties.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
