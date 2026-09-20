import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  Flame, 
  Zap, 
  Layers, 
  ShieldAlert, 
  TrendingUp, 
  Compass, 
  Save, 
  Check, 
  ArrowRight, 
  RefreshCw,
  GitBranch,
  BookOpen,
  FileText
} from 'lucide-react';
import { WhatIfScenario } from '../types';

interface WhatIfModuleProps {
  onSaveToMemory: (title: string, content: string, tags: string[]) => void;
  onNavigateModule?: (module: string) => void;
}

const PRESET_SCENARIOS = [
  {
    category: 'technological',
    title: 'Local Edge AI Replaces Cloud SaaS',
    prompt: 'What if small, quantized 7B-14B parameter models running on consumer laptops surpass centralized SaaS APIs for 90% of business logic within 2 years?',
  },
  {
    category: 'strategic',
    title: 'Zero-Cost Hardware & Open Robotics',
    prompt: 'What if open-source actuators and vision models drop physical automation robot costs to under $500 per unit?',
  },
  {
    category: 'legal_regulatory',
    title: 'Strict Data Sovereignty & Closed API Ban',
    prompt: 'What if international privacy laws prohibit sending user-generated business logic across foreign cloud servers?',
  },
  {
    category: 'black_swan',
    title: 'Global Submarine Cable / Internet Disruption',
    prompt: 'What if prolonged regional undersea fiber severances force critical software systems to operate offline-first on localized peer-to-peer mesh networks for 6 months?',
  },
  {
    category: 'counterfactual',
    title: 'Nikola Tesla Wireless Power Paradigm',
    prompt: 'What if Tesla\'s Wardenclyffe broadcast electrical power had received full commercial funding and become the global standard over copper grids?',
  },
  {
    category: 'personal_venture',
    title: 'Autonomous Solopreneur Operating System',
    prompt: 'What if a single self-taught builder using ED OS can execute the engineering, legal, marketing, and operational output of a 20-person startup?',
  },
];

export const WhatIfModule: React.FC<WhatIfModuleProps> = ({ onSaveToMemory, onNavigateModule }) => {
  const [prompt, setPrompt] = useState('');
  const [premiseCategory, setPremiseCategory] = useState<'technological' | 'strategic' | 'legal_regulatory' | 'black_swan' | 'counterfactual' | 'personal_venture'>('technological');
  const [depth, setDepth] = useState<'standard' | 'deep' | 'exhaustive'>('deep');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [history, setHistory] = useState<{ prompt: string; category: string; result: string; timestamp: number }[]>([]);

  const handleSimulate = async (scenarioPrompt?: string, category?: any) => {
    const activePrompt = scenarioPrompt || prompt;
    const activeCategory = category || premiseCategory;

    if (!activePrompt.trim() || isLoading) return;

    setIsLoading(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/ed/whatif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: activePrompt,
          premiseCategory: activeCategory,
          depth,
        }),
      });

      const data = await res.json();
      const outputText = data.rawAnalysis || 'Simulation completed with no textual output.';
      setCurrentResult(outputText);

      setHistory((prev) => [
        {
          prompt: activePrompt,
          category: activeCategory,
          result: outputText,
          timestamp: Date.now(),
        },
        ...prev.slice(0, 9),
      ]);
    } catch (err: any) {
      console.error('What-If simulation failed:', err);
      setCurrentResult(`Simulation failed to execute: ${err.message || 'Connection error'}. Please retry.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveVault = () => {
    if (!currentResult) return;
    const title = `What-If Scenario: ${prompt.slice(0, 40) || 'Hypothetical Simulation'}`;
    onSaveToMemory(title, currentResult, ['what-if', premiseCategory, 'scenario-simulation']);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-slate-950 text-slate-100 pb-16">
      {/* Left Control Sidebar */}
      <div className="w-full md:w-96 border-r border-slate-800 bg-slate-900/50 p-4 flex flex-col gap-4 overflow-y-auto shrink-0">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-100 tracking-tight">'What If' Scenario Generator</h2>
            <p className="text-xs text-slate-400">Hypothetical simulation & outcome engine</p>
          </div>
        </div>

        {/* Premise Category */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1.5 uppercase tracking-wider font-mono">
            Premise Category
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { id: 'technological', label: 'Tech / AI' },
              { id: 'strategic', label: 'Strategic Venture' },
              { id: 'legal_regulatory', label: 'Law / Regulation' },
              { id: 'black_swan', label: 'Black Swan Event' },
              { id: 'counterfactual', label: 'Counterfactual' },
              { id: 'personal_venture', label: 'Self-Built OS' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setPremiseCategory(cat.id as any)}
                className={`px-2.5 py-1.5 text-xs rounded-lg border text-left transition-all ${
                  premiseCategory === cat.id
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Prompt */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider font-mono">
            Hypothetical Scenario Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="What if we replace all external databases with an in-memory encrypted WAL engine on edge devices..."
            rows={4}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 resize-none font-sans"
          />
        </div>

        {/* Depth Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-1 font-mono uppercase tracking-wider">
            Analysis Rigor
          </label>
          <div className="flex gap-2">
            {(['standard', 'deep', 'exhaustive'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setDepth(lvl)}
                className={`flex-1 py-1 text-xs rounded-md border capitalize font-medium ${
                  depth === lvl
                    ? 'bg-slate-800 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Run Button */}
        <button
          onClick={() => handleSimulate()}
          disabled={isLoading || !prompt.trim()}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Simulating Scenario Vectors...</span>
            </>
          ) : (
            <>
              <Flame className="w-4 h-4" />
              <span>Run 'What If' Simulation</span>
            </>
          )}
        </button>

        {/* Preset Sparks */}
        <div className="pt-2 border-t border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 block mb-2 uppercase tracking-wider">
            Preset Exploration Sparks
          </span>
          <div className="flex flex-col gap-2">
            {PRESET_SCENARIOS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setPrompt(item.prompt);
                  setPremiseCategory(item.category as any);
                  handleSimulate(item.prompt, item.category);
                }}
                className="text-left p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-amber-300">
                    {item.title}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    {item.category.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {item.prompt}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Main Analysis Stage */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto p-4 md:p-6 space-y-6">
        {currentResult ? (
          <div className="space-y-6 max-w-4xl mx-auto w-full">
            {/* Top Action Bar */}
            <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-semibold text-emerald-400 uppercase">
                  Simulation Outcome Tree Computed
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveVault}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 border border-slate-700 transition-colors"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Saved to Vault</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-amber-400" />
                      <span>Save to Memory Vault</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Core Principle Badge */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-mono uppercase text-amber-300 font-bold tracking-wider mb-1">
                  ED Distinction Matrix: Practical Possibility vs Speculative Breakthrough
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  ED distinguishes between near-term engineering feasibility and paradigm-shifting speculative ideas so you can both plan pragmatically and prepare for high-leverage disruptions.
                </p>
              </div>
            </div>

            {/* Render Output Markdown */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl prose prose-invert max-w-none prose-headings:text-slate-100 prose-headings:font-bold prose-h3:text-amber-400 prose-h3:border-b prose-h3:border-slate-800 prose-h3:pb-1 prose-h3:text-sm prose-p:text-slate-300 prose-p:text-xs prose-p:leading-relaxed prose-li:text-xs prose-li:text-slate-300 prose-strong:text-slate-100">
              <div className="whitespace-pre-wrap font-sans text-xs text-slate-300 leading-relaxed space-y-4">
                {currentResult}
              </div>
            </div>

            {/* Next Vector Actions */}
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-semibold text-slate-200">Next Action Vectors:</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => onNavigateModule?.('strategy')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                  <span>Challenge in Strategy Engine</span>
                </button>
                <button
                  onClick={() => onNavigateModule?.('legal')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                  <span>Audit in Legal Assistant</span>
                </button>
                <button
                  onClick={() => onNavigateModule?.('research')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 flex items-center gap-1.5"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Ground with Research</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <HelpCircle className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-200 mb-1">Explore Hypothetical Horizons</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Test unconventional ideas, simulate black swan disruptions, explore technological shifts, and formulate robust contingency plans.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full pt-2">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-left">
                <span className="text-xs font-bold text-emerald-400 block mb-1">Practical Possibilities</span>
                <span className="text-[11px] text-slate-400">High probability, near-term trajectory, engineering feasibility.</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-left">
                <span className="text-xs font-bold text-amber-400 block mb-1">Speculative Ideas</span>
                <span className="text-[11px] text-slate-400">Paradigm-shifting, radical leverage, unexpected catalysts.</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
