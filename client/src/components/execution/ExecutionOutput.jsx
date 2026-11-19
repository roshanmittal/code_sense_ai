import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  HardDrive, 
  Copy, 
  Check, 
  Sparkles,
  Terminal
} from 'lucide-react';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export const ExecutionOutput = ({ result, onDebugWithAi }) => {
  const [copied, setCopied] = useState(false);

  if (!result) {
    return (
      <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-8 text-center text-gray-400 flex flex-col items-center justify-center min-h-[260px]">
        <Terminal className="w-8 h-8 text-gray-500 mb-2" />
        <p className="text-sm font-medium text-gray-300">No execution output yet</p>
        <p className="text-xs text-gray-500 mt-1">
          Click <span className="text-indigo-400 font-mono">Run</span> in the toolbar to execute your code in an isolated runner.
        </p>
      </div>
    );
  }

  const {
    status = 'Success',
    stdout = '',
    stderr = '',
    compileOutput = '',
    executionTimeMs = 0,
    memoryKb = 0,
    provider = 'isolated-runner',
  } = result;

  const isSuccess = status === 'Success' || status === 'Accepted';
  const hasError = !isSuccess || Boolean(stderr) || Boolean(compileOutput);

  const copyOutput = async () => {
    const textToCopy = stdout || stderr || compileOutput;
    if (!textToCopy) return;
    await navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-md flex flex-col">
      {/* Status Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-[#21262d] border-b border-[#30363d] gap-2">
        <div className="flex items-center gap-2">
          {isSuccess ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <XCircle className="w-4 h-4 text-rose-400" />
          )}
          <span className="font-semibold text-xs sm:text-sm text-gray-200">{status}</span>
          <span className="text-[10px] text-gray-500 font-mono">({provider})</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span className="font-mono text-gray-200">{executionTimeMs} ms</span>
          </div>
          {memoryKb > 0 && (
            <div className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-gray-400" />
              <span className="font-mono text-gray-200">{(memoryKb / 1024).toFixed(1)} MB</span>
            </div>
          )}
          <button
            onClick={copyOutput}
            className="p-1 rounded text-gray-400 hover:text-gray-200 hover:bg-[#30363d] transition-colors"
            title="Copy output"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Output Console Body */}
      <div className="p-4 flex flex-col gap-3 font-mono text-xs">
        {/* Compilation Error Notice */}
        {compileOutput && (
          <div>
            <div className="text-rose-400 font-semibold mb-1 flex items-center justify-between">
              <span>Compilation Output:</span>
              {onDebugWithAi && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDebugWithAi(compileOutput)}
                  leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
                  className="text-[11px] py-1 border-rose-800/60 hover:bg-rose-950/30 text-rose-300"
                >
                  Diagnose with AI
                </Button>
              )}
            </div>
            <pre className="p-3 bg-[#0d1117] text-rose-300 rounded-lg border border-rose-900/40 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {compileOutput}
            </pre>
          </div>
        )}

        {/* Runtime Error / Stderr */}
        {stderr && (
          <div>
            <div className="text-amber-400 font-semibold mb-1 flex items-center justify-between">
              <span>Standard Error / Traceback:</span>
              {onDebugWithAi && !compileOutput && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDebugWithAi(stderr)}
                  leftIcon={<Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
                  className="text-[11px] py-1 border-amber-800/60 hover:bg-amber-950/30 text-amber-300"
                >
                  Diagnose with AI
                </Button>
              )}
            </div>
            <pre className="p-3 bg-[#0d1117] text-amber-300 rounded-lg border border-amber-900/40 overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {stderr}
            </pre>
          </div>
        )}

        {/* Standard Output */}
        <div>
          <div className="text-gray-400 font-semibold mb-1">Standard Output:</div>
          {stdout ? (
            <pre className="p-3 bg-[#0d1117] text-emerald-300 rounded-lg border border-[#21262d] overflow-x-auto whitespace-pre-wrap leading-relaxed min-h-[60px]">
              {stdout}
            </pre>
          ) : (
            <div className="p-3 bg-[#0d1117] text-gray-500 rounded-lg border border-[#21262d] italic">
              (No standard output produced)
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
