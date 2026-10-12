import React, { useState } from 'react';
import { CodexProvider, useCodex } from './context/CodexContext';
import { TopBar } from './components/Navigation/TopBar';
import { ActivityBar } from './components/Navigation/ActivityBar';
import { AgentPanel } from './components/CodexAgent/AgentPanel';
import { VSCodeWorkspace } from './components/VSCode/VSCodeWorkspace';
import { AndroidStudioWorkspace } from './components/AndroidStudio/AndroidStudioWorkspace';
import { MT5Workspace } from './components/MT5/MT5Workspace';
import { BrowserWorkspace } from './components/Browser/BrowserWorkspace';
import { TestRunnerWorkspace } from './components/TestRunner/TestRunnerWorkspace';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { activeTab } = useCodex();
  const [isAgentPanelOpen, setIsAgentPanelOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#07090d] text-zinc-100 overflow-hidden font-sans">
      {/* Top Header Bar */}
      <TopBar />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Leftmost Activity Bar */}
        <ActivityBar />

        {/* Resizable / Collapsible Codex Agent Stream Panel */}
        {isAgentPanelOpen && (
          <div className="w-[380px] lg:w-[440px] xl:w-[480px] h-full flex flex-col shrink-0 border-r border-zinc-800/80 relative z-10 transition-all">
            <AgentPanel />
          </div>
        )}

        {/* Center/Right Active Workspace View */}
        <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden bg-[#0a0c10]">
          {/* Toggle Agent Panel Floating Button */}
          <button
            onClick={() => setIsAgentPanelOpen(!isAgentPanelOpen)}
            title={isAgentPanelOpen ? 'Collapse Agent Panel' : 'Expand Agent Panel'}
            className="absolute top-2 left-2 z-30 p-1.5 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white shadow-md transition-colors"
          >
            {isAgentPanelOpen ? <PanelLeftClose className="h-3.5 w-3.5" /> : <PanelLeftOpen className="h-3.5 w-3.5" />}
          </button>

          {activeTab === 'chat' && <VSCodeWorkspace />}
          {activeTab === 'vscode' && <VSCodeWorkspace />}
          {activeTab === 'android' && <AndroidStudioWorkspace />}
          {activeTab === 'mt5' && <MT5Workspace />}
          {activeTab === 'browser' && <BrowserWorkspace />}
          {activeTab === 'tests' && <TestRunnerWorkspace />}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <CodexProvider>
      <MainLayout />
    </CodexProvider>
  );
}
