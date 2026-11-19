import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  RefreshCw, 
  Code2, 
  AlertCircle,
  HelpCircle,
  FileQuestion
} from 'lucide-react';
import { assistantService } from '../../services/assistantService';
import { Button } from '../common/Button';

export const AssistantDrawer = ({
  isOpen = false,
  onClose = () => {},
  codeContext = '',
  language = 'python',
}) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello! I'm your **CodeSense AI Coding Assistant & Mentor**. I have context on your active ${language} code. Ask me to break down time complexity, explain logic line by line, or suggest edge cases!`,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (customText = null) => {
    const text = customText || inputMessage;
    if (!text || text.trim().length === 0 || isLoading) return;

    const userMsg = {
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsLoading(true);

    try {
      const data = await assistantService.sendMessage({
        conversationId,
        message: text,
        language,
        codeContext,
      });

      if (data.success) {
        if (data.conversationId) setConversationId(data.conversationId);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.reply,
            timestamp: new Date(),
          },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error communicating with the AI service. Please verify your backend server or try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    handleSend(prompt);
  };

  const handleNewChat = () => {
    setConversationId(null);
    setMessages([
      {
        role: 'assistant',
        content: `New session started. I'm ready to assist with your active ${language} code!`,
        timestamp: new Date(),
      },
    ]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#161b22] border-l border-[#30363d] shadow-2xl flex flex-col">
      {/* Drawer Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#0d1117] border-b border-[#30363d]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-100 flex items-center gap-1.5">
              <span>CodeSense Assistant</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                {language}
              </span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={handleNewChat}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-[#21262d] transition-colors"
            title="Start new conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-[#21262d] transition-colors"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Suggested Quick Action Prompts */}
      <div className="px-3 py-2 bg-[#161b22] border-b border-[#30363d] flex items-center gap-1.5 overflow-x-auto text-[11px] whitespace-nowrap">
        <button
          onClick={() => handleQuickPrompt('Explain this code line by line and its algorithmic mechanism.')}
          className="px-2 py-1 rounded bg-[#21262d] hover:bg-indigo-950/60 hover:text-indigo-300 border border-[#30363d] text-gray-300 transition-colors"
        >
          Explain line-by-line
        </button>
        <button
          onClick={() => handleQuickPrompt('Why is the time complexity what it is, and can we optimize it further?')}
          className="px-2 py-1 rounded bg-[#21262d] hover:bg-indigo-950/60 hover:text-indigo-300 border border-[#30363d] text-gray-300 transition-colors"
        >
          Why this complexity?
        </button>
        <button
          onClick={() => handleQuickPrompt('Suggest boundary edge cases and test inputs that could break this code.')}
          className="px-2 py-1 rounded bg-[#21262d] hover:bg-indigo-950/60 hover:text-indigo-300 border border-[#30363d] text-gray-300 transition-colors"
        >
          Suggest edge cases
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              msg.role === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[88%] p-3 rounded-xl leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
                  : 'bg-[#21262d] text-gray-200 rounded-bl-none border border-[#30363d]'
              }`}
            >
              <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
            </div>
            <span className="text-[10px] text-gray-500 mt-1 px-1">
              {msg.role === 'user' ? 'You' : 'CodeSense AI'}
            </span>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-[#21262d] rounded-xl text-gray-400 text-xs border border-[#30363d] w-fit">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
            <span>Analyzing code context and formulating response...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input box */}
      <div className="p-3 bg-[#0d1117] border-t border-[#30363d]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask about this ${language} code...`}
            className="flex-1 bg-[#161b22] text-gray-100 text-xs px-3.5 py-2.5 rounded-lg border border-[#30363d] focus:outline-none focus:border-indigo-500"
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};
