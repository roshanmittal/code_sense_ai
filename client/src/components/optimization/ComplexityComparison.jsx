import React from 'react';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  HardDrive, 
  Sparkles, 
  Scale, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { ComplexityBadge, Badge } from '../common/Badge';

export const ComplexityComparison = ({ optimization }) => {
  if (!optimization) return null;

  const {
    originalAnalysis = {},
    optimizedAnalysis = {},
    approachExplanation = '',
    dataStructuresIntroduced = [],
    tradeOffs = {},
    isAlreadyOptimal = false,
    validationStatus = {},
  } = optimization;

  return (
    <div className="flex flex-col gap-4">
      {/* Notice if already optimal */}
      {isAlreadyOptimal && (
        <div className="p-3.5 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-start gap-3 text-emerald-200 text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-emerald-300">Asymptotically Optimal Solution: </span>
            <span>
              The submitted code already achieves the optimal asymptotic complexity for this algorithmic class. Further micro-optimizations may not yield meaningful asymptotic improvements.
            </span>
          </div>
        </div>
      )}

      {/* Side-by-Side Complexity Badges Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Solution Card */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Original Solution
            </span>
            <Badge variant="warning" size="sm">Baseline</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-gray-400" />
              <span>Time Complexity:</span>
            </span>
            <ComplexityBadge complexity={originalAnalysis.timeComplexity || 'O(n^2)'} type="time" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-gray-400" />
              <span>Space Complexity:</span>
            </span>
            <ComplexityBadge complexity={originalAnalysis.spaceComplexity || 'O(1)'} type="space" />
          </div>

          <div className="pt-2 border-t border-[#30363d]/60 text-xs text-gray-300">
            <span className="text-gray-400 font-medium">Approach: </span>
            <span>{originalAnalysis.algorithm || 'Nested loops / Brute-force scanning'}</span>
          </div>
        </div>

        {/* AI-Optimized Solution Card */}
        <div className="bg-[#161b22] border border-indigo-700/50 rounded-xl p-4 shadow-sm flex flex-col gap-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>AI-Optimized Solution</span>
            </span>
            <Badge variant="primary" size="sm">Optimized</Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>Time Complexity:</span>
            </span>
            <ComplexityBadge complexity={optimizedAnalysis.timeComplexity || 'O(n)'} type="time" />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-300 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-sky-400" />
              <span>Space Complexity:</span>
            </span>
            <ComplexityBadge complexity={optimizedAnalysis.spaceComplexity || 'O(n)'} type="space" />
          </div>

          <div className="pt-2 border-t border-[#30363d]/60 text-xs text-indigo-200">
            <span className="text-gray-400 font-medium">Approach: </span>
            <span>{optimizedAnalysis.algorithm || 'Linear scan with Hash Table'}</span>
          </div>
        </div>
      </div>

      {/* Trade-Offs Analysis Card */}
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-200 pb-2 border-b border-[#30363d]">
          <Scale className="w-4 h-4 text-amber-400" />
          <span>Algorithmic Trade-Offs & Architectural Explanation</span>
        </div>

        <div className="text-xs text-gray-300 leading-relaxed">
          {approachExplanation || 'The optimized solution reduces asymptotic latency by trading auxiliary memory space.'}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          <div className="p-2.5 rounded-lg bg-[#0d1117] border border-[#21262d] text-xs">
            <span className="text-emerald-400 font-semibold block mb-0.5">Time Gain:</span>
            <span className="text-gray-300">{tradeOffs.timeGain || 'Significant reduction in inner-loop iterations'}</span>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0d1117] border border-[#21262d] text-xs">
            <span className="text-amber-400 font-semibold block mb-0.5">Space Cost:</span>
            <span className="text-gray-300">{tradeOffs.spaceCost || 'Auxiliary memory allocated for lookup cache'}</span>
          </div>
        </div>

        {dataStructuresIntroduced && dataStructuresIntroduced.length > 0 && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400 font-medium">Data Structures Introduced:</span>
            <div className="flex flex-wrap gap-1">
              {dataStructuresIntroduced.map((ds, idx) => (
                <Badge key={idx} variant="purple" size="sm">{ds}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Validation Status Indicator */}
        {validationStatus && validationStatus.validated && (
          <div className="mt-2 p-2.5 rounded-lg bg-emerald-950/20 border border-emerald-800/40 text-xs text-emerald-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{validationStatus.notes}</span>
            </div>
            <Badge variant="success" size="sm">
              {validationStatus.testCasesPassed}/{validationStatus.testCasesRun} Passed
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};
