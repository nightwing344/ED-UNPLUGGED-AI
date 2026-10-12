import React, { useState } from 'react';
import { 
  Cpu, 
  Play, 
  CheckCircle2, 
  Clock, 
  Terminal, 
  Search, 
  Code2, 
  Server, 
  Sparkles, 
  GitFork, 
  BookOpen, 
  Zap, 
  Scale,
  ArrowRight,
  Database,
  RefreshCw
} from 'lucide-react';
import { AgentTask } from '../types';

interface AgentsModuleProps {
  tasks: AgentTask[];
  onDispatchTask: (agentType: AgentTask['agentType'], title: string, objective: string) => Promise<void>;
  onSaveToMemory: (title: string, content: string, tags: string[]) => void;
}

export const AgentsModule: React.FC<AgentsModuleProps> = ({
  tasks,
  onDispatchTask,
  onSaveToMemory,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentTask['agentType']>('legal');
  const [taskTitle, setTaskTitle] = useState('');
  const [objective, setObjective] = useState('');
  const [isDispatching, setIsDispatching] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(tasks[0]?.id || null);

  const agentTypes: { id: AgentTask['agentType']; name: string; icon: any; color: string; desc: string }[] = [
    { id: 'legal', name: 'Legal & Family Law Agent', icon: Scale, color: 'text-indigo-400 border-indigo-500/40 bg-indigo-500/10', desc: 'Child custody schedules, divorce dissolution strategy, contracts & risk.' },
    { id: 'research', name: 'Research Agent', icon: Search, color: 'text-blue-400 border-blue-500/40 bg-blue-500/10', desc: 'Investigates ground truth, evaluates claims & compares sources.' },
    { id: 'coding', name: 'Coding Agent', icon: Code2, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10', desc: 'Designs software architecture, writes clean modular code & unit tests.' },
    { id: 'sysadmin', name: 'SysAdmin Agent', icon: Server, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10', desc: 'Linux configs, server setups, shell scripting & Docker setups.' },
    { id: 'creative', name: 'Creative Agent', icon: Sparkles, color: 'text-pink-400 border-pink-500/40 bg-pink-500/10', desc: 'Scott Robertson / Da Vinci concept designs & physical inventions.' },
    { id: 'strategy', name: 'Strategy Agent', icon: GitFork, color: 'text-purple-400 border-purple-500/40 bg-purple-500/10', desc: 'Challenges assumptions & formulates high-leverage decisions.' },
    { id: 'teacher', name: 'Teacher Agent', icon: BookOpen, color: 'text-cyan-400 border-cyan-500/40 bg-cyan-500/10', desc: 'First-principles pedagogy & conceptual mental models.' },
    { id: 'automation', name: 'Automation Agent', icon: Zap, color: 'text-orange-400 border-orange-500/40 bg-orange-500/10', desc: 'Pipeline orchestration, cron scripts & API connectors.' },
  ];

  const handleDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !objective.trim() || isDispatching) return;

    setIsDispatching(true);
    try {
      await onDispatchTask(selectedAgent, taskTitle, objective);
      setTaskTitle('');
      setObjective('');
    } catch (e: any) {
      alert('Agent dispatch failed: ' + e.message);
    } finally {
      setIsDispatching(false);
    }
  };

  const currentTask = tasks.find((t) => t.id === activeTaskId) || tasks[0];

  return (
    <div className="flex-1 flex flex-col lg:flex-row h-full bg-slate-950 overflow-hidden pb-16">
      {/* Left Column: Dispatcher Console & Roster */}
      <div className="w-full lg:w-96 border-r border-slate-800 bg-slate-950 flex flex-col overflow-y-auto p-4 space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-amber-400">
            <Cpu className="w-4 h-4" />
            <span>ED AGENT ORCHESTRATION</span>
          </div>
          <h2 className="text-base font-bold text-slate-100">Specialized Sub-Agents</h2>
          <p className="text-xs text-slate-400">
            Delegate specialized tasks to autonomous agents coordinated by ED Core.
          </p>
        </div>

        {/* Agent Selector Grid */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">Select Agent Role:</div>
          <div className="grid grid-cols-1 gap-1.5">
            {agentTypes.map((a) => {
              const Icon = a.icon;
              const isSelected = selectedAgent === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => setSelectedAgent(a.id)}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left border transition-all ${
                    isSelected
                      ? `${a.color} shadow-sm`
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold text-slate-200 truncate">{a.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{a.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dispatch Form */}
        <form onSubmit={handleDispatch} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 text-amber-400" />
            <span>Dispatch New Mission</span>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Task Title:</label>
            <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="e.g. Linux Kernel Tunables for Low Latency"
              className="w-full bg-slate-950 p-2 rounded-lg border border-slate-800 text-xs text-slate-200 outline-none focus:border-amber-500/50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] text-slate-400">Specific Objective & Instructions:</label>
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={3}
              placeholder="Provide exact requirements, expected code or analysis format..."
              className="w-full bg-slate-950 p-2 rounded-lg border border-slate-800 text-xs text-slate-200 outline-none focus:border-amber-500/50 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={!taskTitle.trim() || !objective.trim() || isDispatching}
            className="w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
          >
            {isDispatching ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Agent Executing Task...</span>
              </>
            ) : (
              <>
                <Cpu className="w-3.5 h-3.5" />
                <span>Launch Autonomous Agent</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Right Column: Mission Log & Output Artifacts */}
      <div className="flex-1 flex flex-col bg-slate-900/30 overflow-hidden">
        {/* Mission Tabs Bar */}
        <div className="h-12 border-b border-slate-800 bg-slate-950/80 px-4 flex items-center gap-2 overflow-x-auto">
          <div className="text-xs font-mono font-semibold text-slate-400 mr-2 shrink-0">ACTIVE MISSIONS:</div>
          {tasks.length === 0 ? (
            <span className="text-xs text-slate-600">No active tasks dispatched yet.</span>
          ) : (
            tasks.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTaskId(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                  activeTaskId === t.id
                    ? 'bg-amber-500/10 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{t.title}</span>
              </button>
            ))
          )}
        </div>

        {/* Task Details View */}
        {currentTask ? (
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {/* Header info */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {currentTask.agentType} Agent
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {new Date(currentTask.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100">{currentTask.title}</h3>
                <p className="text-xs text-slate-400">{currentTask.objective}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onSaveToMemory(
                      `Agent [${currentTask.agentType}]: ${currentTask.title}`,
                      currentTask.result || '',
                      ['agent', currentTask.agentType]
                    );
                    alert('Task artifact saved to ED Memory Vault.');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs transition-colors"
                >
                  <Database className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Save to Vault</span>
                </button>
              </div>
            </div>

            {/* Live Progress Logs */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>AGENT EXECUTION TRACE & REASONING LOGS</span>
              </div>
              <div className="space-y-1 font-mono text-xs text-slate-300 bg-black/50 p-3 rounded-xl border border-slate-900">
                {currentTask.logs.map((log, lIdx) => (
                  <div key={lIdx} className="flex items-start gap-2">
                    <span className="text-slate-600 shrink-0">[{new Date(log.time).toLocaleTimeString()}]</span>
                    <span className={log.type === 'code' ? 'text-amber-300' : 'text-slate-300'}>{log.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Final Deliverable Artifact */}
            {currentTask.result && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="text-xs font-semibold text-amber-400">FINAL DELIVERABLE & ARTIFACT</div>
                <div className="text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap font-sans bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                  {currentTask.result}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 space-y-3">
            <Cpu className="w-12 h-12 text-slate-700" />
            <div className="text-sm font-semibold text-slate-400">No Task Active</div>
            <p className="text-xs max-w-sm">
              Use the left console to select a specialized agent and dispatch a new autonomous mission.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
