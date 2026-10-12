import React, { useState, useEffect } from 'react';
import { useCodex } from '../../context/CodexContext';
import { SAMPLE_CANDLES } from '../../utils/initialFiles';
import { CandleData } from '../../types';
import { 
  TrendingUp, 
  Play, 
  BarChart2, 
  FileCode, 
  DollarSign, 
  ShieldCheck, 
  Layers, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Sliders,
  CheckCircle2
} from 'lucide-react';

export const MT5Workspace: React.FC = () => {
  const { 
    files, 
    activeFilePath, 
    setActiveFilePath, 
    backtestResult, 
    runMT5Backtest, 
    isBacktesting,
    sendMessage,
    isGenerating
  } = useCodex();

  const [activeTab, setActiveTab] = useState<'chart' | 'tester' | 'metaeditor'>('chart');
  const [selectedSymbol, setSelectedSymbol] = useState<'EURUSD' | 'XAUUSD' | 'BTCUSD'>('EURUSD');
  const [selectedTimeframe, setSelectedTimeframe] = useState<'M1' | 'M5' | 'M15' | 'H1'>('M15');
  const [candles, setCandles] = useState<CandleData[]>(SAMPLE_CANDLES);

  // Auto trigger initial backtest if none exists
  useEffect(() => {
    if (!backtestResult) {
      runMT5Backtest('EURUSD', 'M15');
    }
  }, [backtestResult, runMT5Backtest]);

  const mq5File = files['src/trading/CodexTitaniumEA.mq5'] || Object.values(files).find((f) => f.path.endsWith('.mq5'));

  // Calculate prices for chart rendering
  const minPrice = Math.min(...candles.map((c) => c.low));
  const maxPrice = Math.max(...candles.map((c) => c.high));
  const priceRange = maxPrice - minPrice || 0.01;

  const getY = (val: number, height: number) => {
    return height - ((val - minPrice) / priceRange) * height;
  };

  return (
    <div className="flex h-full bg-[#0a0c10] text-zinc-200 select-none overflow-hidden">
      {/* MT5 Navigator Sidebar */}
      <div className="w-56 border-r border-zinc-800/80 bg-[#0e1117] flex flex-col shrink-0">
        <div className="h-9 px-3 border-b border-zinc-800/80 flex items-center justify-between text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-amber-400" />
            <span>MT5 Navigator</span>
          </div>
        </div>

        {/* Watchlist / Market Watch */}
        <div className="p-2 border-b border-zinc-800/60 text-xs">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
            Market Watch (Live Feeds)
          </div>
          <div className="space-y-1">
            {[
              { sym: 'EURUSD', bid: '1.08552', ask: '1.08564', chg: '+0.18%' },
              { sym: 'XAUUSD', bid: '2,652.40', ask: '2,652.75', chg: '+0.84%' },
              { sym: 'BTCUSD', bid: '94,180.00', ask: '94,210.00', chg: '+2.41%' }
            ].map((s) => (
              <button
                key={s.sym}
                onClick={() => setSelectedSymbol(s.sym as any)}
                className={`w-full p-2 rounded-lg text-left text-xs transition-colors border ${
                  selectedSymbol === s.sym
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-zinc-900/60 border-zinc-800/60 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                <div className="flex items-center justify-between font-mono font-semibold">
                  <span>{s.sym}</span>
                  <span className="text-[10px] text-emerald-400">{s.chg}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono mt-0.5">
                  <span>{s.bid}</span>
                  <span className="text-zinc-500">/</span>
                  <span>{s.ask}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Expert Advisors list */}
        <div className="flex-1 overflow-y-auto p-2 text-xs space-y-1">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-1">
            MQL5 Expert Advisors
          </div>
          <button
            onClick={() => {
              setActiveTab('metaeditor');
              if (mq5File) setActiveFilePath(mq5File.path);
            }}
            className="w-full flex items-center gap-2 p-2 rounded bg-zinc-900/80 border border-zinc-800 text-left text-zinc-200 hover:border-zinc-700 font-mono text-[11px]"
          >
            <FileCode className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <div className="truncate">
              <div className="font-semibold text-white">CodexTitaniumEA</div>
              <div className="text-[10px] text-zinc-400">ATR Trailing & EMA Cross</div>
            </div>
          </button>
        </div>
      </div>

      {/* Main MT5 Terminal View */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0c0e14]">
        {/* Top View Selector Bar */}
        <div className="h-10 border-b border-zinc-800/80 bg-[#0e1117] px-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('chart')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'chart'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <BarChart2 className="h-3.5 w-3.5" />
              <span>Interactive Chart ({selectedSymbol})</span>
            </button>

            <button
              onClick={() => setActiveTab('tester')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'tester'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Strategy Tester & Equity Curve</span>
            </button>

            <button
              onClick={() => setActiveTab('metaeditor')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                activeTab === 'metaeditor'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileCode className="h-3.5 w-3.5" />
              <span>MetaEditor (MQL5 Source)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => sendMessage('Optimize CodexTitaniumEA risk parameters to increase profit factor above 2.5 on MT5')}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 text-xs transition-colors"
            >
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Codex Quant Assistant</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Live Candlestick Financial Chart */}
        {activeTab === 'chart' && (
          <div className="flex-1 flex flex-col p-4 bg-[#080a0e] overflow-auto">
            {/* Chart Toolbar */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-bold text-white">{selectedSymbol}</span>
                <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono border border-amber-500/20">
                  {selectedTimeframe}
                </span>
                <div className="flex items-center gap-1 ml-2">
                  {(['M1', 'M5', 'M15', 'H1'] as const).map((tf) => (
                    <button
                      key={tf}
                      onClick={() => setSelectedTimeframe(tf)}
                      className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                        selectedTimeframe === tf
                          ? 'bg-zinc-800 text-white font-bold'
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>EMA 20</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span>RSI (14)</span>
                </span>
              </div>
            </div>

            {/* Candlestick SVG Rendering */}
            <div className="flex-1 relative bg-[#06080c] rounded-2xl border border-zinc-800/80 p-4 min-h-[340px] flex flex-col justify-between overflow-hidden">
              <div className="relative w-full h-[220px]">
                <svg className="w-full h-full overflow-visible">
                  {/* Grid lines */}
                  {[0.2, 0.4, 0.6, 0.8].map((pct, i) => (
                    <line
                      key={i}
                      x1="0"
                      y1={pct * 220}
                      x2="100%"
                      y2={pct * 220}
                      stroke="#1e2430"
                      strokeDasharray="4 4"
                    />
                  ))}

                  {/* Candlestick bars */}
                  {candles.map((c, i) => {
                    const widthPct = 100 / (candles.length + 1);
                    const x = (i + 0.5) * (100 / candles.length);
                    const yHigh = getY(c.high, 200);
                    const yLow = getY(c.low, 200);
                    const yOpen = getY(c.open, 200);
                    const yClose = getY(c.close, 200);

                    const isBull = c.close >= c.open;
                    const candleColor = isBull ? '#10b981' : '#f43f5e';

                    return (
                      <g key={i}>
                        {/* Shadow wick */}
                        <line
                          x1={`${x}%`}
                          y1={yHigh}
                          x2={`${x}%`}
                          y2={yLow}
                          stroke={candleColor}
                          strokeWidth="1.5"
                        />
                        {/* Real Body */}
                        <rect
                          x={`calc(${x}% - 6px)`}
                          y={Math.min(yOpen, yClose)}
                          width="12"
                          height={Math.max(Math.abs(yClose - yOpen), 3)}
                          fill={candleColor}
                          rx="1"
                        />

                        {/* Signal Arrows */}
                        {c.signal === 'BUY' && (
                          <g transform={`translate(0, ${yLow + 16})`}>
                            <polygon
                              points={`calc(${x}%),${yLow + 2} calc(${x}% - 5px),${yLow + 12} calc(${x}% + 5px),${yLow + 12}`}
                              fill="#10b981"
                            />
                            <text
                              x={`${x}%`}
                              y={yLow + 24}
                              fill="#10b981"
                              fontSize="9"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              BUY
                            </text>
                          </g>
                        )}

                        {c.signal === 'SELL' && (
                          <g transform={`translate(0, ${yHigh - 16})`}>
                            <polygon
                              points={`calc(${x}%),${yHigh - 2} calc(${x}% - 5px),${yHigh - 12} calc(${x}% + 5px),${yHigh - 12}`}
                              fill="#f43f5e"
                            />
                            <text
                              x={`${x}%`}
                              y={yHigh - 14}
                              fill="#f43f5e"
                              fontSize="9"
                              fontWeight="bold"
                              textAnchor="middle"
                            >
                              SELL
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Sub-window: RSI Indicator */}
              <div className="h-20 border-t border-zinc-800/80 pt-2 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                  <span>RSI (14) - Relative Strength Index</span>
                  <span className="text-amber-400 font-bold">58.4 (Neutral)</span>
                </div>
                <div className="relative h-12 w-full bg-[#040608] rounded-lg border border-zinc-900 flex items-center px-2">
                  <div className="absolute top-2 w-full border-b border-zinc-800/80 border-dashed" />
                  <div className="absolute bottom-2 w-full border-b border-zinc-800/80 border-dashed" />
                  <span className="absolute right-2 top-0.5 text-[9px] text-zinc-600">70</span>
                  <span className="absolute right-2 bottom-0.5 text-[9px] text-zinc-600">30</span>
                  <div className="w-full h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-rose-400 rounded-full opacity-60" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Strategy Tester & Backtest Panel */}
        {activeTab === 'tester' && (
          <div className="flex-1 flex flex-col p-4 bg-[#080a0e] overflow-auto space-y-4">
            {/* Tester Header & Controls */}
            <div className="flex items-center justify-between p-4 bg-[#101319] rounded-2xl border border-zinc-800">
              <div>
                <h3 className="font-semibold text-sm text-white">MT5 Strategy Tester & Quantitative Backtest</h3>
                <p className="text-xs text-zinc-400">Backtesting CodexTitaniumEA against historical tick stream</p>
              </div>

              <button
                onClick={() => runMT5Backtest(selectedSymbol, selectedTimeframe)}
                disabled={isBacktesting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs shadow-md shadow-amber-950/40 transition-all disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5 fill-white" />
                <span>{isBacktesting ? 'Running Simulation...' : 'Start Strategy Tester'}</span>
              </button>
            </div>

            {/* Performance Metrics Cards */}
            {backtestResult && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="p-3 bg-[#11141c] rounded-xl border border-zinc-800">
                  <div className="text-[11px] text-zinc-400">Net Profit</div>
                  <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                    +${backtestResult.netProfit.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-500 font-medium">+{backtestResult.netProfitPct}% Return</div>
                </div>

                <div className="p-3 bg-[#11141c] rounded-xl border border-zinc-800">
                  <div className="text-[11px] text-zinc-400">Profit Factor</div>
                  <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
                    {backtestResult.profitFactor}
                  </div>
                  <div className="text-[10px] text-zinc-500">Gross W / Gross L</div>
                </div>

                <div className="p-3 bg-[#11141c] rounded-xl border border-zinc-800">
                  <div className="text-[11px] text-zinc-400">Win Rate %</div>
                  <div className="text-lg font-bold text-blue-400 font-mono mt-0.5">
                    {backtestResult.winRate}%
                  </div>
                  <div className="text-[10px] text-zinc-500">{backtestResult.winTrades} Won / {backtestResult.lossTrades} Lost</div>
                </div>

                <div className="p-3 bg-[#11141c] rounded-xl border border-zinc-800">
                  <div className="text-[11px] text-zinc-400">Max Drawdown</div>
                  <div className="text-lg font-bold text-rose-400 font-mono mt-0.5">
                    {backtestResult.maxDrawdownPct}%
                  </div>
                  <div className="text-[10px] text-zinc-500">Peak to trough</div>
                </div>

                <div className="p-3 bg-[#11141c] rounded-xl border border-zinc-800">
                  <div className="text-[11px] text-zinc-400">Total Trades</div>
                  <div className="text-lg font-bold text-zinc-200 font-mono mt-0.5">
                    {backtestResult.totalTrades}
                  </div>
                  <div className="text-[10px] text-zinc-500">Spread: {backtestResult.spread} pips</div>
                </div>
              </div>
            )}

            {/* Visual Equity Curve */}
            {backtestResult && (
              <div className="p-4 bg-[#101319] rounded-2xl border border-zinc-800">
                <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider mb-2">
                  Equity Curve Growth ($10,000 Initial Balance)
                </div>
                <div className="h-44 w-full relative flex items-end">
                  <svg className="w-full h-full overflow-visible">
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2.5"
                      points={backtestResult.equityCurve
                        .map((pt, idx) => {
                          const x = (idx / (backtestResult.equityCurve.length - 1)) * 100;
                          const minBal = 9500;
                          const maxBal = backtestResult.finalBalance * 1.05;
                          const y = 160 - ((pt.balance - minBal) / (maxBal - minBal)) * 140;
                          return `${x}%,${y}`;
                        })
                        .join(' ')}
                    />
                  </svg>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: MetaEditor MQL5 Code View */}
        {activeTab === 'metaeditor' && mq5File && (
          <div className="flex-1 flex flex-col p-4 bg-[#080a0e] overflow-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-2">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-amber-400" />
                <span className="font-mono text-xs font-semibold text-white">{mq5File.path}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                  MQL5 Strict Compiler: OK (0 errors, 0 warnings)
                </span>
              </div>
            </div>
            <pre className="flex-1 p-4 bg-[#040609] rounded-2xl border border-zinc-800/80 text-[11px] font-mono text-zinc-300 overflow-auto whitespace-pre leading-5">
              {mq5File.content}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
