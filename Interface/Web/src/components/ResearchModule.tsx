import React, { useState } from 'react';
import { 
  Search, 
  Globe, 
  ExternalLink, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  BookOpen, 
  ArrowRight,
  Database,
  CheckCircle2,
  HelpCircle,
  TrendingUp
} from 'lucide-react';

interface ResearchModuleProps {
  onSaveToMemory: (title: string, content: string, tags: string[]) => void;
}

export const ResearchModule: React.FC<ResearchModuleProps> = ({ onSaveToMemory }) => {
  const [query, setQuery] = useState('');
  const [focus, setFocus] = useState<'all' | 'technical' | 'unconventional' | 'debunking'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [researchData, setResearchData] = useState<{
    text: string;
    sources: { title: string; uri: string }[];
    query: string;
  } | null>(null);

  const sampleQueries = [
    'Solid-state battery commercial readiness and real energy density vs lab claims',
    'Local LLM inference optimization on consumer GPUs: vLLM vs Ollama vs llama.cpp',
    'Nikola Tesla wireless energy transmission: engineering facts vs historical myths',
    'Decentralized autonomous AI agent coordination protocols 2025-2026',
  ];

  const handleSearch = async (targetQuery?: string) => {
    const q = targetQuery || query;
    if (!q.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/ed/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          focus,
        }),
      });
      const data = await res.json();
      setResearchData({
        text: data.text || '',
        sources: data.sources || [],
        query: q,
      });
    } catch (e: any) {
      alert('Research query error: ' + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveFindings = () => {
    if (!researchData) return;
    onSaveToMemory(
      `Research: ${researchData.query.slice(0, 40)}`,
      researchData.text,
      ['research', focus, 'grounded-intelligence']
    );
    alert('Research findings stored in ED Memory Vault.');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto pb-20 p-4 md:p-6">
      <div className="max-w-4xl w-full mx-auto space-y-6">
        {/* Header Title */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-mono font-semibold text-blue-400">
            <Search className="w-4 h-4" />
            <span>ED RESEARCH ENGINE</span>
          </div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">
            Grounded Intelligence & Evidence Investigation
          </h1>
          <p className="text-xs text-slate-400">
            Official sources first. Separate confirmed facts from rumors. Explore unconventional claims with rigorous evidence.
          </p>
        </div>

        {/* Search Bar & Focus Filters */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter research topic, technical inquiry, or claim to investigate..."
                className="w-full bg-slate-950 pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-blue-500/50"
              />
            </div>
            <button
              onClick={() => handleSearch()}
              disabled={!query.trim() || isLoading}
              className="px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 disabled:opacity-40 text-slate-950 font-semibold text-xs transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : (
                <Globe className="w-3.5 h-3.5" />
              )}
              <span>Investigate</span>
            </button>
          </div>

          {/* Focus Toggle */}
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 text-[11px] font-mono">Lens:</span>
            {[
              { id: 'all', label: 'Full Spectrum' },
              { id: 'technical', label: 'Technical & Benchmarks' },
              { id: 'unconventional', label: 'Unconventional Angles' },
              { id: 'debunking', label: 'Fact vs Myth Check' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFocus(f.id as any)}
                className={`px-2.5 py-1 rounded-lg transition-colors ${
                  focus === f.id
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-medium'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Suggested Queries */}
        {!researchData && !isLoading && (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400">Suggested Inquiries:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
              {sampleQueries.map((sq, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setQuery(sq);
                    handleSearch(sq);
                  }}
                  className="p-3 rounded-xl bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-blue-500/40 text-left text-xs text-slate-300 hover:text-blue-300 transition-all flex items-center justify-between group"
                >
                  <span className="line-clamp-2">{sq}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-blue-400 shrink-0 ml-2" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
            <div className="w-8 h-8 rounded-full border-2 border-blue-400 border-t-transparent animate-spin mx-auto" />
            <div className="text-sm font-semibold text-slate-200">Grounded Research in Progress</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Querying Google search indices, cross-referencing credible sources, and extracting grounded findings...
            </p>
          </div>
        )}

        {/* Research Result View */}
        {researchData && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Top Bar with actions */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800">
              <div className="text-xs text-slate-300">
                <span>Findings for: </span>
                <strong className="text-blue-300">"{researchData.query}"</strong>
              </div>
              <button
                onClick={handleSaveFindings}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-medium transition-colors"
              >
                <Database className="w-3.5 h-3.5" />
                <span>Save to Vault</span>
              </button>
            </div>

            {/* Sources grounding chips */}
            {researchData.sources.length > 0 && (
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  <span>Grounding Sources & References ({researchData.sources.length})</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {researchData.sources.map((src, idx) => (
                    <a
                      key={idx}
                      href={src.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 text-[11px] text-slate-300 hover:text-blue-300 transition-colors"
                    >
                      <span className="truncate max-w-xs">{src.title}</span>
                      <ExternalLink className="w-3 h-3 text-slate-500" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Research Report Content */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-sans">
              {researchData.text}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
