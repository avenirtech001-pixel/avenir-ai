export type WorkspaceTab = 'chat' | 'vscode' | 'android' | 'mt5' | 'browser' | 'tests';

export interface ToolAction {
  id: string;
  environment: 'vscode' | 'android' | 'mt5' | 'browser' | 'test';
  tool: 'edit_file' | 'run_terminal' | 'build_gradle' | 'backtest_mql5' | 'navigate_browser' | 'run_tests';
  summary: string;
  target?: string;
  details?: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  timestamp: number;
}

export interface ProjectFile {
  path: string;
  name: string;
  language: 'typescript' | 'javascript' | 'kotlin' | 'mql5' | 'html' | 'css' | 'json' | 'markdown';
  content: string;
  environment: 'vscode' | 'android' | 'mt5' | 'web';
  isModified?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  thought?: string;
  thinkingDuration?: number;
  actions?: ToolAction[];
  filesTouched?: string[];
  timestamp: number;
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  signal?: 'BUY' | 'SELL';
}

export interface MT5BacktestResult {
  symbol: string;
  timeframe: string;
  strategy: string;
  initialDeposit: number;
  finalBalance: number;
  netProfit: number;
  netProfitPct: number;
  profitFactor: number;
  winRate: number;
  totalTrades: number;
  winTrades: number;
  lossTrades: number;
  maxDrawdownPct: number;
  spread: number;
  equityCurve: { trade: number; balance: number; equity: number }[];
}

export interface TestCase {
  id: string;
  suite: string;
  name: string;
  environment: 'vscode' | 'android' | 'mt5' | 'browser';
  status: 'passed' | 'failed' | 'running' | 'skipped';
  durationMs: number;
  errorMessage?: string;
}

export interface LogcatEntry {
  id: string;
  time: string;
  pid: number;
  tag: string;
  level: 'V' | 'D' | 'I' | 'W' | 'E';
  message: string;
}
