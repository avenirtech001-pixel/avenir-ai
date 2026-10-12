import React from 'react';
import { useCodex } from '../../context/CodexContext';
import { 
  Bot, 
  Code2, 
  Smartphone, 
  TrendingUp, 
  Globe, 
  FlaskConical, 
  Settings,
  HelpCircle
} from 'lucide-react';
import { WorkspaceTab } from '../../types';

interface ActivityItem {
  id: WorkspaceTab;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  color: string;
}

const ITEMS: ActivityItem[] = [
  { id: 'chat', label: 'AVENIR Autonomous Agent', icon: Bot, color: 'text-amber-400' },
  { id: 'vscode', label: 'VS Code Editor', icon: Code2, color: 'text-blue-400' },
  { id: 'android', label: 'Android Studio & Pixel 8', icon: Smartphone, color: 'text-emerald-400' },
  { id: 'mt5', label: 'MetaTrader 5 Algorithmic Terminal', icon: TrendingUp, color: 'text-amber-400' },
  { id: 'browser', label: 'In-App Web Preview & DevTools', icon: Globe, color: 'text-purple-400' },
  { id: 'tests', label: 'Automated Test Runner', icon: FlaskConical, color: 'text-rose-400' },
];

export const ActivityBar: React.FC = () => {
  const { activeTab, setActiveTab } = useCodex();

  return (
    <aside className="w-13 border-r border-zinc-800/80 bg-[#090b0e] flex flex-col items-center justify-between py-2 select-none z-20 shrink-0">
      {/* Top Workspace Icons */}
      <div className="flex flex-col items-center gap-1.5 w-full">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
              className={`relative group w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-zinc-800 text-white shadow-sm shadow-black/40'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive && (
                <span className="absolute -left-1.5 top-2.5 bottom-2.5 w-1 bg-emerald-400 rounded-r-full" />
              )}

              <Icon className={`h-5 w-5 ${isActive ? item.color : 'text-zinc-400 group-hover:text-zinc-200'}`} />

              {/* Tooltip on hover */}
              <div className="absolute left-14 px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs rounded-md shadow-xl whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                {item.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom utility icons */}
      <div className="flex flex-col items-center gap-1.5 w-full">
        <button
          onClick={() => setActiveTab('tests')}
          title="Run Diagnostics"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
        >
          <HelpCircle className="h-5 w-5" />
        </button>
        <button
          onClick={() => setActiveTab('vscode')}
          title="Editor Config"
          className="w-10 h-10 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 transition-colors"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
};
