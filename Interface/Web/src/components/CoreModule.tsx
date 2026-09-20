import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  RotateCcw, 
  Mic, 
  MicOff, 
  Volume2, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  Terminal, 
  Code2, 
  Copy, 
  Check, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  Scale,
  Database,
  Flame,
  BookmarkPlus
} from 'lucide-react';
import { EDMessage, ThinkingMode, TruthCategory, ProjectMemoryItem } from '../types';

interface CoreModuleProps {
  messages: EDMessage[];
  onSendMessage: (text: string, isReset?: boolean) => void;
  isLoading: boolean;
  thinkingMode: ThinkingMode;
  onSelectThinkingMode: (mode: ThinkingMode) => void;
  onSendToBuilder: (code: string, language?: string) => void;
  onTriggerReset: () => void;
  onAddMemory?: (item: Omit<ProjectMemoryItem, 'id' | 'lastUpdated'>) => void;
  onNavigateModule?: (module: string) => void;
}

export const CoreModule: React.FC<CoreModuleProps> = ({
  messages,
  onSendMessage,
  isLoading,
  thinkingMode,
  onSelectThinkingMode,
  onSendToBuilder,
  onTriggerReset,
  onAddMemory,
  onNavigateModule,
}) => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedMemoryIds, setSavedMemoryIds] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Speech recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsListening(false);
        };
        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    
    // Check if input is a reset command (Section 5)
    const resetKeywords = ['reset', 'get back on track', 'focus', 'stop asking questions', 'back to original'];
    const isReset = resetKeywords.some((k) => inputText.toLowerCase().trim().startsWith(k));
    
    onSendMessage(inputText.trim(), isReset);
    setInputText('');
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const truthCategoryStyles: Record<TruthCategory, { label: string; bg: string; text: string; icon: any }> = {
    fact: { label: 'Verified Fact', bg: 'bg-emerald-950/60 border-emerald-700/50', text: 'text-emerald-300', icon: CheckCircle2 },
    strong_evidence: { label: 'Strong Evidence', bg: 'bg-blue-950/60 border-blue-700/50', text: 'text-blue-300', icon: ShieldCheck },
    reasonable_inference: { label: 'Reasonable Inference', bg: 'bg-cyan-950/60 border-cyan-700/50', text: 'text-cyan-300', icon: Lightbulb },
    personal_analysis: { label: 'ED Analytical Assessment', bg: 'bg-purple-950/60 border-purple-700/50', text: 'text-purple-300', icon: Sparkles },
    speculation: { label: 'Outside-The-Box Speculation', bg: 'bg-amber-950/60 border-amber-700/50', text: 'text-amber-300', icon: AlertTriangle },
    unknown: { label: 'Unknown / Unverified', bg: 'bg-slate-900 border-slate-700', text: 'text-slate-400', icon: HelpCircle },
  };

  // Helper to extract code blocks from markdown
  const renderMessageContent = (text: string, messageId: string) => {
    const codeBlockRegex = /```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: text.slice(lastIndex, match.index),
        });
      }
      parts.push({
        type: 'code',
        language: match[1] || 'code',
        content: match[2].trim(),
      });
      lastIndex = codeBlockRegex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push({
        type: 'text',
        content: text.slice(lastIndex),
      });
    }

    return (
      <div className="space-y-3">
        {parts.map((part, index) => {
          if (part.type === 'code') {
            const snippetKey = `${messageId}-code-${index}`;
            return (
              <div key={snippetKey} className="rounded-xl overflow-hidden border border-slate-700/80 bg-slate-950 my-2">
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
                  <span className="font-mono text-[11px] font-semibold text-amber-400 uppercase">{part.language}</span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(part.content, snippetKey)}
                      className="flex items-center gap-1 text-[11px] hover:text-slate-200 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
                      title="Copy code"
                    >
                      {copiedId === snippetKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === snippetKey ? 'Copied' : 'Copy'}</span>
                    </button>
                    <button
                      onClick={() => onSendToBuilder(part.content, part.language)}
                      className="flex items-center gap-1 text-[11px] text-amber-300 hover:text-amber-200 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors"
                      title="Open in Builder IDE"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>Open in Builder</span>
                    </button>
                  </div>
                </div>
                <pre className="p-3.5 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed selection:bg-amber-500/30">
                  <code>{part.content}</code>
                </pre>
              </div>
            );
          }
          return (
            <div key={index} className="text-sm leading-relaxed whitespace-pre-wrap font-sans text-slate-200">
              {part.content}
            </div>
          );
        })}
      </div>
    );
  };

  const starterPrompts = [
    {
      title: 'Architect a Modular System',
      prompt: 'Let’s architect a local-first modular AI intelligence framework. Break it down from IDEA to MVP.',
    },
    {
      title: 'Tactical Sitrep & Next High-Leverage Move',
      prompt: 'Give me a JARVIS-style partner briefing: assess our current architecture priorities, spot potential vulnerabilities, and outline our next high-leverage execution step.',
    },
    {
      title: 'Architecture Stress-Test & Red Teaming',
      prompt: 'I want to build a resilient local-first operating intelligence. Attack my design assumptions and identify the most probable single point of failure.',
    },
    {
      title: 'Outside-The-Box Invention Synthesis',
      prompt: 'Synthesize Nikola Tesla’s principles of wireless resonance and Leonardo da Vinci’s mechanical ergonomics into a modern edge-computing device architecture.',
    },
    {
      title: 'Contract Deconstruction & Risk Audit',
      prompt: 'Audit an IP assignment clause where the client claims ownership of all pre-existing open source tooling. Provide strategic counter-clauses and redlines.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-950 overflow-hidden relative">
      {/* Top Partner Protocol & HUD Strip */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
          <span className="font-mono font-bold text-amber-400 tracking-wider text-[11px]">JARVIS COMPANION PROTOCOL:</span>
          <span className="text-slate-300 hidden sm:inline text-[11px]">Strategic Wingman • Zero Fluff • Proactive Anticipation</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSendMessage('Give me an executive sitrep: summarize our strategic status, active project threads, and the single highest-leverage move we should make right now.')}
            className="flex items-center gap-1.5 text-[11px] font-medium text-amber-300 hover:text-amber-200 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all shadow-xs"
            title="Request proactive partner briefing"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Partner Sitrep</span>
          </button>
          <button
            onClick={onTriggerReset}
            className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 px-2.5 py-1 rounded-lg bg-red-950/30 border border-red-900/40 hover:bg-red-950/60 transition-colors"
            title="Reset conversation focus & get back on track"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Track</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-4xl w-full mx-auto pb-32">
        {messages.length === 0 ? (
          <div className="my-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-red-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/20">
              <Sparkles className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-amber-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>ED OPERATING SYSTEM • LONG-TERM PARTNER CO-PILOT</span>
              </div>
              <h2 className="text-xl font-bold text-slate-100 tracking-tight">ED Unplugged AI — Your Strategic Partner</h2>
              <p className="text-sm text-slate-400 max-w-lg mx-auto leading-relaxed">
                Operating as your intellectual companion and tactical wingman in the tradition of JARVIS to Tony Stark. No chatbots, no pleasantries — just high-bandwidth execution, ruthless honesty, and shared ambition.
              </p>
            </div>

            {/* Quick Starters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto pt-4 text-left">
              {starterPrompts.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(s.prompt)}
                  className="p-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/40 transition-all text-left group shadow-xs"
                >
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-amber-300 flex items-center justify-between">
                    <span>{s.title}</span>
                    <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-amber-400" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-normal">
                    {s.prompt}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isUser = msg.sender === 'user';
            const truth = msg.truthAssessment;
            const TruthIcon = truth ? truthCategoryStyles[truth.category]?.icon || Info : Info;
            const truthStyle = truth ? truthCategoryStyles[truth.category] : null;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-2`}
              >
                {/* Sender badge & timestamp */}
                <div className="flex items-center gap-2 px-1 text-[11px] font-mono text-slate-500">
                  <span>{isUser ? 'USER (CMD)' : msg.agentName ? `${msg.agentName.toUpperCase()}` : 'ED CORE'}</span>
                  <span>•</span>
                  <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {/* Message Bubble */}
                <div
                  className={`rounded-2xl p-4 max-w-3xl shadow-sm ${
                    isUser
                      ? 'bg-slate-800 border border-slate-700 text-slate-100 ml-8'
                      : 'bg-slate-900/90 border border-slate-800 text-slate-200 mr-8 ring-1 ring-white/5'
                  }`}
                >
                  {/* Reset Notice Banner if triggered */}
                  {msg.isResetNotice && (
                    <div className="mb-3 p-2 rounded-lg bg-red-950/40 border border-red-800/50 flex items-center gap-2 text-xs text-red-300">
                      <RotateCcw className="w-3.5 h-3.5 text-red-400" />
                      <span><strong>Conversation Reset:</strong> Refocused on immediate objective.</span>
                    </div>
                  )}

                  {/* Main content */}
                  {renderMessageContent(msg.text, msg.id)}

                  {/* Runtime Memory Provenance */}
                  {!isUser && msg.memorySources && msg.memorySources.length > 0 && (
                    <div className="mt-3 rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-cyan-300">
                        <Database className="w-3.5 h-3.5" />
                        <span>Grounded by ED Memory</span>
                      </div>
                      <div className="mt-2 space-y-1">
                        {msg.memorySources.map((source, index) => (
                          <div
                            key={`${source}-${index}`}
                            className="text-[11px] font-mono text-slate-400 break-all"
                          >
                            • {source}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggested Memory Card */}
                  {!isUser && msg.suggestedMemory && onAddMemory && (
                    <div className="mt-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/40 flex items-start justify-between gap-3 text-xs">
                      <div className="flex items-start gap-2.5">
                        <div className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-300 shrink-0 mt-0.5">
                          <BookmarkPlus className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-cyan-200">Continuous Memory Opportunity</span>
                            <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                              {msg.suggestedMemory.category}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                            {msg.suggestedMemory.title}: "{msg.suggestedMemory.description}"
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (!msg.suggestedMemory) return;
                          onAddMemory({
                            title: msg.suggestedMemory.title,
                            category: msg.suggestedMemory.category,
                            description: msg.suggestedMemory.description,
                            tags: msg.suggestedMemory.tags,
                            status: 'active',
                          });
                          setSavedMemoryIds((prev) => ({ ...prev, [msg.id]: true }));
                        }}
                        disabled={savedMemoryIds[msg.id]}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                          savedMemoryIds[msg.id]
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm shadow-cyan-500/20'
                        }`}
                      >
                        {savedMemoryIds[msg.id] ? 'Saved to Vault' : 'Save to Vault'}
                      </button>
                    </div>
                  )}

                  {/* Truth & Honesty Protocol Badge (Section 7) */}
                  {!isUser && truth && truthStyle && (
                    <div className={`mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs`}>
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-mono ${truthStyle.bg} ${truthStyle.text}`}>
                        <TruthIcon className="w-3 h-3" />
                        <span>{truthStyle.label}</span>
                        <span className="opacity-60 font-sans">({truth.certaintyScore}% certainty)</span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Truth Protocol v2.4
                      </div>
                    </div>
                  )}

                  {/* Curious Questions Panel (Section 4) */}
                  {!isUser && msg.questions && msg.questions.length > 0 && (
                    <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800/90 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>ED’s Inquiring Angles & Assumptions:</span>
                      </div>
                      <div className="space-y-1.5">
                        {msg.questions.map((q, qIdx) => (
                          <button
                            key={qIdx}
                            onClick={() => onSendMessage(q)}
                            className="w-full text-left p-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800/80 hover:border-amber-500/40 text-xs text-slate-300 hover:text-amber-200 transition-all flex items-start gap-2 group"
                          >
                            <ArrowRight className="w-3 h-3 text-amber-400 shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform" />
                            <span>{q}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-slate-400 text-xs max-w-sm mr-auto animate-pulse">
            <div className="w-4 h-4 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
            <span>ED is reasoning and synthesizing insights...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Dock Bar */}
      <div className="absolute bottom-16 left-0 right-0 p-4 max-w-3xl mx-auto w-full z-20 space-y-2">
        {/* Quick Mode & Feature Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => onNavigateModule?.('whatif')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-medium text-amber-300 transition-colors shrink-0"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>"What If" Generator</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateModule?.('legal')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-medium text-indigo-300 transition-colors shrink-0"
          >
            <Scale className="w-3 h-3 text-indigo-400" />
            <span>Legal Intelligence</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateModule?.('memory')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-[11px] font-medium text-cyan-300 transition-colors shrink-0"
          >
            <Database className="w-3 h-3 text-cyan-400" />
            <span>Persistent Vault</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectThinkingMode(thinkingMode === 'outside_box' ? 'balanced' : 'outside_box')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-colors shrink-0 ${
              thinkingMode === 'outside_box'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                : 'bg-slate-900/90 hover:bg-slate-800 border-slate-700/80 text-slate-300'
            }`}
          >
            <Flame className="w-3 h-3 text-amber-400" />
            <span>Outside-The-Box</span>
          </button>
        </div>

        <form
          onSubmit={handleSend}
          className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/95 border border-slate-700/80 shadow-2xl backdrop-blur-xl ring-1 ring-white/10"
        >
          {/* Mic Button */}
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2.5 rounded-xl transition-colors ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={isListening ? 'Listening...' : 'Voice Input (Speech-to-Text)'}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              thinkingMode === 'outside_box'
                ? "Ask ED an outside-the-box question or engineering dilemma..."
                : thinkingMode === 'teacher'
                ? "Ask ED to teach a first-principles concept or break down a hard problem..."
                : "Talk with ED (or type 'Reset' to get back on track)..."
            }
            className="flex-1 bg-transparent border-none outline-none text-slate-100 text-sm placeholder-slate-500 font-sans px-2"
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 disabled:hover:bg-amber-500 text-slate-950 font-semibold transition-all shadow-md shadow-amber-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
