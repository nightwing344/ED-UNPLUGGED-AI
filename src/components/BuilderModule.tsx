import React, { useState } from 'react';
import { 
  Code2, 
  Play, 
  Sparkles, 
  Bug, 
  FileText, 
  CheckCircle2, 
  Circle, 
  Download, 
  Layers, 
  Cpu, 
  Terminal,
  Save,
  Plus
} from 'lucide-react';
import { CodeProject } from '../types';

interface BuilderModuleProps {
  initialCode?: string;
  initialLanguage?: string;
  onSaveToMemory: (title: string, code: string, notes: string) => void;
}

const DEFAULT_PROJECT_CODE = `// ED Unplugged AI - Autonomous Task Engine Sandbox
// Test your algorithms, data parsers, and micro-architectures live.

interface Task {
  id: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  executed: boolean;
}

class AutonomousTaskEngine {
  private queue: Task[] = [];

  addTask(name: string, priority: 'high' | 'medium' | 'low' = 'medium') {
    const task: Task = {
      id: Math.random().toString(36).substring(2, 9),
      name,
      priority,
      executed: false
    };
    this.queue.push(task);
    console.log(\`[ED Task Engine] Queued task: \${name} (Priority: \${priority})\`);
    return task;
  }

  executeNext() {
    if (this.queue.length === 0) {
      console.log("[ED Task Engine] All tasks completed.");
      return null;
    }
    // High priority first
    this.queue.sort((a, b) => (a.priority === 'high' ? -1 : 1));
    const task = this.queue.shift()!;
    task.executed = true;
    console.log(\`[ED Task Engine] >> Executed: \${task.name} [ID: \${task.id}]\`);
    return task;
  }
}

// Run Simulation
const engine = new AutonomousTaskEngine();
engine.addTask("Analyze Network Latency", "medium");
engine.addTask("Fix Critical Database Index", "high");
engine.addTask("Synthesize Strategy Brief", "low");

console.log("--- Executing Queue ---");
engine.executeNext();
engine.executeNext();
engine.executeNext();
`;

export const BuilderModule: React.FC<BuilderModuleProps> = ({
  initialCode,
  initialLanguage = 'typescript',
  onSaveToMemory,
}) => {
  const [code, setCode] = useState(initialCode || DEFAULT_PROJECT_CODE);
  const [language, setLanguage] = useState(initialLanguage);
  const [projectGoal, setProjectGoal] = useState('');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([
    '[ED Builder IDE] Sandbox initialized. Write or paste TypeScript/JS code and click "Run Simulation".'
  ]);
  const [isArchitecting, setIsArchitecting] = useState(false);
  const [architectureResult, setArchitectureResult] = useState('');

  // Execution Pipeline checklist (Section 11)
  const [pipelineSteps, setPipelineSteps] = useState([
    { name: '1. IDEA: Core Value Proposition Defined', done: true },
    { name: '2. CONCEPT: Technical feasibility & mental model', done: true },
    { name: '3. REQUIREMENTS: Minimum critical features', done: false },
    { name: '4. ARCHITECTURE: Data structures & modular contracts', done: false },
    { name: '5. MVP: First testable working slice', done: false },
    { name: '6. TESTING: Edge case verification & load validation', done: false },
    { name: '7. IMPROVEMENT: Refinement & optimization', done: false },
  ]);

  const toggleStep = (index: number) => {
    setPipelineSteps((prev) =>
      prev.map((s, i) => (i === index ? { ...s, done: !s.done } : s))
    );
  };

  const handleRunCode = () => {
    const logs: string[] = [];
    const customConsole = {
      log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
      error: (...args: any[]) => logs.push(`[ERROR] ` + args.map(a => String(a)).join(' ')),
      warn: (...args: any[]) => logs.push(`[WARN] ` + args.map(a => String(a)).join(' ')),
    };

    try {
      // Remove typescript type annotations simply for client execution
      const jsCode = code
        .replace(/:\s*(string|number|boolean|any|void|Task|Task\[\]|string\[\]|Record<[^>]+>)/g, '')
        .replace(/interface\s+[\s\S]*?\}/g, '')
        .replace(/type\s+[\s\S]*?;/g, '')
        .replace(/<[^>]+>/g, '');

      const runFn = new Function('console', jsCode);
      runFn(customConsole);
      setConsoleOutput(logs.length > 0 ? logs : ['[Code executed successfully with no output]']);
    } catch (err: any) {
      setConsoleOutput([`[Runtime Exception]: ${err.message}`]);
    }
  };

  const handleAskArchitect = async () => {
    if (!projectGoal.trim()) {
      alert('Please enter a project goal or feature description.');
      return;
    }
    setIsArchitecting(true);
    try {
      const res = await fetch('/api/ed/builder/architect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectGoal,
          techStack: language,
          currentCode: code,
        }),
      });
      const data = await res.json();
      if (data.result) {
        setArchitectureResult(data.result);
        // If code is inside the result, offer it
        const codeBlockMatch = data.result.match(/```(?:typescript|javascript|tsx|ts|js)?\n([\s\S]*?)```/);
        if (codeBlockMatch && codeBlockMatch[1]) {
          setCode(codeBlockMatch[1]);
        }
      }
    } catch (e: any) {
      alert('Architect query failed: ' + e.message);
    } finally {
      setIsArchitecting(false);
    }
  };

  const handleSaveProject = () => {
    const title = prompt('Enter a title for this code artifact:', 'ED Project Module');
    if (title) {
      onSaveToMemory(title, code, `Language: ${language}. Architecture pipeline steps tracked.`);
      alert('Project saved to ED Long-Term Memory Vault.');
    }
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full bg-slate-950 overflow-hidden pb-16">
      {/* Left Column: Code Editor & Runner */}
      <div className="flex-1 flex flex-col border-r border-slate-800 bg-slate-950 overflow-hidden">
        {/* Editor Toolbar */}
        <div className="h-12 border-b border-slate-800 bg-slate-900/60 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-200">
              <Code2 className="w-4 h-4 text-amber-400" />
              <span>ED BUILDER SANDBOX</span>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-slate-800 text-slate-300 text-xs px-2.5 py-1 rounded-md border border-slate-700 outline-none"
            >
              <option value="typescript">TypeScript</option>
              <option value="javascript">JavaScript</option>
              <option value="python">Python Spec</option>
              <option value="json">JSON Config</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveProject}
              className="flex items-center gap-1 text-xs text-slate-300 hover:text-slate-100 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
              title="Save to Memory Vault"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Save Vault</span>
            </button>
            <button
              onClick={handleRunCode}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-950 px-3 py-1 rounded-lg bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-sm shadow-emerald-400/20"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Simulation</span>
            </button>
          </div>
        </div>

        {/* Code Input Area */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            spellCheck={false}
            className="flex-1 w-full bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-200 resize-none border-none outline-none selection:bg-amber-500/30"
            placeholder="// Write or paste code here..."
          />
        </div>

        {/* Output Console Console */}
        <div className="h-44 border-t border-slate-800 bg-slate-900/90 flex flex-col">
          <div className="px-3 py-1.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>EXECUTION CONSOLE OUTPUT</span>
            </div>
            <button
              onClick={() => setConsoleOutput([])}
              className="text-[10px] text-slate-500 hover:text-slate-300"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-emerald-300 space-y-1 bg-black/40">
            {consoleOutput.map((log, i) => (
              <div key={i} className="leading-snug">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: ED Architect & Execution Pipeline */}
      <div className="w-full lg:w-96 flex flex-col bg-slate-900/40 overflow-y-auto p-4 space-y-6">
        {/* Architect Query Box */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-200">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>ED Software Architect</span>
          </div>
          <p className="text-xs text-slate-400">
            Describe what you want to build. ED will generate system architecture, core algorithms, and MVP milestones.
          </p>
          <textarea
            value={projectGoal}
            onChange={(e) => setProjectGoal(e.target.value)}
            rows={3}
            placeholder="e.g. Build an autonomous queue worker that aggregates RSS feeds, extracts keywords, and saves to local SQLite..."
            className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-amber-500/50 resize-none"
          />
          <button
            onClick={handleAskArchitect}
            disabled={isArchitecting}
            className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold transition-all disabled:opacity-50"
          >
            {isArchitecting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Architecting Solution...</span>
              </>
            ) : (
              <>
                <Cpu className="w-4 h-4" />
                <span>Generate Architecture & Code</span>
              </>
            )}
          </button>
        </div>

        {/* Execution Pipeline Tracker (Section 11) */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Execution Pipeline (Section 11)</span>
            </div>
            <span className="text-[10px] font-mono text-cyan-400">
              {pipelineSteps.filter((s) => s.done).length}/{pipelineSteps.length} Complete
            </span>
          </div>
          <div className="space-y-1.5">
            {pipelineSteps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => toggleStep(idx)}
                className="w-full flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 hover:bg-slate-950 border border-slate-800/80 text-left transition-colors text-xs"
              >
                {step.done ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-600 shrink-0" />
                )}
                <span className={step.done ? 'text-slate-300 line-through opacity-70' : 'text-slate-200 font-medium'}>
                  {step.name}
                </span>
              </button>
            ))}
          </div>
          <div className="text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
            <strong>ED Principle:</strong> Avoid building an empire before proving the first building works. Identify the smallest meaningful next step.
          </div>
        </div>

        {/* Architecture Result Breakdown */}
        {architectureResult && (
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-400">Architect Specification</span>
              <button
                onClick={() => setArchitectureResult('')}
                className="text-[10px] text-slate-500 hover:text-slate-300"
              >
                Dismiss
              </button>
            </div>
            <div className="text-xs text-slate-300 whitespace-pre-wrap max-h-60 overflow-y-auto leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800 font-sans">
              {architectureResult}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
