import React, { useState } from 'react';
import { useCodex } from '../../context/CodexContext';
import { 
  Sparkles, 
  Terminal, 
  Smartphone, 
  TrendingUp, 
  Globe, 
  Play, 
  Key, 
  CheckCircle2, 
  BrainCircuit, 
  Layers,
  Cpu
} from 'lucide-react';
import { ApiKeyModal } from '../Modals/ApiKeyModal';

export const TopBar: React.FC = () => {
  const { 
    selectedModel, 
    setSelectedModel, 
    thinkingLevel, 
    setThinkingLevel,
    apiKey,
    hasEnvKey,
    runAllTests,
    activeTab,
    setActiveTab
  } = useCodex();

  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  const hasKey = Boolean(apiKey || hasEnvKey);

  return (
    <>
      <header className="h-12 border-b border-zinc-800/80 bg-[#0e1117] px-3.5 flex items-center justify-between select-none z-30">
        {/* Brand & Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg overflow-hidden border border-amber-500/30 shadow-md shadow-amber-950/40 bg-black flex items-center justify-center shrink-0">
              <img
                src="/avenir-icon.jpg"
                alt="AVENIR Emblem"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-500 font-serif">
                AVENIR
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25">
                Gemini AI
              </span>
            </div>
          </div>

          <div className="h-4 w-[1px] bg-zinc-800" />

          {/* Quick Environment Jump Pills */}
          <div className="hidden lg:flex items-center gap-1 text-xs">
            <button
              onClick={() => setActiveTab('vscode')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === 'vscode'
                  ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Terminal className="h-3.5 w-3.5 text-blue-400" />
              <span>VS Code</span>
            </button>

            <button
              onClick={() => setActiveTab('android')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === 'android'
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
              <span>Android Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('mt5')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === 'mt5'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
              <span>MT5 Terminal</span>
            </button>

            <button
              onClick={() => setActiveTab('browser')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                activeTab === 'browser'
                  ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
              }`}
            >
              <Globe className="h-3.5 w-3.5 text-purple-400" />
              <span>Browser</span>
            </button>
          </div>
        </div>

        {/* Center / Controls */}
        <div className="flex items-center gap-2">
          {/* Model Selector */}
          <div className="flex items-center bg-zinc-900/90 border border-zinc-800 rounded-lg p-0.5 text-xs">
            <Cpu className="h-3.5 w-3.5 text-zinc-400 ml-2" />
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-transparent text-zinc-200 font-medium px-2 py-1 text-xs outline-none cursor-pointer"
            >
              <option value="gemini-3.8-flash" className="bg-[#12151c] text-zinc-100">
                gemini-3.8-flash (Ultra Fast & Reasoning)
              </option>
              <option value="gemini-3.1-pro-preview" className="bg-[#12151c] text-zinc-100">
                gemini-3.1-pro-preview (Deep Architecture)
              </option>
              <option value="gemini-3.1-flash-lite" className="bg-[#12151c] text-zinc-100">
                gemini-3.1-flash-lite (Low Latency)
              </option>
            </select>
          </div>

          {/* Thinking Level Toggle */}
          <button
            onClick={() => setThinkingLevel(thinkingLevel === 'HIGH' ? 'LOW' : 'HIGH')}
            title="Toggle Reasoning Depth (Thinking Tokens)"
            className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium border transition-colors ${
              thinkingLevel === 'HIGH'
                ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300'
                : 'bg-zinc-900 border-zinc-800 text-zinc-400'
            }`}
          >
            <Sparkles className="h-3 w-3 text-indigo-400" />
            <span>Thinking: {thinkingLevel}</span>
          </button>
        </div>

        {/* Right / Actions & API Key */}
        <div className="flex items-center gap-2">
          {/* Quick Test Trigger */}
          <button
            onClick={() => {
              setActiveTab('tests');
              runAllTests();
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 border border-zinc-700/60 transition-colors"
          >
            <Play className="h-3 w-3 text-emerald-400 fill-emerald-400" />
            <span>Run Tests</span>
          </button>

          {/* API Key Modal Button */}
          <button
            onClick={() => setIsApiKeyModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-all ${
              hasKey
                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 hover:bg-emerald-900/50'
                : 'bg-amber-950/40 border-amber-800/60 text-amber-300 hover:bg-amber-900/50 animate-pulse'
            }`}
          >
            <Key className="h-3.5 w-3.5" />
            <span>{hasKey ? 'Gemini API Active' : 'Set Gemini Key'}</span>
            {hasKey && <CheckCircle2 className="h-3 w-3 text-emerald-400 ml-0.5" />}
          </button>
        </div>
      </header>

      {/* API Key Modal */}
      {isApiKeyModalOpen && <ApiKeyModal onClose={() => setIsApiKeyModalOpen(false)} />}
    </>
  );
};
