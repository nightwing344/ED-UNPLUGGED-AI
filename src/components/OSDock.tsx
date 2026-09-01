import React from 'react';
import { 
  Bot, 
  Code2, 
  Search, 
  GitFork, 
  HelpCircle,
  Scale,
  Sparkles, 
  Cpu, 
  Database, 
  Terminal 
} from 'lucide-react';
import { EDModule } from '../types';

interface OSDockProps {
  activeModule: EDModule;
  onSelectModule: (module: EDModule) => void;
}

export const OSDock: React.FC<OSDockProps> = ({ activeModule, onSelectModule }) => {
  const modules: { id: EDModule; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'core', label: 'ED Core', icon: <Bot className="w-4 h-4" /> },
    { id: 'builder', label: 'Builder IDE', icon: <Code2 className="w-4 h-4" /> },
    { id: 'research', label: 'Research', icon: <Search className="w-4 h-4" /> },
    { id: 'strategy', label: 'Strategy', icon: <GitFork className="w-4 h-4" /> },
    { id: 'whatif', label: 'What If?', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'legal', label: 'Family & Legal', icon: <Scale className="w-4 h-4" /> },
    { id: 'creative', label: 'Creative', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'agents', label: 'Agents', icon: <Cpu className="w-4 h-4" /> },
    { id: 'memory', label: 'Memory Vault', icon: <Database className="w-4 h-4" /> },
    { id: 'terminal', label: 'Terminal', icon: <Terminal className="w-4 h-4" /> },
  ];

  return (
    <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-30">
      <nav 
        className="flex items-center gap-1 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl shadow-black/80 ring-1 ring-white/10"
        aria-label="ED OS Navigation Dock"
        id="ed-os-dock"
      >
        {modules.map((m) => {
          const isActive = activeModule === m.id;
          return (
            <button
              key={m.id}
              id={`dock-tab-${m.id}`}
              onClick={() => onSelectModule(m.id)}
              className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
              }`}
            >
              {m.icon}
              <span className="hidden sm:inline">{m.label}</span>
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-amber-300 rounded-full" />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
