import React, { useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { Copy, Check, GitCompare, Code2, Sparkles } from 'lucide-react';
import { LANGUAGE_CONFIGS } from '../../utils/languageTemplates';
import { Button } from '../common/Button';

export const SideBySideDiff = ({
  language = 'python',
  originalCode = '',
  optimizedCode = '',
  height = '500px',
}) => {
  const [copiedOriginal, setCopiedOriginal] = useState(false);
  const [copiedOptimized, setCopiedOptimized] = useState(false);

  const monacoLanguage = LANGUAGE_CONFIGS[language]?.monacoLanguage || language;

  const copyOriginal = async () => {
    if (!originalCode) return;
    await navigator.clipboard.writeText(originalCode);
    setCopiedOriginal(true);
    setTimeout(() => setCopiedOriginal(false), 2000);
  };

  const copyOptimized = async () => {
    if (!optimizedCode) return;
    await navigator.clipboard.writeText(optimizedCode);
    setCopiedOptimized(true);
    setTimeout(() => setCopiedOptimized(false), 2000);
  };

  return (
    <div className="bg-[#0d1117] border border-[#30363d] rounded-xl overflow-hidden shadow-xl flex flex-col">
      {/* Side-by-Side Headers */}
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#30363d] bg-[#161b22] text-xs">
        {/* Left header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b md:border-b-0 md:border-r border-[#30363d]">
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-gray-400" />
            <span className="font-semibold text-gray-300">Original Code (Baseline)</span>
          </div>
          <button
            onClick={copyOriginal}
            className="p-1 rounded text-gray-400 hover:text-gray-200 hover:bg-[#21262d] transition-colors"
            title="Copy original code"
          >
            {copiedOriginal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Right header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-indigo-950/20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-indigo-300">AI-Optimized Solution</span>
          </div>
          <button
            onClick={copyOptimized}
            className="p-1 rounded text-gray-400 hover:text-gray-200 hover:bg-[#21262d] transition-colors"
            title="Copy optimized code"
          >
            {copiedOptimized ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Monaco Diff Editor */}
      <div className="relative">
        <DiffEditor
          height={height}
          language={monacoLanguage}
          original={originalCode}
          modified={optimizedCode}
          theme="vs-dark"
          options={{
            readOnly: true,
            renderSideBySide: true,
            fontSize: 13,
            fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            lineNumbers: 'on',
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
};
