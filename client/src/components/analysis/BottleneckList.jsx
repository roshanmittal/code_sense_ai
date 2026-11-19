import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Lightbulb, ShieldAlert } from 'lucide-react';
import { Badge } from '../common/Badge';

export const BottleneckList = ({ codeQuality = {} }) => {
  const {
    score = 80,
    bottlenecks = [],
    redundantOperations = [],
    logicalIssues = [],
    suggestions = [],
  } = codeQuality;

  let scoreColor = 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20';
  if (score < 60) {
    scoreColor = 'text-rose-400 border-rose-500/40 bg-rose-950/20';
  } else if (score < 80) {
    scoreColor = 'text-amber-400 border-amber-500/40 bg-amber-950/20';
  }

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 shadow-sm flex flex-col gap-4">
      {/* Header and Quality Score */}
      <div className="flex items-center justify-between pb-3 border-b border-[#30363d]">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-gray-200">Code Quality & Optimization Insights</h3>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-semibold ${scoreColor}`}>
          <span>Quality Score:</span>
          <span>{score}/100</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Bottlenecks and Redundant Ops */}
        <div className="flex flex-col gap-3">
          <div className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Performance Bottlenecks</span>
          </div>
          {bottlenecks.length === 0 ? (
            <div className="text-xs text-gray-400 italic bg-[#0d1117] p-2.5 rounded-lg border border-[#21262d]">
              No severe algorithmic bottlenecks detected.
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {bottlenecks.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-amber-200/90 bg-amber-950/20 border border-amber-800/40 p-2.5 rounded-lg">
                  <span className="text-amber-400 font-bold">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {redundantOperations.length > 0 && (
            <div className="flex flex-col gap-1.5 mt-2">
              <div className="text-xs font-semibold text-gray-300">Redundant Operations:</div>
              {redundantOperations.map((item, idx) => (
                <div key={idx} className="text-xs text-gray-300 bg-[#0d1117] border border-[#21262d] p-2 rounded-lg">
                  {item}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Suggestions & Logical Issues */}
        <div className="flex flex-col gap-3">
          <div className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-indigo-400" />
            <span>Optimization Suggestions</span>
          </div>

          {suggestions.length === 0 ? (
            <div className="text-xs text-gray-400 italic bg-[#0d1117] p-2.5 rounded-lg border border-[#21262d]">
              Code follows efficient algorithmic conventions.
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              {suggestions.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-indigo-200/90 bg-indigo-950/20 border border-indigo-800/40 p-2.5 rounded-lg">
                  <CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          )}

          {logicalIssues.length > 0 && (
            <div className="mt-2 p-2.5 rounded-lg bg-rose-950/20 border border-rose-800/40 text-xs text-rose-200 flex flex-col gap-1">
              <div className="font-semibold text-rose-300 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                <span>Potential Boundary / Logical Edge Cases:</span>
              </div>
              <ul className="list-disc list-inside space-y-0.5 text-rose-200/90">
                {logicalIssues.map((issue, idx) => (
                  <li key={idx}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
