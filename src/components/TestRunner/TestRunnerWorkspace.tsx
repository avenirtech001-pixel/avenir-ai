import React, { useState } from 'react';
import { useCodex } from '../../context/CodexContext';
import { 
  FlaskConical, 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Code2, 
  Smartphone, 
  TrendingUp, 
  Globe,
  Filter
} from 'lucide-react';

export const TestRunnerWorkspace: React.FC = () => {
  const { tests, runAllTests, sendMessage, isGenerating } = useCodex();
  const [suiteFilter, setSuiteFilter] = useState<string>('all');

  const passedCount = tests.filter((t) => t.status === 'passed').length;
  const failedCount = tests.filter((t) => t.status === 'failed').length;
  const totalDuration = tests.reduce((acc, t) => acc + t.durationMs, 0);

  const filteredTests = tests.filter((t) => {
    if (suiteFilter === 'all') return true;
    return t.environment === suiteFilter;
  });

  const getEnvBadge = (env: string) => {
    switch (env) {
      case 'vscode': return <span className="flex items-center gap-1 text-blue-400"><Code2 className="h-3 w-3" /> VS Code</span>;
      case 'android': return <span className="flex items-center gap-1 text-emerald-400"><Smartphone className="h-3 w-3" /> Android JUnit</span>;
      case 'mt5': return <span className="flex items-center gap-1 text-amber-400"><TrendingUp className="h-3 w-3" /> MT5 Quant</span>;
      case 'browser': return <span className="flex items-center gap-1 text-purple-400"><Globe className="h-3 w-3" /> Browser E2E</span>;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0a0c10] text-zinc-200 select-none overflow-hidden">
      {/* Top Test Header */}
      <div className="h-11 border-b border-zinc-800/80 bg-[#0e1117] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-rose-400" />
          <span className="font-semibold text-xs text-white uppercase tracking-wider font-mono">
            Autonomous Test Suite Runner
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => sendMessage('Analyze test assertions across VS Code, Android, MT5, and Browser, and propose stress test cases')}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 text-xs transition-colors"
          >
            <Sparkles className="h-3 w-3 text-rose-400" />
            <span>Generate New Assertions</span>
          </button>

          <button
            onClick={runAllTests}
            className="flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-md shadow-rose-950/40 transition-all"
          >
            <Play className="h-3 w-3 fill-white" />
            <span>Run All Tests</span>
          </button>
        </div>
      </div>

      {/* Test Metrics Overview */}
      <div className="p-4 bg-[#0d0f14] border-b border-zinc-800/80 shrink-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-[#12151d] rounded-xl border border-zinc-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-zinc-400 font-medium">Test Suites Passed</div>
              <div className="text-xl font-bold text-emerald-400 font-mono mt-0.5">
                {passedCount} / {tests.length}
              </div>
            </div>
            <CheckCircle2 className="h-6 w-6 text-emerald-400/30" />
          </div>

          <div className="p-3 bg-[#12151d] rounded-xl border border-zinc-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-zinc-400 font-medium">Failed Assertions</div>
              <div className="text-xl font-bold text-rose-400 font-mono mt-0.5">
                {failedCount}
              </div>
            </div>
            <XCircle className="h-6 w-6 text-rose-400/30" />
          </div>

          <div className="p-3 bg-[#12151d] rounded-xl border border-zinc-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-zinc-400 font-medium">Execution Duration</div>
              <div className="text-xl font-bold text-sky-400 font-mono mt-0.5">
                {totalDuration} ms
              </div>
            </div>
            <Clock className="h-6 w-6 text-sky-400/30" />
          </div>

          <div className="p-3 bg-[#12151d] rounded-xl border border-zinc-800 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-zinc-400 font-medium">Code Coverage</div>
              <div className="text-xl font-bold text-indigo-400 font-mono mt-0.5">
                98.4%
              </div>
            </div>
            <ShieldCheck className="h-6 w-6 text-indigo-400/30" />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-zinc-800/60">
          <span className="text-[11px] text-zinc-500 font-medium mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Filter by Target:
          </span>
          {[
            { id: 'all', label: 'All Environments' },
            { id: 'vscode', label: 'VS Code' },
            { id: 'android', label: 'Android JUnit' },
            { id: 'mt5', label: 'MT5 Quant' },
            { id: 'browser', label: 'Browser E2E' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSuiteFilter(f.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                suiteFilter === f.id
                  ? 'bg-zinc-800 text-white border border-zinc-700'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Test Cases Table */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="p-3 bg-[#101319] rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 flex items-center justify-between transition-colors text-xs"
          >
            <div className="flex items-center gap-3">
              {test.status === 'passed' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : test.status === 'failed' ? (
                <XCircle className="h-4 w-4 text-rose-400 shrink-0" />
              ) : (
                <div className="h-4 w-4 rounded-full border-2 border-emerald-400 border-t-transparent animate-spin shrink-0" />
              )}

              <div>
                <div className="font-semibold text-zinc-100 flex items-center gap-2">
                  <span>{test.name}</span>
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5 flex items-center gap-2">
                  <span>{test.suite}</span>
                  <span>•</span>
                  <span>{getEnvBadge(test.environment)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px] text-zinc-400">
              <span>{test.durationMs}ms</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold uppercase text-[10px]">
                {test.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
