import React, { useState } from 'react';
import { 
  Sparkles, 
  Palette, 
  Lightbulb, 
  Flame, 
  Layers, 
  Zap, 
  Radio, 
  Compass, 
  ArrowRight,
  Database,
  Feather
} from 'lucide-react';

interface CreativeModuleProps {
  onSaveToMemory: (title: string, content: string, tags: string[]) => void;
}

export const CreativeModule: React.FC<CreativeModuleProps> = ({ onSaveToMemory }) => {
  const [conceptType, setConceptType] = useState<'invention' | 'concept_art' | 'anatomy' | 'worldbuilding' | 'branding'>('invention');
  const [prompt, setPrompt] = useState('');
  const [selectedInfluences, setSelectedInfluences] = useState<string[]>([
    'Nikola Tesla',
    'Leonardo da Vinci',
    'Scott Robertson',
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [creativeOutput, setCreativeOutput] = useState<string | null>(null);

  const allInfluences = [
    { id: 'Nikola Tesla', label: 'Nikola Tesla', desc: 'Resonance, wireless energy, electromagnetic intuition' },
    { id: 'Leonardo da Vinci', label: 'Da Vinci', desc: 'Interdisciplinary mechanics, botanical & anatomical synthesis' },
    { id: 'Scott Robertson', label: 'Scott Robertson', desc: 'Industrial vehicle perspective, functional sci-fi machinery' },
    { id: 'George Bridgman', label: 'George Bridgman', desc: 'Constructive anatomical volumes & interlocking planar forms' },
    { id: 'Albrecht Dürer', label: 'Albrecht Dürer', desc: 'Intricate precision, master line work, proportion' },
    { id: 'Nu-Metal / Rap-Metal', label: 'Nu-Metal / Rap-Metal', desc: 'Raw emotional intensity, rhythmic power, genre innovation' },
    { id: 'Batman & Joker', label: 'Batman / Joker', desc: 'Psychological depth, strategic duality, moral tension' },
  ];

  const toggleInfluence = (inf: string) => {
    setSelectedInfluences((prev) =>
      prev.includes(inf) ? prev.filter((i) => i !== inf) : [...prev, inf]
    );
  };

  const sampleIdeas = [
    {
      type: 'invention',
      prompt: 'A bio-resonant passive atmospheric water & micro-power harvester for remote terrain.',
      influences: ['Nikola Tesla', 'Leonardo da Vinci'],
    },
    {
      type: 'concept_art',
      prompt: 'Heavy all-terrain autonomous rover designed for volcanic mining, with articulated hydraulic suspension and exposed turbine coolers.',
      influences: ['Scott Robertson', 'Albrecht Dürer'],
    },
    {
      type: 'anatomy',
      prompt: 'Biomechanical cybernetic torso showing interlocking deltoids, rib cage masses, and hydraulic flexor cords.',
      influences: ['George Bridgman', 'Leonardo da Vinci'],
    },
    {
      type: 'worldbuilding',
      prompt: 'A dieselpunk subterranean metropolis where electrical power is governed by sonic resonance towers and underground vigilantes.',
      influences: ['Nikola Tesla', 'Batman & Joker', 'Nu-Metal / Rap-Metal'],
    },
  ];

  const handleGenerate = async (overridePrompt?: string, overrideType?: any, overrideInf?: string[]) => {
    const p = overridePrompt || prompt;
    const t = overrideType || conceptType;
    const inf = overrideInf || selectedInfluences;

    if (!p.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/ed/creative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: p,
          conceptType: t,
          influences: inf,
        }),
      });
      const data = await res.json();
      setCreativeOutput(data.creativeText || '');
    } catch (e: any) {
      alert('Creative engine failed: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToVault = () => {
    if (!creativeOutput) return;
    onSaveToMemory(
      `Creative: ${prompt.slice(0, 40)}`,
      creativeOutput,
      ['creative', conceptType, ...selectedInfluences]
    );
    alert('Creative concept saved to ED Memory Vault.');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto pb-20 p-4 md:p-6">
      <div className="max-w-4xl w-full mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-mono font-semibold text-pink-400">
            <Sparkles className="w-4 h-4" />
            <span>ED CREATIVE & INVENTION STUDIO</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">
            Original Invention, Concept Design & Synthesis
          </h1>
          <p className="text-xs text-slate-400">
            Master fundamentals, then think beyond them. Interdisciplinary ideas infused with Tesla, Da Vinci, and Scott Robertson design mastery.
          </p>
        </div>

        {/* Input Card */}
        <div className="p-4 md:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          {/* Concept Type Selector */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'invention', label: 'Physical Invention & Mechanism', icon: Zap },
              { id: 'concept_art', label: 'Industrial / Vehicle Concept (Robertson)', icon: Palette },
              { id: 'anatomy', label: 'Constructive Anatomy (Bridgman)', icon: Layers },
              { id: 'worldbuilding', label: 'Worldbuilding & Psychology', icon: Flame },
              { id: 'branding', label: 'Lyrical & Sonic Branding', icon: Radio },
            ].map((t) => {
              const Icon = t.icon;
              const active = conceptType === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setConceptType(t.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    active
                      ? 'bg-pink-500 text-slate-950 font-semibold shadow-sm shadow-pink-500/20'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-950 border border-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>

          {/* Prompt textarea */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Concept Seed / Visual or Mechanical Vision:</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              placeholder="e.g. A multi-wheeled desert expedition vehicle powered by solar-thermal sterling engines, detailed with Scott Robertson industrial perspective and Bridgman geometric rhythm..."
              className="w-full bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-pink-500/50 resize-none"
            />
          </div>

          {/* Influence Toggles */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-slate-300">Infuse Intellectual & Creative Pillars:</div>
            <div className="flex flex-wrap gap-1.5">
              {allInfluences.map((inf) => {
                const selected = selectedInfluences.includes(inf.id);
                return (
                  <button
                    key={inf.id}
                    onClick={() => toggleInfluence(inf.id)}
                    title={inf.desc}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-colors border ${
                      selected
                        ? 'bg-pink-500/20 text-pink-300 border-pink-500/50 font-medium'
                        : 'text-slate-500 bg-slate-950/60 border-slate-800 hover:text-slate-300'
                    }`}
                  >
                    + {inf.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={() => handleGenerate()}
            disabled={!prompt.trim() || isLoading}
            className="w-full py-2.5 rounded-xl bg-pink-500 hover:bg-pink-400 disabled:opacity-40 text-slate-950 font-semibold text-xs transition-all flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Synthesizing Concept Blueprint...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Generate Creative Concept & Technical Art Blueprint</span>
              </>
            )}
          </button>
        </div>

        {/* Preset Concept Starters */}
        {!creativeOutput && !isLoading && (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400">Pillar Concept Seeds:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sampleIdeas.map((idea, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setPrompt(idea.prompt);
                    setConceptType(idea.type as any);
                    setSelectedInfluences(idea.influences);
                    handleGenerate(idea.prompt, idea.type, idea.influences);
                  }}
                  className="p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-pink-500/40 text-left transition-all space-y-2 group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-pink-300">
                      {idea.type}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-pink-400" />
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                    {idea.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result View */}
        {creativeOutput && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-xs font-semibold text-pink-300">ED Concept Blueprint & Design Specs</span>
              <button
                onClick={handleSaveToVault}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-pink-500/10 hover:bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-medium transition-colors"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Save to Vault</span>
              </button>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {creativeOutput}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
