import React, { useState } from 'react';
import { useCodex } from '../../context/CodexContext';
import { 
  Smartphone, 
  Play, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Power, 
  FileCode, 
  Terminal, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  Search,
  Wifi,
  Battery,
  Layers,
  ArrowLeft,
  Circle,
  Square,
  TrendingUp,
  Bolt,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';

export const AndroidStudioWorkspace: React.FC = () => {
  const { 
    files, 
    activeFilePath, 
    setActiveFilePath, 
    logcat, 
    addLogcat, 
    clearLogcat,
    androidBuildStatus, 
    triggerAndroidBuild,
    sendMessage,
    isGenerating
  } = useCodex();

  const [activeBottomTab, setActiveBottomTab] = useState<'logcat' | 'gradle'>('logcat');
  const [logFilter, setLogFilter] = useState<'ALL' | 'I' | 'D' | 'W' | 'E'>('ALL');
  const [logSearch, setLogSearch] = useState('');
  const [isRotated, setIsRotated] = useState(false);
  const [interactiveBalance, setInteractiveBalance] = useState(24850.50);
  const [deployCount, setDeployCount] = useState(3);
  const [activeSubTab, setActiveSubTab] = useState<'dashboard' | 'trades' | 'settings'>('dashboard');

  const androidFiles = Object.keys(files).filter((k) => k.startsWith('app/'));

  const handleEmulatorClick = () => {
    setInteractiveBalance((prev) => +(prev + 125.40).toFixed(2));
    setDeployCount((prev) => prev + 1);
    addLogcat({
      time: new Date().toLocaleTimeString(),
      pid: 14208,
      tag: 'MainActivity',
      level: 'I',
      message: `User touched action button. Portfolio rebalanced: $${(interactiveBalance + 125.4).toFixed(2)}`,
    });
  };

  const filteredLogs = logcat.filter((entry) => {
    if (logFilter !== 'ALL' && entry.level !== logFilter) return false;
    if (logSearch && !entry.message.toLowerCase().includes(logSearch.toLowerCase()) && !entry.tag.toLowerCase().includes(logSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex h-full bg-[#0a0c10] text-zinc-200 select-none overflow-hidden">
      {/* Android Project Tree */}
      <div className="w-56 border-r border-zinc-800/80 bg-[#0e1117] flex flex-col shrink-0">
        <div className="h-9 px-3 border-b border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <Smartphone className="h-3.5 w-3.5 text-emerald-400" />
            <span>Android Project</span>
          </div>
        </div>

        <div className="p-2 border-b border-zinc-800/60 text-[11px] text-zinc-400 font-mono flex items-center justify-between">
          <span>Target: API 34 (Android 14)</span>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        <div className="flex-1 overflow-y-auto p-1 text-xs space-y-0.5">
          <div className="px-2 py-1 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
            Kotlin / Jetpack Compose
          </div>
          {androidFiles.map((path) => {
            const isSelected = activeFilePath === path;
            const filename = path.split('/').pop();

            return (
              <button
                key={path}
                onClick={() => setActiveFilePath(path)}
                className={`w-full flex items-center gap-1.5 px-2.5 py-1.5 rounded text-left transition-colors font-mono text-[11px] truncate ${
                  isSelected
                    ? 'bg-emerald-600/15 text-emerald-300 border border-emerald-500/20'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                }`}
              >
                <FileCode className={`h-3.5 w-3.5 shrink-0 ${isSelected ? 'text-emerald-400' : 'text-zinc-500'}`} />
                <span className="truncate">{filename}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Studio Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0c0e13]">
        {/* Top Studio Controls */}
        <div className="h-10 border-b border-zinc-800/80 bg-[#0e1117] px-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span className="font-medium text-zinc-200">Google Pixel 8 Pro</span>
              <span className="text-zinc-500 text-[10px]">#emulator-5554</span>
            </div>

            <button
              onClick={triggerAndroidBuild}
              disabled={androidBuildStatus === 'building'}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm shadow-emerald-950/40 transition-all disabled:opacity-50"
            >
              <Play className="h-3 w-3 fill-white" />
              <span>{androidBuildStatus === 'building' ? 'Building APK...' : 'Run app'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => sendMessage('Optimize Jetpack Compose performance and fix any layout recomposition delays')}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 text-xs transition-colors"
            >
              <Sparkles className="h-3 w-3 text-emerald-400" />
              <span>Codex Compose Assistant</span>
            </button>
          </div>
        </div>

        {/* Center: Device Emulator & Code Preview */}
        <div className="flex-1 flex overflow-hidden">
          {/* Interactive Phone Emulator */}
          <div className="flex-1 flex items-center justify-center p-4 bg-[#08090d] overflow-auto">
            <div
              className={`relative bg-[#000000] rounded-[44px] border-[6px] border-[#252830] shadow-2xl transition-all duration-300 ${
                isRotated ? 'w-[560px] h-[340px]' : 'w-[320px] h-[580px]'
              } flex flex-col overflow-hidden ring-1 ring-zinc-700/50`}
            >
              {/* Notch Speaker & Camera */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-zinc-900 rounded-full flex items-center justify-center z-30">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-950 border border-zinc-800" />
              </div>

              {/* Status Bar */}
              <div className="h-7 px-5 pt-1.5 flex items-center justify-between text-[11px] text-zinc-300 font-medium z-20">
                <span>17:42</span>
                <div className="flex items-center gap-1.5">
                  <Wifi className="h-3 w-3" />
                  <span className="text-[10px]">5G</span>
                  <Battery className="h-3.5 w-3.5" />
                </div>
              </div>

              {/* Android Screen Canvas */}
              <div className="flex-1 bg-[#0f172a] text-white p-4 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4">
                  {/* Top Bar */}
                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Codex Android</div>
                      <div className="text-base font-extrabold text-white">Quantum Client</div>
                    </div>
                    <button
                      onClick={handleEmulatorClick}
                      className="h-8 w-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 active:scale-90 transition-transform"
                    >
                      <Bolt className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Portfolio Card */}
                  <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/80 shadow-lg">
                    <div className="text-xs text-slate-400 font-medium">MT5 Linked Equity</div>
                    <div className="text-2xl font-bold tracking-tight text-white mt-1">
                      ${interactiveBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold mt-2">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>+18.4% Net Return</span>
                    </div>
                  </div>

                  {/* Interactive Operations */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Orchestration Tasks
                    </div>
                    <div className="space-y-2">
                      <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-400" />
                          <span className="font-medium text-slate-200">EURUSD M1 Scalper</span>
                        </div>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800">
                          Active
                        </span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-sky-400" />
                          <span className="font-medium text-slate-200">Logcat Live Sync</span>
                        </div>
                        <span className="text-[10px] text-sky-400 bg-sky-950/60 px-1.5 py-0.5 rounded border border-sky-800">
                          60 fps
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="pt-3">
                  <button
                    onClick={handleEmulatorClick}
                    className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/40 transition-all"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Touch Screen (Deploy #{deployCount})</span>
                  </button>
                </div>
              </div>

              {/* Android System Navigation Bar */}
              <div className="h-8 bg-black flex items-center justify-around px-8 text-zinc-500 z-20">
                <button onClick={() => addLogcat({ time: new Date().toLocaleTimeString(), pid: 14208, tag: 'ViewRootImpl', level: 'D', message: 'Back key dispatched' })}>
                  <ArrowLeft className="h-3.5 w-3.5 hover:text-white" />
                </button>
                <button onClick={() => addLogcat({ time: new Date().toLocaleTimeString(), pid: 14208, tag: 'ViewRootImpl', level: 'D', message: 'Home key dispatched' })}>
                  <Circle className="h-3.5 w-3.5 hover:text-white" />
                </button>
                <button onClick={() => addLogcat({ time: new Date().toLocaleTimeString(), pid: 14208, tag: 'ViewRootImpl', level: 'D', message: 'App switcher key dispatched' })}>
                  <Square className="h-3.5 w-3.5 hover:text-white" />
                </button>
              </div>
            </div>

            {/* Emulator Hardware Controls Bar */}
            <div className="ml-4 flex flex-col gap-2 p-2 bg-zinc-900/90 border border-zinc-800 rounded-2xl shadow-xl">
              <button
                onClick={() => setIsRotated(!isRotated)}
                title="Rotate Screen"
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <RotateCw className="h-4 w-4" />
              </button>
              <button
                onClick={() => addLogcat({ time: new Date().toLocaleTimeString(), pid: 14208, tag: 'AudioService', level: 'I', message: 'Volume level increased to 80%' })}
                title="Volume Up"
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <Volume2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => addLogcat({ time: new Date().toLocaleTimeString(), pid: 14208, tag: 'PowerManager', level: 'I', message: 'Screen power state toggled' })}
                title="Power Button"
                className="p-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-zinc-800 transition-colors"
              >
                <Power className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Studio Console: Logcat & Gradle */}
        <div className="h-48 border-t border-zinc-800/80 bg-[#08090d] flex flex-col shrink-0">
          <div className="h-8 border-b border-zinc-800/60 bg-[#0e1117] px-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveBottomTab('logcat')}
                className={`font-mono text-[11px] font-semibold transition-colors ${
                  activeBottomTab === 'logcat' ? 'text-emerald-400 border-b border-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                LOGCAT (Pixel 8)
              </button>
              <button
                onClick={() => setActiveBottomTab('gradle')}
                className={`font-mono text-[11px] font-semibold transition-colors ${
                  activeBottomTab === 'gradle' ? 'text-emerald-400 border-b border-emerald-400' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                GRADLE BUILD CONSOLE
              </button>
            </div>

            {activeBottomTab === 'logcat' && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-[10px]">
                  {(['ALL', 'I', 'D', 'W', 'E'] as const).map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setLogFilter(lvl)}
                      className={`px-1.5 py-0.5 rounded font-mono ${
                        logFilter === lvl ? 'bg-zinc-800 text-white font-bold' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
                <button onClick={clearLogcat} className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono">
                  Clear
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-2 font-mono text-[11px]">
            {activeBottomTab === 'logcat' ? (
              <div className="space-y-1">
                {filteredLogs.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-2 text-zinc-300 leading-tight">
                    <span className="text-zinc-600 shrink-0">{entry.time}</span>
                    <span className={`px-1 rounded text-[10px] font-bold shrink-0 ${
                      entry.level === 'E' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      entry.level === 'W' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      entry.level === 'I' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      'bg-zinc-800 text-zinc-400'
                    }`}>
                      {entry.level}
                    </span>
                    <span className="text-sky-400 shrink-0">{entry.tag}:</span>
                    <span className="text-zinc-300">{entry.message}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1 text-zinc-400">
                <div className="text-emerald-400 font-semibold">&gt; Task :app:preBuild UP-TO-DATE</div>
                <div>&gt; Task :app:compileDebugKotlin UP-TO-DATE</div>
                <div>&gt; Task :app:mergeDebugNativeLibs UP-TO-DATE</div>
                <div>&gt; Task :app:processDebugResources UP-TO-DATE</div>
                <div>&gt; Task :app:dexBuilderDebug UP-TO-DATE</div>
                <div>&gt; Task :app:packageDebug UP-TO-DATE</div>
                <div className="text-emerald-400 font-bold mt-2">BUILD SUCCESSFUL in 1.42s (28 actionable tasks, 28 up-to-date)</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
