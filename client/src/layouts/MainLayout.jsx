import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { AssistantDrawer } from '../components/chat/AssistantDrawer';
import { useCodeEditor } from '../context/CodeEditorContext';

export const MainLayout = () => {
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const { code, language } = useCodeEditor();

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-100 flex flex-col selection:bg-indigo-500/30 selection:text-indigo-200">
      <Navbar onOpenAssistant={() => setIsAssistantOpen(true)} />
      
      <main className="flex-1 flex flex-col max-w-7xl w-full mx-auto p-4 md:p-6">
        <Outlet />
      </main>

      <footer className="border-t border-[#30363d] py-4 px-6 text-center text-xs text-gray-500 bg-[#0d1117]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CodeSense AI © 2026 – Advanced Multi-Language Code Analysis & Algorithmic Optimization</span>
          <span className="font-mono text-[11px] text-gray-400">C++ • Python • Java • JavaScript</span>
        </div>
      </footer>

      {/* AI Assistant Drawer */}
      <AssistantDrawer
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        codeContext={code}
        language={language}
      />
    </div>
  );
};
