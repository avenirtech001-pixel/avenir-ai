import React, { useState, useRef, useEffect } from 'react';
import { useCodex } from '../../context/CodexContext';
import { 
  Send, 
  Sparkles, 
  ChevronDown, 
  ChevronRight, 
  Code2, 
  Smartphone, 
  TrendingUp, 
  Globe, 
  FlaskConical, 
  FileCode, 
  Check, 
  ArrowRight,
  Cpu,
  Layers,
  Wand2
} from 'lucide-react';

export const AgentPanel: React.FC = () => {
  const { 
    messages, 
    sendMessage, 
    isGenerating, 
    setActiveTab, 
    setActiveFilePath,
    activeToolFocus,
    setActiveToolFocus,
    selectedModel
  } = useCodex();

  const [input, setInput] = useState('');
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({
    welcome: false,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  const toggleThought = (id: string) => {
    setExpandedThoughts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleSuggestion = (prompt: string, toolFocus?: string) => {
    if (toolFocus) setActiveToolFocus(toolFocus);
    sendMessage(prompt);
  };

  const getEnvIcon = (env: string) => {
    switch (env) {
      case 'vscode': return <Code2 className="h-3.5 w-3.5 text-blue-400" />;
      case 'android': return <Smartphone className="h-3.5 w-3.5 text-emerald-400" />;
      case 'mt5': return <TrendingUp className="h-3.5 w-3.5 text-amber-400" />;
      case 'browser': return <Globe className="h-3.5 w-3.5 text-purple-400" />;
      case 'test': return <FlaskConical className="h-3.5 w-3.5 text-rose-400" />;
      default: return <Sparkles className="h-3.5 w-3.5 text-indigo-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0d0f14] border-r border-zinc-800/80 overflow-hidden">
      {/* Panel Header */}
      <div className="h-11 px-4 border-b border-zinc-800/80 flex items-center justify-between bg-[#101319] shrink-0">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded overflow-hidden border border-amber-500/30 shrink-0 bg-black">
            <img src="/avenir-icon.jpg" alt="" className="h-full w-full object-cover" />
          </div>
          <span className="font-bold text-xs text-amber-200 tracking-wider font-serif">
            AVENIR Agent Feed
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-mono border border-amber-500/20">
            {selectedModel}
          </span>
        </div>

        {/* Environment Filter */}
        <div className="flex items-center gap-1 text-[11px]">
          <span className="text-zinc-500 mr-1 hidden sm:inline">Focus:</span>
          {['all', 'mt5', 'android', 'vscode', 'browser'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveToolFocus(f)}
              className={`px-2 py-0.5 rounded text-[11px] font-medium uppercase transition-colors ${
                activeToolFocus === f
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-sm">
        {/* Brand Banner Card */}
        <div className="rounded-2xl overflow-hidden border border-amber-500/20 bg-gradient-to-b from-[#141822] to-[#0c0e14] shadow-xl">
          <div className="relative h-28 sm:h-32 w-full bg-black overflow-hidden flex items-center justify-center">
            <img
              src="/avenir-logo.jpg"
              alt="AVENIR Emblem"
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141822] via-transparent to-black/40" />
            <div className="absolute bottom-2 left-3 flex items-center gap-2">
              <span className="text-xs font-serif font-bold text-amber-200 tracking-widest drop-shadow-md">
                AVENIR AI
              </span>
              <span className="text-[9px] uppercase tracking-wider bg-black/70 text-amber-400 px-2 py-0.5 rounded border border-amber-500/30 backdrop-blur-sm">
                Powered by Gemini
              </span>
            </div>
          </div>
        </div>

        {messages.map((msg) => {
          const isAssistant = msg.role === 'assistant';
          const isThoughtOpen = expandedThoughts[msg.id];

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'} animate-in fade-in duration-200`}
            >
              <div
                className={`max-w-[94%] rounded-2xl p-4 transition-all ${
                  isAssistant
                    ? 'bg-[#141822] border border-zinc-800/80 text-zinc-100 shadow-lg shadow-black/20'
                    : 'bg-amber-600 text-white shadow-md shadow-amber-950/40 ml-8'
                }`}
              >
                {/* Assistant Label */}
                {isAssistant && (
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-800/60 text-xs">
                    <div className="flex items-center gap-2 text-zinc-400">
                      <div className="h-5 w-5 rounded overflow-hidden border border-amber-500/30 flex items-center justify-center shrink-0 bg-black">
                        <img src="/avenir-icon.jpg" alt="" className="h-full w-full object-cover" />
                      </div>
                      <span className="font-semibold text-amber-200 font-serif">AVENIR AI Engine</span>
                    </div>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )}

                {/* Collapsible Thinking Block */}
                {isAssistant && msg.thought && (
                  <div className="mb-3 rounded-xl border border-indigo-500/20 bg-indigo-950/20 overflow-hidden">
                    <button
                      onClick={() => toggleThought(msg.id)}
                      className="w-full px-3 py-2 flex items-center justify-between text-xs text-indigo-300 hover:bg-indigo-900/20 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-spin-slow" />
                        <span className="font-medium">
                          Thinking Process {msg.thinkingDuration ? `(${msg.thinkingDuration}s)` : ''}
                        </span>
                      </div>
                      {isThoughtOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                    </button>

                    {isThoughtOpen && (
                      <div className="px-3 pb-3 pt-1 border-t border-indigo-500/15 text-[11px] font-mono text-zinc-300 leading-relaxed whitespace-pre-wrap bg-[#0c0e14]/60 max-h-60 overflow-y-auto">
                        {msg.thought}
                      </div>
                    )}
                  </div>
                )}

                {/* Tool Invocations Executed */}
                {isAssistant && msg.actions && msg.actions.length > 0 && (
                  <div className="mb-3 space-y-1.5">
                    <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Layers className="h-3 w-3 text-emerald-400" />
                      <span>Executed Tool Invocations</span>
                    </div>
                    {msg.actions.map((act) => (
                      <div
                        key={act.id}
                        className="px-3 py-2 rounded-lg bg-[#0d1017] border border-zinc-800 flex items-center justify-between text-xs group hover:border-zinc-700 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          {getEnvIcon(act.environment)}
                          <div className="truncate">
                            <span className="font-semibold text-zinc-200 capitalize">[{act.environment}] </span>
                            <span className="text-zinc-400">{act.summary}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setActiveTab(act.environment === 'test' ? 'tests' : (act.environment as any));
                            if (act.target && act.target.includes('.')) {
                              setActiveFilePath(act.target);
                            }
                          }}
                          className="shrink-0 flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium ml-2 px-1.5 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
                        >
                          <span>Inspect</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Modified Files Chips */}
                {isAssistant && msg.filesTouched && msg.filesTouched.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {msg.filesTouched.map((f) => (
                      <button
                        key={f}
                        onClick={() => {
                          setActiveFilePath(f);
                          if (f.includes('.mq5')) setActiveTab('mt5');
                          else if (f.includes('app/')) setActiveTab('android');
                          else setActiveTab('vscode');
                        }}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-300 hover:text-white hover:border-zinc-700 font-mono transition-colors"
                      >
                        <FileCode className="h-3 w-3 text-blue-400" />
                        <span>{f}</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Message Text Content */}
                <div className="prose prose-invert prose-sm max-w-none text-zinc-200 leading-relaxed font-sans text-xs sm:text-sm">
                  {msg.text.split('\n').map((line, idx) => {
                    if (line.startsWith('### ')) {
                      return <h3 key={idx} className="text-sm font-bold text-white mt-2 mb-1">{line.replace('### ', '')}</h3>;
                    }
                    if (line.startsWith('- ')) {
                      return (
                        <div key={idx} className="flex items-start gap-2 my-0.5 pl-1 text-zinc-300">
                          <span className="text-emerald-400 mt-1">•</span>
                          <span>{line.replace('- ', '')}</span>
                        </div>
                      );
                    }
                    if (line.trim() === '') {
                      return <div key={idx} className="h-1.5" />;
                    }
                    return <p key={idx} className="my-1">{line}</p>;
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Live Generating State */}
        {isGenerating && (
          <div className="flex items-center gap-3 p-4 bg-[#141822] border border-amber-500/30 rounded-2xl max-w-[85%] text-xs text-zinc-300 shadow-xl animate-pulse">
            <div className="h-6 w-6 rounded-lg overflow-hidden border border-amber-500/40 flex items-center justify-center shrink-0 bg-black">
              <img src="/avenir-icon.jpg" alt="" className="h-full w-full object-cover" />
            </div>
            <div>
              <div className="font-semibold text-amber-200 font-serif">AVENIR Gemini AI is reasoning & coding...</div>
              <div className="text-[11px] text-zinc-400">Synthesizing AST, orchestrating MT5, Android, and VS Code environments</div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Suggestion Chips */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 bg-[#0e1117] border-t border-zinc-800/60 overflow-x-auto flex gap-2 shrink-0">
          <button
            onClick={() => handleSuggestion('Generate an MT5 Scalper Expert Advisor with ATR trailing stops and 200 EMA trend filter', 'mt5')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs text-amber-300 font-medium whitespace-nowrap transition-colors"
          >
            <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
            <span>MT5 Gold / EUR Scalper</span>
          </button>

          <button
            onClick={() => handleSuggestion('Create an Android Jetpack Compose interactive crypto dashboard with Material 3', 'android')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs text-emerald-300 font-medium whitespace-nowrap transition-colors"
          >
            <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
            <span>Android Jetpack Compose</span>
          </button>

          <button
            onClick={() => handleSuggestion('Execute full automated test suites across all 4 environments and verify assertions', 'vscode')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-xs text-blue-300 font-medium whitespace-nowrap transition-colors"
          >
            <FlaskConical className="h-3.5 w-3.5 text-blue-400" />
            <span>Run All Test Assertions</span>
          </button>
        </div>
      )}

      {/* Input Prompt Box */}
      <form onSubmit={handleSubmit} className="p-3 bg-[#10131a] border-t border-zinc-800 shrink-0">
        <div className="relative rounded-2xl bg-[#090b0e] border border-zinc-800 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/30 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Ask AVENIR to code, test, build Android apps, backtest MT5 EAs, or inspect browser... (Enter to send)"
            rows={2}
            className="w-full bg-transparent px-3.5 pt-3 pb-2 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-600 outline-none resize-none font-sans"
          />

          <div className="px-3 pb-2.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
              <span className="font-mono">Shift+Enter for newline</span>
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isGenerating}
              className="h-8 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 transition-all disabled:opacity-40 disabled:hover:bg-emerald-600"
            >
              <span>Execute</span>
              <Send className="h-3 w-3" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
