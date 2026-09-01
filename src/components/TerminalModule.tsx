import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Trash2, Cpu, Shield, Sparkles } from 'lucide-react';
import { EDModule, ProjectMemoryItem } from '../types';

interface TerminalModuleProps {
  onExecutePrompt: (prompt: string, mode?: string) => Promise<string>;
  memories: ProjectMemoryItem[];
  onNavigateModule: (mod: EDModule) => void;
  onReset: () => void;
}

interface CommandLog {
  id: string;
  command: string;
  output: string;
  type: 'info' | 'success' | 'error' | 'ed';
  time: number;
}

export const TerminalModule: React.FC<TerminalModuleProps> = ({
  onExecutePrompt,
  memories,
  onNavigateModule,
  onReset,
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandLog[]>([
    {
      id: 'welcome',
      command: 'ed --version',
      output: `ED UNPLUGGED AI OPERATING SYSTEM [Version 2.4.0]
Command / Runtime Identity: ED
Architecture: Modular Autonomous Intelligence Framework
Local-First Core: Active | Grounded Web Engine: Connected

Type 'help' for command syntax or 'ed think <topic>' to engage the core.`,
      type: 'info',
      time: Date.now(),
    },
  ]);
  const [isBusy, setIsBusy] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, isBusy]);

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd || isBusy) return;

    setInput('');
    const logId = Math.random().toString(36).substring(2, 9);
    const timestamp = Date.now();

    if (cmd === 'clear') {
      setHistory([]);
      return;
    }

    if (cmd === 'help') {
      setHistory((prev) => [
        ...prev,
        {
          id: logId,
          command: cmd,
          output: `AVAILABLE ED CLI COMMANDS:
  help                     - Show this command reference
  clear                    - Clear the terminal console
  status                   - Display system health, telemetry & active engines
  matrix                   - Display core intellectual pillars & philosophical influences
  ed reset                 - Trigger conversation reset & refocus
  ed think <prompt>        - Engage ED Core with a reasoning query
  ed outside <prompt>      - Run outside-the-box / unconventional inquiry
  ed teach <concept>       - First-principles breakdown & mental model
  ed research <query>      - Execute grounded Google web research
  ed build <spec>          - Ask Builder engine to architect code
  ed mem list              - Display active items stored in Memory Vault
  ed goto <module>         - Jump to GUI module (core|builder|research|strategy|creative|agents|memory)`,
          type: 'info',
          time: timestamp,
        },
      ]);
      return;
    }

    if (cmd === 'status') {
      setHistory((prev) => [
        ...prev,
        {
          id: logId,
          command: cmd,
          output: `[ED OS TELEMETRY]:
  Runtime State:        ONLINE (Container Ingress Port 3000)
  Core Engine:          Gemini 3.7 Flash & Modular Agents
  Thinking Protocol:    Truth & Honesty v2.4
  Memory Vault Items:   ${memories.length} entries stored locally
  Local-First Mode:     ENABLED
  Execution Pipeline:   IDEA -> CONCEPT -> REQ -> ARCH -> MVP -> TEST -> OPT`,
          type: 'success',
          time: timestamp,
        },
      ]);
      return;
    }

    if (cmd === 'matrix') {
      setHistory((prev) => [
        ...prev,
        {
          id: logId,
          command: cmd,
          output: `[ED INTELLECTUAL & CREATIVE MATRIX]:
  • Nikola Tesla:       Unconventional invention, electrical imagination, resonance
  • Leonardo da Vinci:  Interdisciplinary mastery, mechanics, constructive synthesis
  • Albrecht Dürer:     Technical precision, engraving, master line work
  • Scott Robertson:    Industrial & vehicle concept perspective
  • George Bridgman:    Constructive anatomy from simplified geometric masses
  • Musical Energy:     Oldies, R&B, Classic Rap, Eminem, Heavy Metal, Nu-Metal, Metallica, Korn
  • Psychological Lore: Batman strategy vs Joker complexity
  • Compass:            Family stability, opportunity, legacy`,
          type: 'info',
          time: timestamp,
        },
      ]);
      return;
    }

    if (cmd === 'ed reset') {
      onReset();
      setHistory((prev) => [
        ...prev,
        {
          id: logId,
          command: cmd,
          output: `[CONVERSATION RESET]: ED Core has stripped conversational clutter and refocused on your immediate goal.`,
          type: 'success',
          time: timestamp,
        },
      ]);
      return;
    }

    if (cmd.startsWith('ed goto ')) {
      const targetMod = cmd.replace('ed goto ', '').trim() as EDModule;
      onNavigateModule(targetMod);
      setHistory((prev) => [
        ...prev,
        {
          id: logId,
          command: cmd,
          output: `Navigated to module: [${targetMod}]`,
          type: 'success',
          time: timestamp,
        },
      ]);
      return;
    }

    if (cmd === 'ed mem list') {
      const listStr = memories
        .map((m, i) => `  [${i + 1}] [${m.category.toUpperCase()}] ${m.title} (${m.tags.join(', ')})`)
        .join('\n');
      setHistory((prev) => [
        ...prev,
        {
          id: logId,
          command: cmd,
          output: `[MEMORY VAULT ENTRIES]:\n${listStr || '  No memories stored yet.'}`,
          type: 'info',
          time: timestamp,
        },
      ]);
      return;
    }

    // Dynamic ED prompt
    let promptToSend = cmd;
    let mode = 'balanced';

    if (cmd.startsWith('ed think ')) {
      promptToSend = cmd.replace('ed think ', '');
      mode = 'balanced';
    } else if (cmd.startsWith('ed outside ')) {
      promptToSend = cmd.replace('ed outside ', '');
      mode = 'outside_box';
    } else if (cmd.startsWith('ed teach ')) {
      promptToSend = cmd.replace('ed teach ', '');
      mode = 'teacher';
    } else if (cmd.startsWith('ed build ')) {
      promptToSend = `Architect and write code for: ${cmd.replace('ed build ', '')}`;
      mode = 'direct';
    } else if (cmd.startsWith('ed research ')) {
      promptToSend = `Research with citations: ${cmd.replace('ed research ', '')}`;
      mode = 'deep_thinking';
    }

    setIsBusy(true);
    setHistory((prev) => [
      ...prev,
      {
        id: logId,
        command: cmd,
        output: `[ED Core Reasoning...]`,
        type: 'info',
        time: timestamp,
      },
    ]);

    try {
      const response = await onExecutePrompt(promptToSend, mode);
      setHistory((prev) =>
        prev.map((item) =>
          item.id === logId
            ? { ...item, output: response, type: 'ed' }
            : item
        )
      );
    } catch (err: any) {
      setHistory((prev) =>
        prev.map((item) =>
          item.id === logId
            ? { ...item, output: `Error: ${err.message || 'Execution failed'}`, type: 'error' }
            : item
        )
      );
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 font-mono text-xs overflow-hidden pb-16">
      {/* Terminal Title Bar */}
      <div className="h-10 border-b border-slate-800 bg-slate-900/90 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-300">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-200 text-xs">ed-cli --session=active [bash-emulated]</span>
        </div>
        <button
          onClick={() => setHistory([])}
          className="text-slate-500 hover:text-slate-300 text-[11px]"
        >
          Clear Screen
        </button>
      </div>

      {/* Terminal Log Output */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-200">
        {history.map((log) => (
          <div key={log.id} className="space-y-1.5 leading-relaxed">
            <div className="flex items-center gap-2 text-slate-500">
              <span className="text-amber-400 font-bold">ed@unplugged:~$</span>
              <span className="text-slate-100">{log.command}</span>
            </div>
            <div
              className={`p-2.5 rounded-lg whitespace-pre-wrap ${
                log.type === 'error'
                  ? 'bg-red-950/40 text-red-300 border border-red-900/50'
                  : log.type === 'success'
                  ? 'bg-emerald-950/30 text-emerald-300 border border-emerald-900/40'
                  : log.type === 'ed'
                  ? 'bg-slate-900/90 text-slate-100 border border-slate-800'
                  : 'text-slate-300'
              }`}
            >
              {log.output}
            </div>
          </div>
        ))}

        {isBusy && (
          <div className="flex items-center gap-2 text-amber-400 animate-pulse">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
            <span>ED is processing command pipeline...</span>
          </div>
        )}

        <div ref={terminalEndRef} />
      </div>

      {/* Terminal Input Line */}
      <div className="p-3 border-t border-slate-800 bg-slate-900/80">
        <form onSubmit={handleCommand} className="flex items-center gap-2">
          <span className="text-amber-400 font-bold shrink-0">ed@unplugged:~$</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'help', 'status', 'matrix', or 'ed think <topic>'..."
            className="flex-1 bg-transparent border-none outline-none text-emerald-300 font-mono text-xs placeholder-slate-600"
            autoFocus
          />
          <button
            type="submit"
            disabled={!input.trim() || isBusy}
            className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
