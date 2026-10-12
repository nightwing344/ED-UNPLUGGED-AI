import React, { useState } from 'react';
import { 
  GitFork, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Layers, 
  ArrowRight, 
  HelpCircle,
  Database,
  Compass
} from 'lucide-react';

interface StrategyModuleProps {
  onSaveToMemory: (title: string, content: string, tags: string[]) => void;
}

export const StrategyModule: React.FC<StrategyModuleProps> = ({ onSaveToMemory }) => {
  const [problem, setProblem] = useState('');
  const [constraints, setConstraints] = useState('');
  const [assumptions, setAssumptions] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [strategyResult, setStrategyResult] = useState<string | null>(null);

  const sampleScenarios = [
    {
      title: 'Solo Developer Scaling Dilemma',
      problem: 'Need to build an AI workflow platform for high traffic without $10k/mo cloud infra bill or DevOps overhead.',
      constraints: 'Budget < $100/mo, Single engineer, Local-first privacy desired.',
      assumptions: 'Must use complex Kubernetes clusters and multi-region managed cloud databases.',
    },
    {
      title: 'High-Impact Career / Project Leverage',
      problem: 'Transitioning from generic software developer to creator of autonomous intelligence systems.',
      constraints: 'Limited time after family responsibilities.',
      assumptions: 'Must obtain an academic PhD or follow traditional corporate credential ladders.',
    },
    {
      title: 'Product Differentiation vs Big Tech',
      problem: 'Building personal productivity software when Apple, Google, and Microsoft already dominate standard note-taking.',
      constraints: 'Bootstrapped, cannot compete on raw compute or headcount.',
      assumptions: 'Must copy existing UI patterns (kanban boards, chat threads) with minimal tweaks.',
    }
  ];

  const handleGenerateStrategy = async (override?: { problem: string; constraints: string; assumptions: string }) => {
    const p = override?.problem || problem;
    const c = override?.constraints || constraints;
    const a = override?.assumptions || assumptions;

    if (!p.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/ed/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: p,
          constraints: c,
          assumptions: a,
        }),
      });
      const data = await res.json();
      setStrategyResult(data.strategyText || '');
    } catch (e: any) {
      alert('Strategy generation failed: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToVault = () => {
    if (!strategyResult) return;
    onSaveToMemory(
      `Strategy: ${problem.slice(0, 40)}`,
      strategyResult,
      ['strategy', 'decision-matrix', 'outside-the-box']
    );
    alert('Strategy brief saved to ED Memory Vault.');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto pb-20 p-4 md:p-6">
      <div className="max-w-4xl w-full mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-mono font-semibold text-purple-400">
            <GitFork className="w-4 h-4" />
            <span>ED STRATEGY & DECISION MATRIX</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">
            Assumption Challenging & Outside-The-Box Optimization
          </h1>
          <p className="text-xs text-slate-400">
            Is there a simpler way? A cheaper way? A faster way? What assumption is everyone else making incorrectly?
          </p>
        </div>

        {/* Strategy Input Form */}
        <div className="p-4 md:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">The Problem / Objective:</label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              rows={2}
              placeholder="What are you trying to accomplish or decide?"
              className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-purple-500/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Known Constraints & Limits:</label>
              <input
                type="text"
                value={constraints}
                onChange={(e) => setConstraints(e.target.value)}
                placeholder="e.g. Budget, time, hardware limits..."
                className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-purple-500/50"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Industry / Standard Assumptions:</label>
              <input
                type="text"
                value={assumptions}
                onChange={(e) => setAssumptions(e.target.value)}
                placeholder="e.g. How people usually solve this..."
                className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-purple-500/50"
              />
            </div>
          </div>

          <button
            onClick={() => handleGenerateStrategy()}
            disabled={!problem.trim() || isLoading}
            className="w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 disabled:opacity-40 text-slate-950 font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Formulating Strategic Vectors...</span>
              </>
            ) : (
              <>
                <Compass className="w-4 h-4" />
                <span>Challenge Assumptions & Generate Strategic Matrix</span>
              </>
            )}
          </button>
        </div>

        {/* Sample Strategic Scenarios */}
        {!strategyResult && !isLoading && (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400">Preset High-Leverage Scenarios:</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {sampleScenarios.map((sc, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setProblem(sc.problem);
                    setConstraints(sc.constraints);
                    setAssumptions(sc.assumptions);
                    handleGenerateStrategy(sc);
                  }}
                  className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-purple-500/40 text-left transition-all space-y-1.5 group"
                >
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-purple-300 flex items-center justify-between">
                    <span>{sc.title}</span>
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 text-purple-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed">
                    {sc.problem}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result Area */}
        {strategyResult && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-semibold text-purple-300">ED Strategic Vectors & Decision Matrix</span>
              <button
                onClick={handleSaveToVault}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-medium transition-colors"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Save Strategy to Vault</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {strategyResult}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
