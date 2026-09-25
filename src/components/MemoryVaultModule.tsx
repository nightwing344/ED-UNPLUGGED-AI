import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Database, 
  Plus, 
  Search, 
  Trash2, 
  Tag, 
  Download, 
  Upload, 
  Sparkles, 
  Share2, 
  LayoutGrid, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Link2, 
  ArrowRight, 
  X, 
  Radio, 
  Check, 
  Layers,
  HelpCircle,
  Wand2,
  RefreshCw,
  CheckCircle2,
  Zap,
  ArrowUpRight
} from 'lucide-react';
import { ProjectMemoryItem, MemoryLink, MemoryRelationType, VaultTagSuggestion, MemoryCategory } from '../types';
import { MemoryGraphView } from './MemoryGraphView';
import { 
  isSpeechRecognitionSupported, 
  createSpeechRecognizer, 
  speakText, 
  stopSpeaking, 
  generateVaultVoiceBriefing 
} from '../utils/voice';
import { requestVaultTagSuggestions, CATEGORY_LABELS } from '../utils/vaultAI';

interface MemoryVaultProps {
  memories: ProjectMemoryItem[];
  links: MemoryLink[];
  runtimeMemoryFiles?: string[];
  onAddMemory: (item: Omit<ProjectMemoryItem, 'id' | 'lastUpdated'>) => void;
  onUpdateMemory?: (id: string, updates: Partial<ProjectMemoryItem>) => void;
  onDeleteMemory: (id: string) => void;
  onAddLink: (link: Omit<MemoryLink, 'id' | 'createdAt'>) => void;
  onDeleteLink: (linkId: string) => void;
  onExportJSON: () => void;
  onImportJSON: (file: File) => void;
}

export const MemoryVaultModule: React.FC<MemoryVaultProps> = ({
  memories,
  links,
  runtimeMemoryFiles = [],
  onAddMemory,
  onUpdateMemory,
  onDeleteMemory,
  onAddLink,
  onDeleteLink,
  onExportJSON,
  onImportJSON,
}) => {
  const [viewMode, setViewMode] = useState<'graph' | 'cards'>('graph');
  const [runtimeSearch, setRuntimeSearch] = useState('');
  const [runtimeSearchResults, setRuntimeSearchResults] = useState<Array<{
    path: string;
    line: number;
    preview: string;
  }>>([]);
  const [runtimeSearchBusy, setRuntimeSearchBusy] = useState(false);
  const [runtimeFileOpen, setRuntimeFileOpen] = useState<string | null>(null);
  const [runtimeFileContent, setRuntimeFileContent] = useState('');
  const [runtimeFileLoading, setRuntimeFileLoading] = useState(false);

  const [pendingMemoryProposals, setPendingMemoryProposals] = useState<Array<{
    id: string;
    title: string;
    category?: string;
    content: string;
    tags?: string[];
    createdAt?: string;
  }>>([]);
  const [pendingMemoryLoading, setPendingMemoryLoading] = useState(false);
  const [reviewingMemoryId, setReviewingMemoryId] = useState<string | null>(null);
  const [memoryReviewNotice, setMemoryReviewNotice] = useState<string | null>(null);

  const loadPendingMemories = async () => {
    setPendingMemoryLoading(true);

    try {
      const r = await fetch('/api/ed/memory/pending');
      const d = await r.json();

      if (d?.ok && Array.isArray(d.proposals)) {
        setPendingMemoryProposals(d.proposals);
      } else {
        setPendingMemoryProposals([]);
      }
    } catch {
      setPendingMemoryProposals([]);
      setMemoryReviewNotice('Unable to load pending memory proposals.');
    } finally {
      setPendingMemoryLoading(false);
    }
  };

  const reviewPendingMemory = async (
    id: string,
    action: 'approve' | 'reject'
  ) => {
    setReviewingMemoryId(id);
    setMemoryReviewNotice(null);

    try {
      const r = await fetch('/api/ed/memory/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action }),
      });

      const d = await r.json();

      if (!r.ok || !d?.ok) {
        throw new Error(d?.error || 'Memory review failed.');
      }

      setPendingMemoryProposals((prev) =>
        prev.filter((item) => item.id !== id)
      );

      setMemoryReviewNotice(
        action === 'approve'
          ? 'Memory approved and activated.'
          : 'Memory rejected and archived.'
      );
    } catch (error: any) {
      setMemoryReviewNotice(
        error?.message || 'Memory review failed.'
      );
    } finally {
      setReviewingMemoryId(null);
    }
  };

  useEffect(() => {
    loadPendingMemories();
  }, []);

  const openRuntimeFile = async (file: string) => {
    setRuntimeFileOpen(file);
    setRuntimeFileLoading(true);
    setRuntimeFileContent('');

    try {
      const r = await fetch(`/api/ed/memory/file?path=${encodeURIComponent(file)}`);
      const d = await r.json();
      setRuntimeFileContent(d?.content || d?.error || 'Unable to read file.');
    } catch {
      setRuntimeFileContent('Unable to read runtime memory file.');
    } finally {
      setRuntimeFileLoading(false);
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);

  // New Memory Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProjectMemoryItem['category']>('project');
  const [newDescription, setNewDescription] = useState('');
  const [newTags, setNewTags] = useState('');

  // Automated Tagging Engine State
  const [tagSuggestions, setTagSuggestions] = useState<VaultTagSuggestion | null>(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [autoSuggestEnabled, setAutoSuggestEnabled] = useState(true);
  const [lastAnalyzedKey, setLastAnalyzedKey] = useState<string>('');
  const [suggestionEngineNotice, setSuggestionEngineNotice] = useState<string | null>(null);

  // Existing Card Tagging Engine State
  const [cardSuggestionsMap, setCardSuggestionsMap] = useState<Record<string, VaultTagSuggestion>>({});
  const [loadingCardMap, setLoadingCardMap] = useState<Record<string, boolean>>({});
  const [activeCardDrawerId, setActiveCardDrawerId] = useState<string | null>(null);

  // Refs for speech recognition callbacks
  const newTitleRef = useRef(newTitle);
  const newDescriptionRef = useRef(newDescription);
  const newCategoryRef = useRef(newCategory);
  const newTagsRef = useRef(newTags);
  newTitleRef.current = newTitle;
  newDescriptionRef.current = newDescription;
  newCategoryRef.current = newCategory;
  newTagsRef.current = newTags;

  // Link Dialog State (for creating a link from a card)
  const [linkModalSourceId, setLinkModalSourceId] = useState<string | null>(null);
  const [cardLinkTargetId, setCardLinkTargetId] = useState<string>('');
  const [cardLinkRelation, setCardLinkRelation] = useState<MemoryRelationType>('governs');
  const [cardLinkLabel, setCardLinkLabel] = useState<string>('');

  // Voice Interaction State
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceStatusNotice, setVoiceStatusNotice] = useState<string | null>(null);
  const [isSpeakingBriefing, setIsSpeakingBriefing] = useState(false);
  const [speakingMemoryId, setSpeakingMemoryId] = useState<string | null>(null);

  // Voice Dictation Target (for form fields)
  const [dictationField, setDictationField] = useState<'title' | 'description' | 'search' | null>(null);

  const recognizerRef = useRef<{ start: () => void; stop: () => void; isListening: () => boolean } | null>(null);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Vault Items' },
    { id: 'legal', label: 'Legal & Family Law' },
    { id: 'decision', label: 'Architecture & Strategy' },
    { id: 'project', label: 'Projects & MVPs' },
    { id: 'architecture', label: 'Tech Stack Specs' },
    { id: 'preference', label: 'User Principles & Taste' },
    { id: 'context', label: 'Context & Influences' },
    { id: 'unfinished', label: 'Unfinished Work' },
  ];

  const filteredRuntimeFiles = useMemo(() => {
    const q = runtimeSearch.trim().toLowerCase();
    if (!q) return runtimeMemoryFiles;
    return runtimeMemoryFiles.filter((file) => file.toLowerCase().includes(q));
  }, [runtimeMemoryFiles, runtimeSearch]);

  useEffect(() => {
    const q = runtimeSearch.trim();

    if (!q) {
      setRuntimeSearchResults([]);
      return;
    }

    const controller = new AbortController();

    const timer = setTimeout(async () => {
      setRuntimeSearchBusy(true);

      try {
        const r = await fetch(
          `/api/ed/memory/search?q=${encodeURIComponent(q)}`,
          { signal: controller.signal }
        );

        const d = await r.json();

        if (d?.ok && Array.isArray(d.results)) {
          setRuntimeSearchResults(d.results);
        } else {
          setRuntimeSearchResults([]);
        }
      } catch {
        if (!controller.signal.aborted) setRuntimeSearchResults([]);
      } finally {
        if (!controller.signal.aborted) setRuntimeSearchBusy(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [runtimeSearch]);

  // Map of memories
  const memoryMap = useMemo(() => {
    return new Map(memories.map((m) => [m.id, m]));
  }, [memories]);

  // Filtered Memories for Cards
  const filteredMemories = memories.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Voice Recognition Setup
  useEffect(() => {
    if (!isSpeechRecognitionSupported()) return;

    recognizerRef.current = createSpeechRecognizer(
      (transcript, isFinal) => {
        setVoiceTranscript(transcript);

        // If dictating into a specific field
        if (dictationField === 'title') {
          setNewTitle((prev) => (prev ? prev + ' ' : '') + transcript);
          if (isFinal) setDictationField(null);
          return;
        }
        if (dictationField === 'description') {
          setNewDescription((prev) => (prev ? prev + ' ' : '') + transcript);
          if (isFinal) setDictationField(null);
          return;
        }
        if (dictationField === 'search') {
          setSearchQuery(transcript);
          if (isFinal) setDictationField(null);
          return;
        }

        // Voice Command Interpreter
        const lower = transcript.toLowerCase().trim();

        if (lower.includes('show graph') || lower.includes('graph view') || lower.includes('network view')) {
          setViewMode('graph');
          setVoiceStatusNotice('Switched to Graph View');
          setTimeout(() => setVoiceStatusNotice(null), 3000);
        } else if (lower.includes('show list') || lower.includes('cards') || lower.includes('grid view')) {
          setViewMode('cards');
          setVoiceStatusNotice('Switched to Card View');
          setTimeout(() => setVoiceStatusNotice(null), 3000);
        } else if (lower.includes('brief me') || lower.includes('briefing') || lower.includes('sitrep')) {
          handleTriggerVoiceBriefing();
        } else if (lower.includes('filter legal')) {
          setSelectedCategory('legal');
          setVoiceStatusNotice('Filtered: Legal');
          setTimeout(() => setVoiceStatusNotice(null), 3000);
        } else if (lower.includes('filter decision') || lower.includes('filter strategy')) {
          setSelectedCategory('decision');
          setVoiceStatusNotice('Filtered: Architecture & Strategy');
          setTimeout(() => setVoiceStatusNotice(null), 3000);
        } else if (lower.includes('filter all')) {
          setSelectedCategory('all');
          setVoiceStatusNotice('Filter cleared');
          setTimeout(() => setVoiceStatusNotice(null), 3000);
        } else if (lower.startsWith('search for ') || lower.startsWith('find ')) {
          const query = lower.replace(/^(search for|find)\s+/, '');
          setSearchQuery(query);
          setVoiceStatusNotice(`Searching: "${query}"`);
          setTimeout(() => setVoiceStatusNotice(null), 3000);
        } else if (lower.includes('add memory') || lower.includes('new memory')) {
          setIsAdding(true);
          const possibleTitle = lower.replace(/^(add memory|new memory)\s*/, '');
          if (possibleTitle) {
            setNewTitle(possibleTitle.charAt(0).toUpperCase() + possibleTitle.slice(1));
          }
          setVoiceStatusNotice('Opened Add Memory modal');
          setTimeout(() => setVoiceStatusNotice(null), 3000);
        } else if (lower.includes('suggest tags') || lower.includes('auto tag') || lower.includes('tag this')) {
          fetchTagSuggestions(newTitleRef.current, newDescriptionRef.current, true);
          setVoiceStatusNotice('Local Tagging Engine triggered by voice');
          setTimeout(() => setVoiceStatusNotice(null), 3000);
        } else if (lower.includes('apply tags') || lower.includes('apply all') || lower.includes('apply suggestions')) {
          handleApplyAllSuggestions();
          setVoiceStatusNotice('Applied local suggestions');
          setTimeout(() => setVoiceStatusNotice(null), 3000);
        }
      },
      (err) => {
        setVoiceStatusNotice(`Microphone notice: ${err}`);
        setIsListening(false);
        setDictationField(null);
        setTimeout(() => setVoiceStatusNotice(null), 4000);
      },
      () => {
        setIsListening(false);
        setDictationField(null);
      }
    );
  }, [dictationField]);

  // Toggle Global Voice Listening
  const toggleListening = (field?: 'title' | 'description' | 'search') => {
    if (!isSpeechRecognitionSupported()) {
      alert('Speech Recognition is not supported by your current browser. Try Chrome, Edge, or Safari.');
      return;
    }

    if (isListening) {
      recognizerRef.current?.stop();
      setIsListening(false);
      setDictationField(null);
    } else {
      setDictationField(field || null);
      setVoiceTranscript('');
      recognizerRef.current?.start();
      setIsListening(true);
      setVoiceStatusNotice(
        field 
          ? `Dictating into ${field}... Speak now` 
          : 'Voice Command Active: try "Show graph", "Filter legal", or "Brief me"'
      );
      setTimeout(() => setVoiceStatusNotice(null), 4500);
    }
  };

  // Trigger Audio Voice Briefing
  const handleTriggerVoiceBriefing = () => {
    if (isSpeakingBriefing) {
      stopSpeaking();
      setIsSpeakingBriefing(false);
      return;
    }

    const briefingText = generateVaultVoiceBriefing(memories, links);
    setIsSpeakingBriefing(true);
    setVoiceStatusNotice('ED Voice Sitrep Briefing active...');

    speakText(briefingText, {
      onEnd: () => {
        setIsSpeakingBriefing(false);
        setVoiceStatusNotice(null);
      },
    });
  };

  // Speak Individual Memory
  const handleSpeakSingleMemory = (item: ProjectMemoryItem) => {
    if (speakingMemoryId === item.id) {
      stopSpeaking();
      setSpeakingMemoryId(null);
      return;
    }

    const incoming = links.filter((l) => l.targetId === item.id);
    const outgoing = links.filter((l) => l.sourceId === item.id);

    let text = `${item.title}. Category: ${item.category}. Content: ${item.description}. `;
    if (outgoing.length > 0) {
      const outNames = outgoing.map((l) => {
        const target = memoryMap.get(l.targetId);
        return `${l.relationType} ${target?.title || 'destination'}`;
      });
      text += `This memory forward links to: ${outNames.join(', ')}. `;
    }
    if (incoming.length > 0) {
      const inNames = incoming.map((l) => {
        const src = memoryMap.get(l.sourceId);
        return `${l.relationType} by ${src?.title || 'source'}`;
      });
      text += `Inbound dependencies: ${inNames.join(', ')}. `;
    }

    setSpeakingMemoryId(item.id);
    speakText(text, {
      onEnd: () => setSpeakingMemoryId(null),
    });
  };

  // Automated Tagging Engine: Request suggestions locally
  const fetchTagSuggestions = async (title: string, desc: string, force = false) => {
    const cleanTitle = title.trim();
    const cleanDesc = desc.trim();
    if (!cleanTitle && !cleanDesc) return;
    if (cleanTitle.length < 3 && cleanDesc.length < 8 && !force) return;

    const key = `${cleanTitle}:::${cleanDesc}`;
    if (!force && key === lastAnalyzedKey) return;

    setIsLoadingSuggestions(true);
    setSuggestionEngineNotice(null);
    try {
      const existingTagsList = newTagsRef.current
        .split(',')
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const result = await requestVaultTagSuggestions({
        title: cleanTitle,
        description: cleanDesc,
        currentCategory: newCategoryRef.current,
        existingTags: existingTagsList,
      });

      setTagSuggestions(result);
      setLastAnalyzedKey(key);
    } catch (err: any) {
      console.error('Failed to get local tag suggestions:', err);
      setSuggestionEngineNotice('Automated tagging running in resilient mode.');
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  // Debounced auto-suggestion trigger when user types title or description
  useEffect(() => {
    if (!isAdding || !autoSuggestEnabled) return;
    const cleanTitle = newTitle.trim();
    const cleanDesc = newDescription.trim();
    if (cleanTitle.length < 3 && cleanDesc.length < 8) return;

    const timer = setTimeout(() => {
      fetchTagSuggestions(cleanTitle, cleanDesc);
    }, 700);

    return () => clearTimeout(timer);
  }, [newTitle, newDescription, isAdding, autoSuggestEnabled]);

  // Apply single recommended category
  const handleApplyRecommendedCategory = (category: MemoryCategory) => {
    setNewCategory(category);
    setVoiceStatusNotice(`Category set to: ${CATEGORY_LABELS[category] || category}`);
    setTimeout(() => setVoiceStatusNotice(null), 2500);
  };

  // Toggle single tag in newTags input
  const handleToggleSuggestedTag = (tag: string) => {
    const cleanTag = tag.trim().toLowerCase();
    const currentTags = newTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    let updated: string[];
    if (currentTags.includes(cleanTag)) {
      updated = currentTags.filter((t) => t !== cleanTag);
    } else {
      updated = [...currentTags, cleanTag];
    }
    setNewTags(updated.join(', '));
  };

  // Apply all suggested tags
  const handleApplyAllSuggestedTags = () => {
    if (!tagSuggestions || !tagSuggestions.tags.length) return;
    const currentTags = newTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean);

    const merged = Array.from(new Set([...currentTags, ...tagSuggestions.tags.map((t) => t.toLowerCase())]));
    setNewTags(merged.join(', '));
  };

  // Apply both recommended category and all suggested tags
  const handleApplyAllSuggestions = () => {
    if (!tagSuggestions) return;
    setNewCategory(tagSuggestions.category);
    handleApplyAllSuggestedTags();
    setVoiceStatusNotice(`Applied Gemini Category (${CATEGORY_LABELS[tagSuggestions.category]}) & ${tagSuggestions.tags.length} Tags`);
    setTimeout(() => setVoiceStatusNotice(null), 3000);
  };

  // Existing memory card enhancement
  const handleFetchCardSuggestions = async (item: ProjectMemoryItem) => {
    if (activeCardDrawerId === item.id) {
      setActiveCardDrawerId(null);
      return;
    }
    setActiveCardDrawerId(item.id);
    if (cardSuggestionsMap[item.id]) return;

    setLoadingCardMap((prev) => ({ ...prev, [item.id]: true }));
    try {
      const suggestions = await requestVaultTagSuggestions({
        title: item.title,
        description: item.description,
        currentCategory: item.category,
        existingTags: item.tags,
      });
      setCardSuggestionsMap((prev) => ({ ...prev, [item.id]: suggestions }));
    } catch (err) {
      console.error('Error fetching card suggestions:', err);
    } finally {
      setLoadingCardMap((prev) => ({ ...prev, [item.id]: false }));
    }
  };

  const handleApplyCardTags = (item: ProjectMemoryItem, tagsToApply: string[], newCategoryTarget?: MemoryCategory) => {
    if (!onUpdateMemory) return;
    const mergedTags = Array.from(new Set([...item.tags, ...tagsToApply.map((t) => t.toLowerCase())]));
    const updates: Partial<ProjectMemoryItem> = {
      tags: mergedTags,
    };
    if (newCategoryTarget) {
      updates.category = newCategoryTarget;
    }
    onUpdateMemory(item.id, updates);
    setActiveCardDrawerId(null);
  };

  // Form Submit: Create Memory
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
    setTagSuggestions(null);
    setLastAnalyzedKey('');
    setIsAdding(false);
  };

  // Card Link Creation Form Submit
  const handleCreateCardLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkModalSourceId || !cardLinkTargetId) return;

    onAddLink({
      sourceId: linkModalSourceId,
      targetId: cardLinkTargetId,
      relationType: cardLinkRelation,
      label: cardLinkLabel.trim() || undefined,
    });

    setLinkModalSourceId(null);
    setCardLinkTargetId('');
    setCardLinkLabel('');
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJSON(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-y-auto pb-20 p-4 md:p-6" id="memory-vault-module">
      <div className="mb-4 rounded-xl border border-amber-800/60 bg-amber-950/20 p-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-amber-300">
              Pending Memory Review
            </div>
            <div className="mt-0.5 text-[10px] text-slate-500">
              Nothing becomes active memory until you approve it.
            </div>
          </div>

          <button
            onClick={loadPendingMemories}
            disabled={pendingMemoryLoading}
            className="rounded-lg border border-slate-700 p-1.5 text-slate-400 hover:text-amber-300 disabled:opacity-50"
            title="Refresh pending memory"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${pendingMemoryLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {memoryReviewNotice && (
          <div className="mt-2 rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-2 text-[10px] text-slate-300">
            {memoryReviewNotice}
          </div>
        )}

        <div className="mt-3 space-y-2">
          {pendingMemoryProposals.map((proposal) => (
            <div
              key={proposal.id}
              className="rounded-lg border border-amber-900/50 bg-slate-950/70 p-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-xs font-semibold text-slate-200">
                    {proposal.title || 'Untitled Memory'}
                  </div>
                  <div className="mt-1 font-mono text-[9px] text-slate-500">
                    {proposal.id}
                    {proposal.category ? ` • ${proposal.category}` : ''}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => reviewPendingMemory(proposal.id, 'approve')}
                    disabled={reviewingMemoryId === proposal.id}
                    className="flex items-center gap-1 rounded-lg border border-emerald-700/60 bg-emerald-950/40 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-300 hover:bg-emerald-900/40 disabled:opacity-50"
                  >
                    <Check className="h-3 w-3" />
                    Approve
                  </button>

                  <button
                    onClick={() => reviewPendingMemory(proposal.id, 'reject')}
                    disabled={reviewingMemoryId === proposal.id}
                    className="flex items-center gap-1 rounded-lg border border-red-800/60 bg-red-950/30 px-2.5 py-1.5 text-[10px] font-semibold text-red-300 hover:bg-red-900/30 disabled:opacity-50"
                  >
                    <X className="h-3 w-3" />
                    Reject
                  </button>
                </div>
              </div>

              <div className="mt-2 whitespace-pre-wrap text-[11px] leading-relaxed text-slate-300">
                {proposal.content}
              </div>

              {proposal.tags && proposal.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {proposal.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 text-[9px] text-slate-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}

          {!pendingMemoryLoading && pendingMemoryProposals.length === 0 && (
            <div className="text-[10px] text-slate-500">
              No memory proposals are waiting for review.
            </div>
          )}
        </div>
      </div>

      <div className="mb-4 rounded-xl border border-cyan-900/60 bg-cyan-950/20 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-cyan-300">ED Runtime Memory</span>
          <span className="font-mono text-xs text-cyan-400">{runtimeMemoryFiles.length} files</span>
        </div>

        <input
          value={runtimeSearch}
          onChange={(e) => setRuntimeSearch(e.target.value)}
          placeholder="Search runtime memory..."
          className="mt-3 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-600"
        />

        <div className="mt-2 max-h-52 space-y-1 overflow-auto font-mono text-[10px] text-slate-400">
          {filteredRuntimeFiles.slice(0, 20).map((file) => (
            <button
              key={file}
              onClick={() => openRuntimeFile(file)}
              className="block w-full truncate text-left hover:text-cyan-300"
            >
              • {file}
            </button>
          ))}

          {filteredRuntimeFiles.length === 0 && (
            <div className="text-slate-500">No runtime memory files match.</div>
          )}

          {filteredRuntimeFiles.length > 20 && (
            <div className="text-cyan-500">
              + {filteredRuntimeFiles.length - 20} more matches
            </div>
          )}
        </div>

        {runtimeSearch.trim() && (
          <div className="mt-3 border-t border-slate-800 pt-3">
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-cyan-400">
              Content Matches
              {runtimeSearchBusy ? ' — searching...' : ` — ${runtimeSearchResults.length}`}
            </div>

            <div className="max-h-48 space-y-2 overflow-auto">
              {runtimeSearchResults.slice(0, 20).map((result, i) => (
                <button
                  key={`${result.path}-${result.line}-${i}`}
                  onClick={() => openRuntimeFile(result.path)}
                  className="block w-full rounded border border-slate-800 bg-slate-950/70 p-2 text-left hover:border-cyan-800"
                >
                  <div className="truncate font-mono text-[10px] text-cyan-300">
                    {result.path}:{result.line}
                  </div>
                  <div className="mt-1 text-[10px] text-slate-400">
                    {result.preview}
                  </div>
                </button>
              ))}

              {!runtimeSearchBusy && runtimeSearchResults.length === 0 && (
                <div className="text-[10px] text-slate-500">
                  No content matches found.
                </div>
              )}
            </div>
          </div>
        )}

        {runtimeFileOpen && (
          <div className="mt-3 rounded-lg border border-slate-700 bg-slate-950 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="truncate font-mono text-[10px] text-cyan-300">
                {runtimeFileOpen}
              </span>

              <button
                onClick={() => setRuntimeFileOpen(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <pre className="max-h-72 overflow-auto whitespace-pre-wrap text-[11px] text-slate-300">
              {runtimeFileLoading ? 'Loading runtime memory...' : runtimeFileContent}
            </pre>
          </div>
        )}
      </div>
      <div className="max-w-6xl w-full mx-auto space-y-5">
        
        {/* Top Header & Core Tools */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-mono font-semibold text-cyan-400">
              <Database className="w-4 h-4" />
              <span>ED KNOWLEDGE VAULT & NEURAL GRAPH</span>
            </div>
            <h1 className="text-xl font-bold text-slate-100 tracking-tight">
              Visual Memory Links & Voice-Powered Knowledge Web
            </h1>
            <p className="text-xs text-slate-400">
              Map cross-cutting connections between Legal stipulations, Strategic decisions, and Architecture specs with voice interaction.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('graph')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'graph'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Interactive Visual Graph View"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Graph View</span>
              </button>
              <button
                onClick={() => setViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'cards'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Structured Cards View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Cards View</span>
              </button>
            </div>

            {/* Voice Sitrep Briefing Button */}
            <button
              onClick={handleTriggerVoiceBriefing}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                isSpeakingBriefing
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title="Listen to ED speak an audio status report of vault memories & links"
            >
              {isSpeakingBriefing ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isSpeakingBriefing ? 'Stop Briefing' : 'Voice Sitrep'}</span>
            </button>

            {/* Global Voice Listening Mic Button */}
            <button
              onClick={() => toggleListening()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                isListening
                  ? 'bg-red-500/20 text-red-300 border-red-500/50 shadow-sm shadow-red-500/20 animate-pulse'
                  : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
              }`}
              title={isListening ? 'Stop voice listener' : 'Activate Voice Commands'}
            >
              {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{isListening ? 'Listening...' : 'Voice Control'}</span>
            </button>

            {/* Import / Export */}
            <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
              <input type="file" accept=".json" onChange={handleFileInput} className="hidden" />
            </label>
            <button
              onClick={onExportJSON}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs text-slate-300 transition-colors"
              title="Export Vault with Visual Links to JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>

            {/* Add Memory Button */}
            <button
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm shadow-cyan-500/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Memory</span>
            </button>
          </div>
        </div>

        {/* Voice Feedback Banner (when listening or speaking) */}
        {(isListening || isSpeakingBriefing || voiceStatusNotice || voiceTranscript) && (
          <div className="p-3 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900 border border-cyan-500/30 flex items-center justify-between gap-3 shadow-md animate-in fade-in duration-200">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                {isSpeakingBriefing ? (
                  <Volume2 className="w-4 h-4 animate-bounce" />
                ) : (
                  <Mic className="w-4 h-4 text-cyan-400 animate-pulse" />
                )}
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                  <span>{isSpeakingBriefing ? 'ED Voice Briefing in Progress' : 'Voice Interaction Channel Active'}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  {voiceStatusNotice || (voiceTranscript ? `"${voiceTranscript}"` : 'Say commands: "show graph", "filter legal", "brief me", or "search [keyword]"')}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isListening && (
                <button
                  onClick={() => toggleListening()}
                  className="px-2.5 py-1 rounded-lg bg-red-950/40 text-red-300 border border-red-800/50 hover:bg-red-900/60 text-[11px] font-medium"
                >
                  Mute Mic
                </button>
              )}
              {isSpeakingBriefing && (
                <button
                  onClick={handleTriggerVoiceBriefing}
                  className="px-2.5 py-1 rounded-lg bg-amber-950/40 text-amber-300 border border-amber-800/50 hover:bg-amber-900/60 text-[11px] font-medium"
                >
                  Stop Audio
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search memories, visual links, legal custody, architectures, decisions..."
                className="w-full bg-slate-950 pl-9 pr-10 py-2 rounded-xl border border-slate-800 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50"
              />
              <button
                type="button"
                onClick={() => toggleListening('search')}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors ${
                  isListening && dictationField === 'search'
                    ? 'text-red-400 bg-red-950/40 animate-pulse'
                    : 'text-slate-500 hover:text-cyan-400'
                }`}
                title="Voice search dictation"
              >
                <Mic className="w-3.5 h-3.5" />
              </button>
            </div>

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2.5 py-2 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/60">
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                    selectedCategory === c.id
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium shadow-xs'
                      : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-3">
              <span className="text-cyan-400 font-semibold">{memories.length} Memories</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400 font-semibold">{links.length} Visual Links</span>
            </div>
          </div>
        </div>

        {/* Create Memory Modal / Expandable Card */}
        {isAdding && (
          <form onSubmit={handleCreate} className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/40 space-y-3.5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider font-mono">Create Memory Entry</span>
              </div>
              <button type="button" onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-slate-300">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] text-slate-400">Title:</label>
                  <button
                    type="button"
                    onClick={() => toggleListening('title')}
                    className={`flex items-center gap-1 text-[10px] ${
                      isListening && dictationField === 'title' ? 'text-red-400 font-bold animate-pulse' : 'text-cyan-400 hover:underline'
                    }`}
                  >
                    <Mic className="w-3 h-3" />
                    <span>{isListening && dictationField === 'title' ? 'Listening...' : 'Voice Dictate'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Legal Custody Agreement or Database Architecture"
                  className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400">Category:</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none"
                >
                  <option value="legal">Legal & Risk Audit</option>
                  <option value="decision">Architecture Decision / Strategy</option>
                  <option value="project">Project / MVP</option>
                  <option value="architecture">Tech Stack Spec</option>
                  <option value="preference">User Principle / Taste</option>
                  <option value="context">Context & Influences</option>
                  <option value="unfinished">Unfinished Work</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-slate-400">Memory Content & Constraints:</label>
                <button
                  type="button"
                  onClick={() => toggleListening('description')}
                  className={`flex items-center gap-1 text-[10px] ${
                    isListening && dictationField === 'description' ? 'text-red-400 font-bold animate-pulse' : 'text-cyan-400 hover:underline'
                  }`}
                >
                  <Mic className="w-3 h-3" />
                  <span>{isListening && dictationField === 'description' ? 'Dictating...' : 'Voice Dictate'}</span>
                </button>
              </div>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                rows={3}
                placeholder="Explain the statutory terms, technical choices, or philosophical commitments..."
                className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-500/50 resize-none"
                required
              />
            </div>

            {/* AUTOMATED TAGGING ENGINE (GEMINI 3.8 FLASH) */}
            <div className="space-y-2">
              {isLoadingSuggestions && (
                <div className="p-3 rounded-xl bg-cyan-950/25 border border-cyan-500/40 flex items-center justify-between gap-3 text-xs text-cyan-300 animate-pulse">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span className="font-mono font-medium">Local heuristic tagging engine analyzing semantic context...</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                    AI Analyzing
                  </span>
                </div>
              )}

              {tagSuggestions && !isLoadingSuggestions && (
                <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-900 via-slate-900/95 to-cyan-950/20 border border-cyan-500/40 space-y-3 shadow-lg animate-in fade-in duration-200">
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <Sparkles className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-cyan-200 font-mono">Local Automated Tagging Engine</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                            {tagSuggestions.confidence}% Confidence
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400">Contextual category recommendation and semantic tags</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fetchTagSuggestions(newTitle, newDescription, true)}
                        className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] flex items-center gap-1 transition-colors"
                        title="Re-run local classification"
                      >
                        <RefreshCw className="w-3 h-3 text-slate-400" />
                        <span>Re-analyze</span>
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyAllSuggestions}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[10px] font-semibold flex items-center gap-1 shadow-xs transition-all"
                        title="Apply recommended category and add all suggested tags"
                      >
                        <Zap className="w-3 h-3" />
                        <span>Apply All</span>
                      </button>
                    </div>
                  </div>

                  {/* Category Recommendation Row */}
                  <div className="space-y-1.5 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-slate-400 font-mono">Recommended Category:</span>
                        <button
                          type="button"
                          onClick={() => handleApplyRecommendedCategory(tagSuggestions.category)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold font-mono transition-all ${
                            newCategory === tagSuggestions.category
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs'
                              : 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/25'
                          }`}
                        >
                          {newCategory === tagSuggestions.category ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                          )}
                          <span>{tagSuggestions.categoryLabel || CATEGORY_LABELS[tagSuggestions.category]}</span>
                          {newCategory !== tagSuggestions.category ? (
                            <span className="text-[10px] text-cyan-400 underline ml-1 font-normal">(Tap to apply)</span>
                          ) : (
                            <span className="text-[10px] text-emerald-400 ml-1 font-normal">✓ Active</span>
                          )}
                        </button>
                      </div>

                      {/* Alternate Categories */}
                      {tagSuggestions.alternativeCategories && tagSuggestions.alternativeCategories.length > 0 && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-400">
                          <span>Alternative:</span>
                          {tagSuggestions.alternativeCategories.map((alt) => (
                            <button
                              key={alt.category}
                              type="button"
                              onClick={() => handleApplyRecommendedCategory(alt.category)}
                              className={`px-1.5 py-0.5 rounded text-[10px] border transition-colors ${
                                newCategory === alt.category
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border-slate-800'
                              }`}
                              title={alt.reason}
                            >
                              {alt.label || CATEGORY_LABELS[alt.category]} ({alt.confidence}%)
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    {tagSuggestions.reasoning && (
                      <p className="text-[11px] text-slate-400 italic leading-relaxed">
                        "{tagSuggestions.reasoning}"
                      </p>
                    )}
                  </div>

                  {/* Suggested Tags Tray */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-mono flex items-center gap-1.5">
                        <Tag className="w-3 h-3 text-cyan-400" />
                        <span>Suggested Semantic Tags (click tag to add / remove):</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleApplyAllSuggestedTags}
                        className="text-[10px] text-cyan-400 hover:text-cyan-300 underline font-mono"
                      >
                        + Add All Suggested Tags
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {tagSuggestions.tags.map((tag) => {
                        const currentTagList = newTags
                          .split(',')
                          .map((t) => t.trim().toLowerCase())
                          .filter(Boolean);
                        const isSelected = currentTagList.includes(tag.toLowerCase());

                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => handleToggleSuggestedTag(tag)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                              isSelected
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-xs'
                                : 'bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-cyan-500/50'
                            }`}
                            title={isSelected ? 'Click to remove tag' : 'Click to add tag to memory'}
                          >
                            {isSelected ? <Check className="w-3 h-3 text-emerald-400" /> : <Plus className="w-3 h-3 text-cyan-400" />}
                            <span>{tag}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] text-slate-400">Tags (comma separated):</label>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-[10px] text-slate-400 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={autoSuggestEnabled}
                      onChange={(e) => setAutoSuggestEnabled(e.target.checked)}
                      className="rounded border-slate-700 text-cyan-500 focus:ring-0 w-3 h-3 bg-slate-950"
                    />
                    <span>Auto-suggest on type</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => fetchTagSuggestions(newTitle, newDescription, true)}
                    disabled={isLoadingSuggestions || (!newTitle.trim() && !newDescription.trim())}
                    className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-mono disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Ask ED to analyze title and content to generate tags"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>{isLoadingSuggestions ? 'Analyzing...' : 'Suggest locally'}</span>
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                placeholder="e.g. family-law, custody, architecture, postgres"
                className="w-full bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-500/50 font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs"
              >
                Commit to Vault
              </button>
            </div>
          </form>
        )}

        {/* Modal: Quick Connect from Card */}
        {linkModalSourceId && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <form
              onSubmit={handleCreateCardLink}
              className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-2xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-sm font-bold text-slate-100">Establish Visual Link</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setLinkModalSourceId(null)}
                  className="text-slate-500 hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-500 font-mono">FROM (SOURCE MEMORY):</div>
                  <div className="text-xs font-semibold text-slate-200 mt-0.5">
                    {memoryMap.get(linkModalSourceId)?.title}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Relationship Direction & Semantics:</label>
                  <select
                    value={cardLinkRelation}
                    onChange={(e) => setCardLinkRelation(e.target.value as MemoryRelationType)}
                    className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
                  >
                    <option value="governs">Governs / Regulates (Legal & Policy Guardrails)</option>
                    <option value="influences">Influences / Informs (Mindset & Core Principles)</option>
                    <option value="implements">Implements / Realizes (Tactical Execution)</option>
                    <option value="strategic_risk">Strategic Risk / Vulnerability Warning</option>
                    <option value="depends_on">Depends On / Prerequisite Setup</option>
                    <option value="mitigates">Mitigates Risk / Defense Mechanism</option>
                    <option value="precedent_for">Legal Precedent For</option>
                    <option value="related_to">Direct Association / Synergy</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">TO (TARGET MEMORY):</label>
                  <select
                    value={cardLinkTargetId}
                    onChange={(e) => setCardLinkTargetId(e.target.value)}
                    className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
                    required
                  >
                    <option value="" disabled>Select target memory...</option>
                    {memories
                      .filter((m) => m.id !== linkModalSourceId)
                      .map((m) => (
                        <option key={m.id} value={m.id}>
                          [{m.category.toUpperCase()}] {m.title}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400">Custom Relationship Label (Optional):</label>
                  <input
                    type="text"
                    value={cardLinkLabel}
                    onChange={(e) => setCardLinkLabel(e.target.value)}
                    placeholder="e.g. Dictates custody asset trust, Governs database..."
                    className="w-full bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setLinkModalSourceId(null)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-400 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs"
                >
                  Save Connection
                </button>
              </div>
            </form>
          </div>
        )}

        {/* PRIMARY VIEW: GRAPH OR CARDS */}
        {viewMode === 'graph' ? (
          <div className="space-y-2">
            <MemoryGraphView
              memories={filteredMemories}
              links={links}
              onAddLink={onAddLink}
              onDeleteLink={onDeleteLink}
              onDeleteMemory={onDeleteMemory}
            />
          </div>
        ) : (
          /* Cards Grid View with Linked Chips */
          <div className="space-y-3">
            {filteredMemories.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs bg-slate-900/40 rounded-2xl border border-slate-800">
                No memory items match your search or filter.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredMemories.map((item) => {
                  const incoming = links.filter((l) => l.targetId === item.id);
                  const outgoing = links.filter((l) => l.sourceId === item.id);
                  const isSpeakingThis = speakingMemoryId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-3 group flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        {/* Header: Category, Date, Actions */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                                {item.category}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono">
                                {new Date(item.lastUpdated).toLocaleDateString()}
                              </span>
                            </div>
                            <h3 className="text-sm font-semibold text-slate-100">{item.title}</h3>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleSpeakSingleMemory(item)}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                isSpeakingThis
                                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 animate-pulse'
                                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800 border-transparent'
                              }`}
                              title={isSpeakingThis ? 'Stop voice readout' : 'Speak memory with ED voice'}
                            >
                              {isSpeakingThis ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => onDeleteMemory(item.id)}
                              className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-slate-800 transition-colors opacity-0 group-hover:opacity-100"
                              title="Delete Memory"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
                          {item.description}
                        </p>

                        {/* Visual Links Chips */}
                        {(outgoing.length > 0 || incoming.length > 0) && (
                          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                            <div className="text-[10px] font-mono text-slate-400 font-semibold flex items-center gap-1">
                              <Link2 className="w-3 h-3 text-cyan-400" />
                              <span>VISUAL LINKS:</span>
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                              {outgoing.map((link) => {
                                const target = memoryMap.get(link.targetId);
                                return (
                                  <div
                                    key={link.id}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-[10px] text-indigo-300 font-mono group/link"
                                    title={`Outgoing link: ${link.relationType} ${target?.title || ''}`}
                                  >
                                    <span className="font-bold">➔ {link.relationType}</span>
                                    <span className="text-slate-300 truncate max-w-[120px]">
                                      {target?.title || 'Connected node'}
                                    </span>
                                    <button
                                      onClick={() => onDeleteLink(link.id)}
                                      className="text-slate-500 hover:text-red-400 ml-0.5"
                                      title="Remove link"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                );
                              })}

                              {incoming.map((link) => {
                                const src = memoryMap.get(link.sourceId);
                                return (
                                  <div
                                    key={link.id}
                                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-300 font-mono group/link"
                                    title={`Inbound link: ${link.relationType} from ${src?.title || ''}`}
                                  >
                                    <span className="font-bold">⬅ {link.relationType}</span>
                                    <span className="text-slate-300 truncate max-w-[120px]">
                                      {src?.title || 'Source node'}
                                    </span>
                                    <button
                                      onClick={() => onDeleteLink(link.id)}
                                      className="text-slate-500 hover:text-red-400 ml-0.5"
                                      title="Remove link"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Tags */}
                        {item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
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

                      {/* Card Footer: Connect & Auto-Tag Buttons */}
                      <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              setLinkModalSourceId(item.id);
                              const other = memories.find((m) => m.id !== item.id);
                              if (other) setCardLinkTargetId(other.id);
                            }}
                            className="flex items-center gap-1 text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
                          >
                            <Link2 className="w-3.5 h-3.5" />
                            <span>+ Connect</span>
                          </button>

                          {onUpdateMemory && (
                            <button
                              onClick={() => handleFetchCardSuggestions(item)}
                              className={`flex items-center gap-1 text-[11px] transition-colors ${
                                activeCardDrawerId === item.id
                                  ? 'text-cyan-300 font-semibold'
                                  : 'text-slate-400 hover:text-cyan-300'
                              }`}
                              title="Generate AI tags & classification suggestions locally"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{loadingCardMap[item.id] ? 'Tagging...' : 'Auto-Tag'}</span>
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => setViewMode('graph')}
                          className="text-[11px] text-slate-500 hover:text-slate-300 flex items-center gap-1"
                        >
                          <span>View on Graph</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Card Inline Gemini Tag Drawer */}
                      {activeCardDrawerId === item.id && (
                        <div className="mt-2 p-3 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2 animate-in fade-in duration-150">
                          {loadingCardMap[item.id] ? (
                            <div className="flex items-center gap-2 text-xs text-cyan-300 font-mono py-1">
                              <Sparkles className="w-3.5 h-3.5 animate-spin" />
                              <span>Local analysis of memory item for tags & category...</span>
                            </div>
                          ) : cardSuggestionsMap[item.id] ? (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-[11px]">
                                <span className="text-cyan-300 font-semibold font-mono flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" />
                                  <span>Local Tag Recommendations</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleApplyCardTags(item, cardSuggestionsMap[item.id].tags, cardSuggestionsMap[item.id].category)}
                                  className="px-2 py-0.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-semibold"
                                >
                                  Apply AI Tags
                                </button>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {cardSuggestionsMap[item.id].tags.map((suggestedTag) => {
                                  const alreadyHas = item.tags.includes(suggestedTag.toLowerCase());
                                  return (
                                    <button
                                      key={suggestedTag}
                                      type="button"
                                      onClick={() => {
                                        if (alreadyHas) return;
                                        handleApplyCardTags(item, [suggestedTag]);
                                      }}
                                      className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-colors ${
                                        alreadyHas
                                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                          : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-cyan-500/40'
                                      }`}
                                    >
                                      {alreadyHas ? '✓ ' : '+ '}
                                      {suggestedTag}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          ) : null}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
