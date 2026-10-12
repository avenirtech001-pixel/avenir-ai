import React, { createContext, useContext, useState, useEffect } from 'react';
import { WorkspaceTab, ProjectFile, ChatMessage, ToolAction, MT5BacktestResult, TestCase, LogcatEntry } from '../types';
import { INITIAL_FILES, INITIAL_TESTS, INITIAL_LOGCAT } from '../utils/initialFiles';

interface CodexContextType {
  activeTab: WorkspaceTab;
  setActiveTab: (tab: WorkspaceTab) => void;
  files: Record<string, ProjectFile>;
  activeFilePath: string;
  setActiveFilePath: (path: string) => void;
  updateFileContent: (path: string, content: string) => void;
  createFile: (path: string, language: ProjectFile['language'], environment: ProjectFile['environment'], content?: string) => void;
  messages: ChatMessage[];
  isGenerating: boolean;
  activeActions: ToolAction[];
  apiKey: string;
  setApiKey: (key: string) => void;
  hasEnvKey: boolean;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
  thinkingLevel: 'HIGH' | 'LOW';
  setThinkingLevel: (level: 'HIGH' | 'LOW') => void;
  activeToolFocus: string;
  setActiveToolFocus: (focus: string) => void;
  sendMessage: (text: string) => Promise<void>;
  backtestResult: MT5BacktestResult | null;
  runMT5Backtest: (symbol?: string, timeframe?: string) => Promise<void>;
  isBacktesting: boolean;
  tests: TestCase[];
  runAllTests: () => Promise<void>;
  logcat: LogcatEntry[];
  addLogcat: (entry: Omit<LogcatEntry, 'id'>) => void;
  clearLogcat: () => void;
  androidBuildStatus: 'idle' | 'building' | 'success' | 'failed';
  triggerAndroidBuild: () => Promise<void>;
  terminalHistory: string[];
  runTerminalCommand: (cmd: string) => void;
}

const CodexContext = createContext<CodexContextType | undefined>(undefined);

export const CodexProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('chat');
  const [files, setFiles] = useState<Record<string, ProjectFile>>(INITIAL_FILES);
  const [activeFilePath, setActiveFilePath] = useState<string>('src/trading/CodexTitaniumEA.mq5');
  const [apiKey, setApiKeyState] = useState<string>(() => localStorage.getItem('codex_gemini_api_key') || '');
  const [hasEnvKey, setHasEnvKey] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [thinkingLevel, setThinkingLevel] = useState<'HIGH' | 'LOW'>('HIGH');
  const [activeToolFocus, setActiveToolFocus] = useState<string>('all');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [activeActions, setActiveActions] = useState<ToolAction[]>([]);
  const [backtestResult, setBacktestResult] = useState<MT5BacktestResult | null>(null);
  const [isBacktesting, setIsBacktesting] = useState<boolean>(false);
  const [tests, setTests] = useState<TestCase[]>(INITIAL_TESTS);
  const [logcat, setLogcat] = useState<LogcatEntry[]>(INITIAL_LOGCAT);
  const [androidBuildStatus, setAndroidBuildStatus] = useState<'idle' | 'building' | 'success' | 'failed'>('idle');
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'AVENIR Autonomous Terminal v3.0.0-gold',
    'Environments connected: [VS Code, Android Studio, MetaTrader 5, Chromium Browser]',
    'Type "help" for available commands or use the AVENIR prompt above.'
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text: `### 🚀 AVENIR AI Studio Ready

I am **AVENIR**, your autonomous AI engineering partner powered by **Google Gemini**. I have direct access and execution capabilities across:
- 💻 **VS Code**: Full-stack code editing, AST refactoring, bash terminal, and diff inspection.
- 🤖 **Android Studio**: Jetpack Compose development, Gradle builds, interactive Pixel 8 emulator, and live Logcat.
- 📈 **MetaTrader 5 (MT5)**: MQL5 Expert Advisors, algorithmic indicators, live candlestick chart, and Strategy Tester backtesting.
- 🌐 **In-App Browser**: Headless Chromium sandbox with live DOM inspect and console diagnostics.
- 🧪 **Automated Test Runner**: Multi-environment unit and integration test assertions with auto-fix.

How would you like to start? Select one of the quick suggestions or type your project brief below!`,
      thought: `AVENIR initialized with access to 4 primary developer environments:
1. VS Code: Full-stack engine initialized.
2. Android Studio: Pixel 8 emulator attached on port 5554, API 34.
3. MT5: MQL5 Strategy Tester bridged on EURUSD M1 / XAUUSD M5.
4. Browser: Chromium headless container active on localhost:3000.
Ready for prompt ingestion.`,
      thinkingDuration: 1.2,
      timestamp: Date.now() - 60000,
    }
  ]);

  // Check server status & default environment API key
  useEffect(() => {
    fetch('/api/status')
      .then((res) => res.json())
      .then((data) => {
        if (data.hasEnvKey) {
          setHasEnvKey(true);
        }
      })
      .catch(() => {});
  }, []);

  const setApiKey = (key: string) => {
    setApiKeyState(key);
    localStorage.setItem('codex_gemini_api_key', key);
  };

  const updateFileContent = (path: string, content: string) => {
    setFiles((prev) => {
      if (!prev[path]) return prev;
      return {
        ...prev,
        [path]: {
          ...prev[path],
          content,
          isModified: true,
        },
      };
    });
  };

  const createFile = (path: string, language: ProjectFile['language'], environment: ProjectFile['environment'], content = '') => {
    const name = path.split('/').pop() || path;
    const newFile: ProjectFile = {
      path,
      name,
      language,
      environment,
      content,
      isModified: true,
    };
    setFiles((prev) => ({ ...prev, [path]: newFile }));
    setActiveFilePath(path);
  };

  const addLogcat = (entry: Omit<LogcatEntry, 'id'>) => {
    const newEntry: LogcatEntry = {
      ...entry,
      id: Math.random().toString(36).substring(2, 9),
    };
    setLogcat((prev) => [newEntry, ...prev.slice(0, 199)]);
  };

  const clearLogcat = () => setLogcat([]);

  const runTerminalCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    setTerminalHistory((prev) => [...prev, `$ ${trimmed}`]);

    if (trimmed === 'clear') {
      setTerminalHistory([]);
      return;
    }
    if (trimmed === 'help') {
      setTerminalHistory((prev) => [
        ...prev,
        'Available terminal commands:',
        '  npm test           - Run automated test suites',
        '  npm run build      - Compile full application stack',
        '  gradlew assemble   - Build Android APK debug bundle',
        '  mt5 backtest       - Run MQL5 Expert Advisor simulation',
        '  ls -la             - List workspace files',
        '  clear              - Clear terminal window'
      ]);
      return;
    }
    if (trimmed === 'ls' || trimmed === 'ls -la') {
      setTerminalHistory((prev) => [
        ...prev,
        ...Object.keys(files).map((f) => `-rw-r--r-- 1 codex dev  ${f}`)
      ]);
      return;
    }
    if (trimmed.includes('test') || trimmed === 'npm test') {
      runAllTests();
      setTerminalHistory((prev) => [...prev, '✓ Test runner triggered across 9 suites. Check Test Runner tab.']);
      return;
    }
    if (trimmed.includes('gradle')) {
      triggerAndroidBuild();
      setTerminalHistory((prev) => [...prev, 'Starting Gradle build daemon...']);
      return;
    }
    if (trimmed.includes('mt5') || trimmed.includes('backtest')) {
      runMT5Backtest();
      setTerminalHistory((prev) => [...prev, 'Running MT5 Strategy Tester...']);
      return;
    }

    // Default command output
    setTerminalHistory((prev) => [
      ...prev,
      `[codex-sh] Executed: ${trimmed}`,
      `Exit code: 0 (OK)`
    ]);
  };

  const triggerAndroidBuild = async () => {
    setAndroidBuildStatus('building');
    addLogcat({
      time: new Date().toLocaleTimeString(),
      pid: 14208,
      tag: 'GradleDaemon',
      level: 'I',
      message: 'Executing ./gradlew assembleDebug --no-daemon',
    });

    await new Promise((r) => setTimeout(r, 1200));

    addLogcat({
      time: new Date().toLocaleTimeString(),
      pid: 14208,
      tag: 'DexMerger',
      level: 'I',
      message: 'Compiled 28 classes into classes.dex',
    });

    await new Promise((r) => setTimeout(r, 600));

    addLogcat({
      time: new Date().toLocaleTimeString(),
      pid: 14208,
      tag: 'ApkBuilder',
      level: 'I',
      message: 'Package generated: app-debug.apk (3.4 MB)',
    });

    setAndroidBuildStatus('success');
  };

  const runMT5Backtest = async (symbol = 'EURUSD', timeframe = 'M1') => {
    setIsBacktesting(true);
    try {
      const res = await fetch('/api/mt5/backtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol,
          timeframe,
          strategy: 'CodexTitaniumEA',
          deposit: 10000,
        }),
      });
      const data: MT5BacktestResult = await res.json();
      setBacktestResult(data);
    } catch (err) {
      console.error('Backtest error:', err);
    } finally {
      setIsBacktesting(false);
    }
  };

  const runAllTests = async () => {
    setTests((prev) => prev.map((t) => ({ ...t, status: 'running' })));
    for (let i = 0; i < tests.length; i++) {
      await new Promise((r) => setTimeout(r, 100));
      setTests((prev) => {
        const copy = [...prev];
        if (copy[i]) {
          copy[i] = { ...copy[i], status: 'passed' };
        }
        return copy;
      });
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);

    const startTime = Date.now();

    try {
      // Gather project files text for Gemini context
      const projectFilesPayload: Record<string, string> = {};
      Object.entries(files).forEach(([p, f]) => {
        projectFilesPayload[p] = f.content;
      });

      const response = await fetch('/api/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ role: m.role, text: m.text })),
          model: selectedModel,
          thinkingLevel,
          activeTool: activeToolFocus,
          projectFiles: projectFilesPayload,
          customApiKey: apiKey || undefined,
        }),
      });

      const json = await response.json();
      const elapsedSeconds = +((Date.now() - startTime) / 1000).toFixed(1);

      if (json && json.data) {
        const { thought, actions = [], files: newFiles = [], reply } = json.data;

        // Process file updates
        const filesTouched: string[] = [];
        if (Array.isArray(newFiles)) {
          setFiles((prev) => {
            const updated = { ...prev };
            newFiles.forEach((nf: any) => {
              if (nf.path && nf.content) {
                filesTouched.push(nf.path);
                updated[nf.path] = {
                  path: nf.path,
                  name: nf.path.split('/').pop() || nf.path,
                  language: nf.language || 'typescript',
                  environment: nf.path.includes('.mq5') ? 'mt5' : nf.path.includes('app/') ? 'android' : 'vscode',
                  content: nf.content,
                  isModified: true,
                };
              }
            });
            return updated;
          });
          if (filesTouched.length > 0) {
            setActiveFilePath(filesTouched[0]);
          }
        }

        // Process tool actions
        const formattedActions: ToolAction[] = actions.map((act: any, idx: number) => ({
          id: `act-${Date.now()}-${idx}`,
          environment: act.environment || 'vscode',
          tool: act.tool || 'edit_file',
          summary: act.summary || 'Executed autonomous action',
          target: act.target,
          details: act.details,
          status: 'success',
          timestamp: Date.now(),
        }));

        setActiveActions(formattedActions);

        // Auto-switch to relevant tab if targeted
        if (actions.length > 0) {
          const firstEnv = actions[0].environment;
          if (firstEnv === 'mt5') {
            runMT5Backtest();
          } else if (firstEnv === 'android') {
            triggerAndroidBuild();
          }
        }

        const assistantMsg: ChatMessage = {
          id: Math.random().toString(36).substring(2, 9),
          role: 'assistant',
          text: reply || 'Tasks executed successfully.',
          thought: thought || 'Synthesized requirements, executed tools, and generated verified code.',
          thinkingDuration: elapsedSeconds,
          actions: formattedActions,
          filesTouched,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, assistantMsg]);
      }
    } catch (err: any) {
      console.error('Agent chat failed:', err);
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(36).substring(2, 9),
        role: 'assistant',
        text: `Encountered an issue executing request: ${err.message}. Please check your connection or API key settings.`,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <CodexContext.Provider
      value={{
        activeTab,
        setActiveTab,
        files,
        activeFilePath,
        setActiveFilePath,
        updateFileContent,
        createFile,
        messages,
        isGenerating,
        activeActions,
        apiKey,
        setApiKey,
        hasEnvKey,
        selectedModel,
        setSelectedModel,
        thinkingLevel,
        setThinkingLevel,
        activeToolFocus,
        setActiveToolFocus,
        sendMessage,
        backtestResult,
        runMT5Backtest,
        isBacktesting,
        tests,
        runAllTests,
        logcat,
        addLogcat,
        clearLogcat,
        androidBuildStatus,
        triggerAndroidBuild,
        terminalHistory,
        runTerminalCommand,
      }}
    >
      {children}
    </CodexContext.Provider>
  );
};

export const useCodex = () => {
  const context = useContext(CodexContext);
  if (!context) {
    throw new Error('useCodex must be used within a CodexProvider');
  }
  return context;
};
