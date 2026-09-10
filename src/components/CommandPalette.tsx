import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Bot, 
  Code2, 
  RotateCcw, 
  Sparkles, 
  GitFork, 
  Cpu, 
  Database, 
  Terminal, 
  BookOpen, 
  Zap, 
  Share2,
  Volume2,
  Mic,
  X 
} from 'lucide-react';
import { EDModule, ThinkingMode } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (module: EDModule) => void;
  onSelectThinkingMode: (mode: ThinkingMode) => void;
  onTriggerReset: () => void;
  onQuickAction: (actionType: string, payload?: any) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectModule,
  onSelectThinkingMode,
  onTriggerReset,
  onQuickAction,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onQuickAction('open_palette');
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onQuickAction]);

  if (!isOpen) return null;

  const commands = [
    {
      id: 'reset',
      title: 'Reset Focus / Get Back On Track',
      category: 'System Command',
      icon: <RotateCcw className="w-4 h-4 text-red-400" />,
      action: () => { onTriggerReset(); onClose(); },
    },
    {
      id: 'mode-outside',
      title: 'Enable Outside-The-Box Thinking Mode',
      category: 'Intelligence Mode',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      action: () => { onSelectThinkingMode('outside_box'); onClose(); },
    },
    {
      id: 'mode-teacher',
      title: 'Enable Teaching & First-Principles Mode',
      category: 'Intelligence Mode',
      icon: <BookOpen className="w-4 h-4 text-cyan-400" />,
      action: () => { onSelectThinkingMode('teacher'); onClose(); },
    },
    {
      id: 'mode-balanced',
      title: 'Enable Balanced Pragmatic Mode',
      category: 'Intelligence Mode',
      icon: <Bot className="w-4 h-4 text-emerald-400" />,
      action: () => { onSelectThinkingMode('balanced'); onClose(); },
    },
    {
      id: 'goto-builder',
      title: 'Open Builder IDE & Code Sandbox',
      category: 'Module Navigation',
      icon: <Code2 className="w-4 h-4 text-amber-400" />,
      action: () => { onSelectModule('builder'); onClose(); },
    },
    {
      id: 'goto-research',
      title: 'Open Grounded Research Engine',
      category: 'Module Navigation',
      icon: <Search className="w-4 h-4 text-blue-400" />,
      action: () => { onSelectModule('research'); onClose(); },
    },
    {
      id: 'goto-strategy',
      title: 'Open Strategy & Assumption Challenger',
      category: 'Module Navigation',
      icon: <GitFork className="w-4 h-4 text-purple-400" />,
      action: () => { onSelectModule('strategy'); onClose(); },
    },
    {
      id: 'goto-whatif',
      title: 'Open "What If" Scenario Generator',
      category: 'Module Navigation',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      action: () => { onSelectModule('whatif'); onClose(); },
    },
    {
      id: 'goto-family-law',
      title: 'Open Family Law, Custody & Divorce Assistant',
      category: 'Module Navigation',
      icon: <BookOpen className="w-4 h-4 text-indigo-400" />,
      action: () => { onSelectModule('legal'); onClose(); },
    },
    {
      id: 'goto-custody-schedules',
      title: 'View 50/50 Child Custody Schedules (2-2-5-5, 2-2-3, 7-7)',
      category: 'Family Law',
      icon: <Sparkles className="w-4 h-4 text-indigo-300" />,
      action: () => { onSelectModule('legal'); onClose(); },
    },
    {
      id: 'goto-best-interests',
      title: 'Audit "Best Interests of the Child" Statutory Factors',
      category: 'Family Law',
      icon: <Sparkles className="w-4 h-4 text-purple-300" />,
      action: () => { onSelectModule('legal'); onClose(); },
    },
    {
      id: 'goto-creative',
      title: 'Open Invention & Concept Studio',
      category: 'Module Navigation',
      icon: <Sparkles className="w-4 h-4 text-pink-400" />,
      action: () => { onSelectModule('creative'); onClose(); },
    },
    {
      id: 'goto-agents',
      title: 'Open Autonomous Multi-Agent Dispatcher',
      category: 'Module Navigation',
      icon: <Cpu className="w-4 h-4 text-amber-300" />,
      action: () => { onSelectModule('agents'); onClose(); },
    },
    {
      id: 'goto-memory',
      title: 'Open Long-Term Memory Vault',
      category: 'Module Navigation',
      icon: <Database className="w-4 h-4 text-cyan-300" />,
      action: () => { onSelectModule('memory'); onClose(); },
    },
    {
      id: 'goto-memory-graph',
      title: 'View Memory Vault Visual Synapse & Link Graph',
      category: 'Memory Vault',
      icon: <Share2 className="w-4 h-4 text-cyan-400" />,
      action: () => { onSelectModule('memory'); onClose(); },
    },
    {
      id: 'goto-memory-voice',
      title: 'Launch Voice Sitrep & Knowledge Audio Briefing',
      category: 'Voice Intelligence',
      icon: <Volume2 className="w-4 h-4 text-amber-400" />,
      action: () => { onSelectModule('memory'); onClose(); },
    },
    {
      id: 'goto-terminal',
      title: 'Open Interactive ED Terminal CLI',
      category: 'Module Navigation',
      icon: <Terminal className="w-4 h-4 text-emerald-300" />,
      action: () => { onSelectModule('terminal'); onClose(); },
    },
  ];

  const filteredCommands = commands.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-20 p-4">
      <div 
        className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        id="command-palette-modal"
      >
        {/* Search input header */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-800 bg-slate-950/50">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a command, module, or keyword..."
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-slate-100 text-sm placeholder-slate-500 font-sans"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:text-slate-300 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command list */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">
              No matching commands or modules found.
            </div>
          ) : (
            filteredCommands.map((cmd) => (
              <button
                key={cmd.id}
                onClick={cmd.action}
                className="w-full flex items-center justify-between p-2.5 rounded-xl text-left hover:bg-slate-800/80 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-slate-700">
                    {cmd.icon}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-200 group-hover:text-amber-300 transition-colors">
                      {cmd.title}
                    </div>
                    <div className="text-[11px] text-slate-500">{cmd.category}</div>
                  </div>
                </div>
                <div className="text-xs text-slate-600 group-hover:text-slate-400 font-mono">
                  ↵ Enter
                </div>
              </button>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Use <strong>Esc</strong> to close</span>
          <span>ED Unplugged Command Palette</span>
        </div>
      </div>
    </div>
  );
};
