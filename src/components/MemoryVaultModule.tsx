import React, { useState } from 'react';
import { 
  Database, 
  Plus, 
  Search, 
  Trash2, 
  Tag, 
  Download, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  FileText, 
  Layers,
  Edit2,
  Save,
  X
} from 'lucide-react';
import { ProjectMemoryItem } from '../types';

interface MemoryVaultProps {
  memories: ProjectMemoryItem[];
  onAddMemory: (item: Omit<ProjectMemoryItem, 'id' | 'lastUpdated'>) => void;
  onDeleteMemory: (id: string) => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
}

export const MemoryVaultModule: React.FC<MemoryVaultProps> = ({
  memories,
  onAddMemory,
  onDeleteMemory,
  onExportJSON,
  onImportJSON,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);

  // New Memory Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProjectMemoryItem['category']>('project');
  const [newDescription, setNewDescription] = useState('');
  const [newTags, setNewTags] = useState('');

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Vault Items' },
    { id: 'project', label: 'Projects & MVPs' },
    { id: 'decision', label: 'Architecture Decisions' },
    { id: 'legal', label: 'Legal & Risk Audits' },
    { id: 'preference', label: 'User Principles & Taste' },
    { id: 'context', label: 'Context & Influences' },
    { id: 'architecture', label: 'Tech Stack Specs' },
    { id: 'unfinished', label: 'Unfinished Work' },
  ];

  const filteredMemories = memories.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim()) return;

    onAddMemory({
      title: newTitle.trim(),
      category: newCategory,
      description: newDescription.trim(),
      tags: newTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      status: 'active',
    });

    setNewTitle('');
    setNewDescription('');
    setNewTags('');
    setIsAdding(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJSON(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto pb-20 p-4 md:p-6">
      <div className="max-w-4xl w-full mx-auto space-y-6">
        {/* Top Title & Local-First Notice */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-mono font-semibold text-cyan-400">
              <Database className="w-4 h-4" />
              <span>ED LONG-TERM MEMORY VAULT</span>
            </div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
              Local-First Persistent Continuity & Decisions
            </h1>
            <p className="text-xs text-slate-400">
              Preserves project architectures, decisions, learned context, and personal philosophies across sessions.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Import JSON</span>
              <input type="file" accept=".json" onChange={handleFileInput} className="hidden" />
            </label>
            <button
              onClick={onExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Vault</span>
            </button>
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm shadow-cyan-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Memory</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memories, architectures, tags, decisions..."
              className="w-full bg-slate-950 pl-9 pr-4 py-2 rounded-xl border border-slate-800 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                    : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Add Memory Modal/Card */}
        {isAdding && (
          <form onSubmit={handleCreate} className="p-4 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-3 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-300">Create Memory Entry</span>
              <button type="button" onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Title:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Microservices Database Schema Decision"
                  className="w-full bg-slate-950 p-2 rounded-lg border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 p-2 rounded-lg border border-slate-800 text-xs text-slate-200 outline-none"
                >
                  <option value="project">Project / MVP</option>
                  <option value="decision">Architecture Decision</option>
                  <option value="legal">Legal & Risk Audit</option>
                  <option value="preference">User Principle / Taste</option>
                  <option value="context">Context & Influences</option>
                  <option value="architecture">Tech Stack Spec</option>
                  <option value="unfinished">Unfinished Work</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Memory Content & Details:</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
                placeholder="Explain the background, constraints, decision, or goals..."
                className="w-full bg-slate-950 p-2 rounded-lg border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-500/50 resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-slate-400">Tags (comma separated):</label>
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="e.g. database, postgres, local-first, tesla"
                className="w-full bg-slate-950 p-2 rounded-lg border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs"
              >
                Commit to Vault
              </button>
            </div>
          </form>
        )}

        {/* Memory Items List */}
        <div className="space-y-3">
          {filteredMemories.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs bg-slate-900/40 rounded-2xl border border-slate-800">
              No memory items match your search or filter.
            </div>
          ) : (
            filteredMemories.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors space-y-2.5 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                        {item.category}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Updated {new Date(item.lastUpdated).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-slate-100 mt-1">{item.title}</h3>
                  </div>

                  <button
                    onClick={() => onDeleteMemory(item.id)}
                    className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete Memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                  {item.description}
                </p>

                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                      >
                        <Tag className="w-2.5 h-2.5 text-slate-500" />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
