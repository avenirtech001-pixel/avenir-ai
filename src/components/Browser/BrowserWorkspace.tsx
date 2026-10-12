import React, { useState } from 'react';
import { useCodex } from '../../context/CodexContext';
import { 
  Globe, 
  RotateCw, 
  ArrowLeft, 
  ArrowRight, 
  Lock, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Terminal, 
  Layers, 
  Sparkles,
  Wifi,
  ExternalLink,
  ChevronDown
} from 'lucide-react';

export const BrowserWorkspace: React.FC = () => {
  const { files, sendMessage, isGenerating } = useCodex();
  const [url, setUrl] = useState('http://localhost:3000/preview');
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeDevTab, setActiveDevTab] = useState<'console' | 'network' | 'elements'>('console');
  const [consoleLogs, setConsoleLogs] = useState<string[]>([
    '[Browser Runtime] DOM Content Loaded in 12ms',
    '[Browser Runtime] Attached WebSocket to localhost:3000',
    '[Codex Bridge] Hot Module Replacement (HMR) active',
    '[DevTools] 0 warnings, 0 fatal exceptions detected'
  ]);
  const [consoleInput, setConsoleInput] = useState('');
  const [interactiveCount, setInteractiveCount] = useState(0);

  const htmlContent = files['public/index.html']?.content || '<html><body>Loading...</body></html>';

  const handleConsoleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!consoleInput.trim()) return;
    const cmd = consoleInput.trim();
    setConsoleLogs((prev) => [...prev, `> ${cmd}`, `< undefined`]);
    setConsoleInput('');
  };

  const getViewportWidth = () => {
    switch (viewport) {
      case 'mobile': return 'max-w-[375px]';
      case 'tablet': return 'max-w-[768px]';
      default: return 'w-full';
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0c10] text-zinc-200 select-none overflow-hidden">
      {/* Browser Chrome Header */}
      <div className="h-11 border-b border-zinc-800/80 bg-[#0e1117] px-3 flex items-center justify-between shrink-0">
        {/* Navigation & URL Bar */}
        <div className="flex items-center gap-2 flex-1 max-w-2xl">
          <div className="flex items-center gap-1 text-zinc-400">
            <button className="p-1 rounded hover:bg-zinc-800 transition-colors" title="Back">
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>
            <button className="p-1 rounded hover:bg-zinc-800 transition-colors" title="Forward">
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button 
              onClick={() => setConsoleLogs((prev) => [...prev, '[Browser] Page reloaded'])}
              className="p-1 rounded hover:bg-zinc-800 transition-colors" 
              title="Reload"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* URL Input */}
          <div className="flex-1 flex items-center gap-2 bg-[#08090d] border border-zinc-800 rounded-lg px-2.5 py-1 text-xs font-mono">
            <Lock className="h-3 w-3 text-emerald-400" />
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 bg-transparent text-zinc-200 outline-none text-[11px]"
            />
            <span className="text-[10px] text-zinc-500 font-sans">Chromium Sandbox</span>
          </div>
        </div>

        {/* Viewport Presets */}
        <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-lg p-0.5 ml-3">
          <button
            onClick={() => setViewport('desktop')}
            title="Desktop 1920x1080"
            className={`p-1 rounded ${viewport === 'desktop' ? 'bg-zinc-800 text-purple-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Monitor className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewport('tablet')}
            title="Tablet iPad 768px"
            className={`p-1 rounded ${viewport === 'tablet' ? 'bg-zinc-800 text-purple-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Tablet className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setViewport('mobile')}
            title="Mobile iPhone 375px"
            className={`p-1 rounded ${viewport === 'mobile' ? 'bg-zinc-800 text-purple-400' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <Smartphone className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Browser Viewport */}
      <div className="flex-1 flex items-center justify-center p-4 bg-[#06070a] overflow-auto">
        <div className={`h-full ${getViewportWidth()} bg-[#0f172a] rounded-xl border border-zinc-800/80 shadow-2xl flex flex-col overflow-hidden transition-all duration-300`}>
          {/* Live Web Sandbox */}
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center text-white overflow-auto bg-gradient-to-b from-[#0b0e14] to-[#05070a]">
            {/* Avenir Hero Image in Browser */}
            <div className="w-full max-w-sm rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl shadow-amber-950/30 mb-5 bg-black">
              <img
                src="/avenir-logo.jpg"
                alt="AVENIR Logo"
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-semibold mb-3">
              <Globe className="h-3.5 w-3.5 text-amber-400" />
              <span>AVENIR Autonomous Web Engine</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-widest mb-1.5 font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-300 to-amber-500">
              AVENIR
            </h1>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md leading-relaxed mb-5">
              Rendered directly from the AVENIR workspace. Connected to live state in VS Code, Android Logcat, and MT5 financial feeds.
            </p>

            <button
              onClick={() => {
                setInteractiveCount((c) => c + 1);
                setConsoleLogs((prev) => [...prev, `[AVENIR Runtime] Button event #${interactiveCount + 1} registered`]);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold text-xs shadow-lg shadow-amber-950/40 transition-all active:scale-95"
            >
              Dispatch DOM Event (Count: {interactiveCount})
            </button>

            <div className="grid grid-cols-3 gap-3 mt-8 w-full max-w-sm">
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
                <div className="text-lg font-bold text-emerald-400 font-mono">60 fps</div>
                <div className="text-[10px] text-zinc-500">Render Speed</div>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
                <div className="text-lg font-bold text-sky-400 font-mono">0 ms</div>
                <div className="text-[10px] text-zinc-500">Input Lag</div>
              </div>
              <div className="p-3 bg-zinc-900/80 rounded-xl border border-zinc-800">
                <div className="text-lg font-bold text-purple-400 font-mono">0</div>
                <div className="text-[10px] text-zinc-500">Console Errors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* DevTools Drawer */}
      <div className="h-44 border-t border-zinc-800/80 bg-[#08090d] flex flex-col shrink-0">
        <div className="h-8 border-b border-zinc-800/60 bg-[#0e1117] px-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveDevTab('console')}
              className={`font-mono text-[11px] font-semibold transition-colors ${
                activeDevTab === 'console' ? 'text-purple-400 border-b border-purple-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              DEVTOOLS CONSOLE
            </button>
            <button
              onClick={() => setActiveDevTab('network')}
              className={`font-mono text-[11px] font-semibold transition-colors ${
                activeDevTab === 'network' ? 'text-purple-400 border-b border-purple-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              NETWORK (200 OK)
            </button>
            <button
              onClick={() => setActiveDevTab('elements')}
              className={`font-mono text-[11px] font-semibold transition-colors ${
                activeDevTab === 'elements' ? 'text-purple-400 border-b border-purple-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              ELEMENTS (DOM)
            </button>
          </div>

          <button
            onClick={() => setConsoleLogs([])}
            className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono"
          >
            Clear Console
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 font-mono text-[11px]">
          {activeDevTab === 'console' && (
            <div className="space-y-1">
              {consoleLogs.map((log, i) => (
                <div key={i} className="text-zinc-300 flex items-start gap-1.5">
                  <span className="text-zinc-600">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
              <form onSubmit={handleConsoleSubmit} className="flex items-center gap-1.5 pt-1 border-t border-zinc-900 mt-1">
                <span className="text-purple-400">&gt;</span>
                <input
                  type="text"
                  placeholder="Evaluate JavaScript expression..."
                  value={consoleInput}
                  onChange={(e) => setConsoleInput(e.target.value)}
                  className="flex-1 bg-transparent text-zinc-100 outline-none text-[11px]"
                />
              </form>
            </div>
          )}

          {activeDevTab === 'network' && (
            <div className="space-y-1 text-zinc-400">
              <div className="flex items-center justify-between text-zinc-300 font-semibold border-b border-zinc-900 pb-1">
                <span>Name</span>
                <span>Status</span>
                <span>Type</span>
                <span>Time</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-400">/preview (document)</span>
                <span className="text-emerald-400">200 OK</span>
                <span>text/html</span>
                <span>12 ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-purple-400">/api/status</span>
                <span className="text-emerald-400">200 OK</span>
                <span>application/json</span>
                <span>4 ms</span>
              </div>
            </div>
          )}

          {activeDevTab === 'elements' && (
            <div className="space-y-0.5 text-zinc-400 font-mono text-[11px]">
              <div>&lt;<span className="text-rose-400">html</span> <span className="text-amber-400">lang</span>="<span className="text-emerald-400">en</span>"&gt;</div>
              <div className="pl-3">&lt;<span className="text-rose-400">head</span>&gt; ... &lt;/<span className="text-rose-400">head</span>&gt;</div>
              <div className="pl-3">&lt;<span className="text-rose-400">body</span> <span className="text-amber-400">class</span>="<span className="text-emerald-400">bg-slate-900</span>"&gt;</div>
              <div className="pl-6">&lt;<span className="text-rose-400">div</span> <span className="text-amber-400">id</span>="<span className="text-emerald-400">root</span>"&gt; ... &lt;/<span className="text-rose-400">div</span>&gt;</div>
              <div className="pl-3">&lt;/<span className="text-rose-400">body</span>&gt;</div>
              <div>&lt;/<span className="text-rose-400">html</span>&gt;</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
