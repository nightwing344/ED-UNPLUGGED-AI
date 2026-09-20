import React from 'react';
import { 
  Terminal, 
  Cpu, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Search, 
  Activity, 
  Sparkles, 
  Database,
  Sliders
} from 'lucide-react';
import { EDModule, ThinkingMode } from '../types';

interface HeaderProps {
  currentModule: EDModule;
  onSelectModule: (module: EDModule) => void;
  thinkingMode: ThinkingMode;
  onSelectThinkingMode: (mode: ThinkingMode) => void;
  onOpenCommandPalette: () => void;
  onTriggerReset: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
  memoryCount: number;
  activeAgentsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentModule,
  onSelectModule,
  thinkingMode,
  onSelectThinkingMode,
  onOpenCommandPalette,
  onTriggerReset,
  audioEnabled,
  onToggleAudio,
  memoryCount,
  activeAgentsCount,
}) => {
  const modeLabels: Record<ThinkingMode, { label: string; color: string; desc: string }> = {
    balanced: { label: 'Balanced Core', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', desc: 'Pragmatic & curious' },
    outside_box: { label: 'Outside-The-Box', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', desc: 'Unorthodox breakthrough angles' },
    teacher: { label: 'Teaching Mode', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40', desc: 'First-principles & mental models' },
    direct: { label: 'Ultra-Direct', color: 'bg-rose-500/20 text-rose-300 border-rose-500/40', desc: 'Zero fluff, straight to execution' },
    deep_thinking: { label: 'Deep Reasoning', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40', desc: 'Heavy analytical breakdown' },
  };

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-950/90 backdrop-blur px-4 flex items-center justify-between select-none z-30 sticky top-0">
      {/* Left: Branding & Status */}
      <div className="flex items-center gap-3">
        <div 
          onClick={() => onSelectModule('core')}
          className="flex items-center gap-2 cursor-pointer group"
          id="ed-logo-button"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 group-hover:border-amber-400 transition-colors shadow-sm shadow-amber-500/10">
            <span className="font-mono font-black text-sm tracking-tighter">ED</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-slate-100 text-sm tracking-tight">ED UNPLUGGED</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">OS v2.4</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-[10px] font-mono text-emerald-400">CORE ACTIVE</span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] text-slate-400">Local-First Intel</span>
            </div>
          </div>
        </div>

        {/* Mode Selector Pill */}
        <div className="hidden md:flex items-center ml-4 pl-4 border-l border-slate-800">
          <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-lg border border-slate-800">
            {(['balanced', 'outside_box', 'teacher', 'direct'] as ThinkingMode[]).map((mode) => {
              const active = thinkingMode === mode;
              return (
                <button
                  key={mode}
                  id={`mode-btn-${mode}`}
                  onClick={() => onSelectThinkingMode(mode)}
                  className={`px-2.5 py-1 text-xs rounded-md font-medium transition-all ${
                    active
                      ? modeLabels[mode].color + ' border shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                  title={modeLabels[mode].desc}
                >
                  {modeLabels[mode].label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Center/Right: Quick Search & Telemetry & Actions */}
      <div className="flex items-center gap-2">
        {/* Command Palette Trigger */}
        <button
          onClick={onOpenCommandPalette}
          id="command-palette-trigger"
          className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700 text-xs transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span>Quick Command</span>
          <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400 border border-slate-700">⌘K</kbd>
        </button>

        {/* Memory status */}
        <button
          onClick={() => onSelectModule('memory')}
          id="header-memory-btn"
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs transition-colors"
          title="Project & Context Memory Vault"
        >
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-mono text-[11px] text-cyan-300">{memoryCount} Memories</span>
        </button>

        {/* Active Agents counter */}
        <button
          onClick={() => onSelectModule('agents')}
          id="header-agents-btn"
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-300 hover:bg-slate-800 text-xs transition-colors"
          title="Active Autonomous Sub-Agents"
        >
          <Cpu className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-[11px] text-amber-300">{activeAgentsCount} Agents</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={onToggleAudio}
          id="audio-toggle-btn"
          className={`p-2 rounded-lg border transition-colors ${
            audioEnabled 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
              : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
          }`}
          title={audioEnabled ? 'Voice companion enabled' : 'Voice companion muted'}
        >
          {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* User-Controlled Conversation Reset Button (Master Blueprint Section 5) */}
        <button
          onClick={onTriggerReset}
          id="header-reset-btn"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 text-red-300 border border-red-800/60 hover:bg-red-900/50 hover:border-red-600 text-xs font-medium transition-all shadow-xs"
          title="Reset conversation focus & get back on track"
        >
          <RotateCcw className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">Reset Focus</span>
        </button>
      </div>
    </header>
  );
};
