import React from 'react';
import { Terminal, X } from 'lucide-react';

export const CustomInputPanel = ({ value, onChange, onClose }) => {
  return (
    <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-3.5 shadow-lg flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs text-gray-300 font-medium">
        <div className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span>Standard Input (Stdin)</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded text-gray-400 hover:text-gray-200 hover:bg-[#21262d]"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter custom input / arguments to pass via stdin during execution..."
        rows={3}
        className="w-full bg-[#0d1117] text-gray-200 font-mono text-xs p-2.5 rounded-lg border border-[#30363d] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-y"
      />
    </div>
  );
};
