import React, { useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Check, RotateCcw, Code, Maximize2, Minimize2 } from 'lucide-react';
import { LANGUAGE_CONFIGS } from '../../utils/languageTemplates';

export const MonacoCodeEditor = ({
  language = 'python',
  code = '',
  onChange = () => {},
  readOnly = false,
  height = '520px',
  onReset = null,
  showActions = true,
}) => {
  const [copied, setCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const editorRef = useRef(null);

  const monacoLanguage = LANGUAGE_CONFIGS[language]?.monacoLanguage || language;

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Custom dark styling enhancements
    monaco.editor.defineTheme('codesense-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6e7681', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff7b72', fontStyle: 'bold' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'number', foreground: '79c0ff' },
        { token: 'type', foreground: 'ffa657' },
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#e6edf3',
        'editor.lineHighlightBackground': '#161b22',
        'editorLineNumber.foreground': '#484f58',
        'editorLineNumber.activeForeground': '#c9d1d9',
        'editorCursor.foreground': '#58a6ff',
        'editor.selectionBackground': '#264f78',
      },
    });

    monaco.editor.setTheme('codesense-dark');
  };

  const copyToClipboard = async () => {
    if (!code) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  return (
    <div
      className={`flex flex-col bg-[#0d1117] rounded-xl border border-[#30363d] overflow-hidden shadow-xl transition-all ${
        isFullScreen ? 'fixed inset-4 z-50 shadow-2xl' : ''
      }`}
    >
      {/* Editor top header */}
      {showActions && (
        <div className="flex items-center justify-between px-3.5 py-2 bg-[#161b22] border-b border-[#30363d] text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#21262d] text-gray-300 font-mono text-[11px]">
              <Code className="w-3.5 h-3.5 text-indigo-400" />
              <span>{LANGUAGE_CONFIGS[language]?.name || language}</span>
            </div>
            <span className="text-gray-500 font-mono text-[11px]">
              {code ? `${code.split('\n').length} lines` : '0 lines'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleFormat}
              className="px-2 py-1 rounded text-gray-400 hover:text-gray-200 hover:bg-[#21262d] transition-colors"
              title="Auto-format code"
            >
              Format
            </button>

            {onReset && (
              <button
                onClick={onReset}
                className="p-1 rounded text-gray-400 hover:text-amber-400 hover:bg-[#21262d] transition-colors"
                title="Reset to boilerplate"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={copyToClipboard}
              className="p-1 rounded text-gray-400 hover:text-gray-200 hover:bg-[#21262d] transition-colors"
              title="Copy code"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="p-1 rounded text-gray-400 hover:text-gray-200 hover:bg-[#21262d] transition-colors"
              title={isFullScreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullScreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* Monaco Container */}
      <div className="relative flex-1">
        <Editor
          height={isFullScreen ? 'calc(100vh - 100px)' : height}
          language={monacoLanguage}
          value={code}
          onChange={(val) => onChange(val || '')}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            readOnly,
            fontSize: 14,
            fontFamily: "'Fira Code', 'JetBrains Mono', Consolas, monospace",
            fontLigatures: true,
            tabSize: 4,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            automaticLayout: true,
            lineNumbers: 'on',
            renderWhitespace: 'selection',
            bracketPairColorization: { enabled: true },
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>
    </div>
  );
};
