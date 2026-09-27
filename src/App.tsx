import React, { useState, useEffect, useCallback } from 'react';
import { EDModule, ThinkingMode, EDMessage, ProjectMemoryItem, AgentTask, MemoryLink } from './types';
import { getStoredMemories, saveStoredMemories, getStoredMemoryLinks, saveStoredMemoryLinks } from './utils/storage';
import { Header } from './components/Header';
import { OSDock } from './components/OSDock';
import { CommandPalette } from './components/CommandPalette';
import { CoreHomeModule } from './components/CoreHomeModule';
import { SphereWorkspace } from './components/SphereWorkspace';
import { BuilderModule } from './components/BuilderModule';
import { ResearchModule } from './components/ResearchModule';
import { StrategyModule } from './components/StrategyModule';
import { CreativeModule } from './components/CreativeModule';
import { AgentsModule } from './components/AgentsModule';
import { MemoryVaultModule } from './components/MemoryVaultModule';
import { TerminalModule } from './components/TerminalModule';
import { WhatIfModule } from './components/WhatIfModule';
import { LegalModule } from './components/LegalModule';

export default function App() {
  const [currentModule, setCurrentModule] = useState<EDModule>('core');
  const [thinkingMode, setThinkingMode] = useState<ThinkingMode>('balanced');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Close temporary Settings/Theme UI whenever ED changes modules.
  useEffect(() => {
    document.getElementById('ed-theme-panel')?.classList.remove('open');
    document.getElementById('ed-theme-control')?.classList.remove('ed-home-settings-visible');
  }, [currentModule]);

  // Builder state
  const [builderCode, setBuilderCode] = useState<string | undefined>(undefined);
  const [builderLang, setBuilderLang] = useState<string>('typescript');

  // Memories & Persistence
  const [memories, setMemories] = useState<ProjectMemoryItem[]>(() => getStoredMemories());
  const [memoryLinks, setMemoryLinks] = useState<MemoryLink[]>(() => getStoredMemoryLinks());
  const [runtimeMemoryFiles, setRuntimeMemoryFiles] = useState<string[]>([]);

  // Conversation history
  const [messages, setMessages] = useState<EDMessage[]>([
    {
      id: 'ed-welcome-1',
      sender: 'ed',
      text: `Greetings. I am **ED** — your personal AI operating system and thinking partner.

I'm here to help you solve problems, master complex subjects, architect software, uncover evidence, and explore outside-the-box ideas. 

Master fundamentals, then think beyond them. Where shall we direct our intelligence today?`,
      timestamp: Date.now(),
      thinkingMode: 'balanced',
      questions: [
        'Would you like to architect an autonomous local-first software workflow?',
        'Do you have a problem or engineering dilemma where you want your assumptions challenged?',
        'Should we run grounded research or explore an unconventional invention?',
      ],
      truthAssessment: {
        category: 'fact',
        explanation: 'ED OS Runtime initialized with local-first persistence.',
        certaintyScore: 100,
      },
    },
  ]);

  // Active Sub-Agents Tasks
  const [tasks, setTasks] = useState<AgentTask[]>([
    {
      id: 'task-init-1',
      agentType: 'sysadmin',
      title: 'Initialize Local Linux Sandboxes & Telemetry',
      objective: 'Configure execution environment, verify API endpoints, and set up memory sync.',
      status: 'completed',
      progress: 100,
      logs: [
        { time: Date.now() - 60000, text: 'Booting ED OS daemon & loading memory context...', type: 'info' },
        { time: Date.now() - 40000, text: 'ED local backend on port 3000; OpenClaw and Ollama required.', type: 'success' },
        { time: Date.now() - 20000, text: 'Local-First storage verified with 4 core memory items.', type: 'info' },
        { time: Date.now() - 5000, text: 'System ready for autonomous task delegation.', type: 'success' },
      ],
      result: 'System environment initialized. All modules (Core, Builder, Research, Strategy, Creative, Agents, Memory Vault, Terminal) operating at peak efficiency.',
      timestamp: Date.now() - 60000,
    },
  ]);

  // Synchronize memory and visual links to local storage
  useEffect(() => {
    saveStoredMemories(memories);
  }, [memories]);

  useEffect(() => {
    saveStoredMemoryLinks(memoryLinks);
  }, [memoryLinks]);

  useEffect(() => {
    fetch('/api/ed/memory/status')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => {
        if (d?.ok && Array.isArray(d.files)) setRuntimeMemoryFiles(d.files);
      })
      .catch(() => {});
  }, []);

  // Audio speech synthesis helper
  const playAudioVoice = useCallback((text: string) => {
    if (!audioEnabled || typeof window === 'undefined') return;
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        // Clean markdown symbols for cleaner voice
        const cleanText = text.replace(/[*#`_\[\]()]/g, '').slice(0, 300);
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = 1.05;
        utterance.pitch = 1.0;
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.warn('Speech synthesis failed:', e);
    }
  }, [audioEnabled]);

  // Core Dialogue Handler
  const handleSendMessage = async (text: string, isReset: boolean = false) => {
    const userMsgId = Math.random().toString(36).substring(2, 9);
    const userMsg: EDMessage = {
      id: userMsgId,
      sender: 'user',
      text,
      timestamp: Date.now(),
      thinkingMode,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // Compile memory context summary to inject into prompt
      const memoryContext = memories
        .slice(0, 8)
        .map((m) => `[${m.category.toUpperCase()}] ${m.title}: ${m.description}`)
        .join('\n');

      const res = await fetch('/api/ed/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6),
          mode: thinkingMode,
          memoryContext,
          isResetCommand: isReset,
        }),
      });

      const data = await res.json();

      const edMsg: EDMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'ed',
        text: data.text || data.fallbackText || 'ED processed your query.',
        timestamp: Date.now(),
        thinkingMode,
        questions: data.questions || [],
        truthAssessment: data.truthAssessment,
        memorySources: data.memorySources || [],
        suggestedMemory: data.suggestedMemory,
        isResetNotice: isReset || data.isResetNotice,
      };

      setMessages((prev) => [...prev, edMsg]);
      playAudioVoice(edMsg.text);
    } catch (e: any) {
      const errorMsg: EDMessage = {
        id: Math.random().toString(36).substring(2, 9),
        sender: 'ed',
        text: `ED Core encountered a connection error: ${e.message || 'Unknown issue'}. Reconnecting...`,
        timestamp: Date.now(),
        truthAssessment: {
          category: 'unknown',
          explanation: 'Connection error during API round-trip.',
          certaintyScore: 0,
        },
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Conversation Reset Trigger (Section 5)
  const handleTriggerReset = () => {
    handleSendMessage('Reset focus. Get back on track and refocus on the immediate goal.', true);
  };

  // Dispatch Autonomous Sub-Agent Task
  const handleDispatchTask = async (
    agentType: AgentTask['agentType'],
    title: string,
    objective: string
  ) => {
    const taskId = 'task-' + Math.random().toString(36).substring(2, 9);
    const newTask: AgentTask = {
      id: taskId,
      agentType,
      title,
      objective,
      status: 'running',
      progress: 30,
      logs: [
        { time: Date.now(), text: `Delegating mission to [${agentType.toUpperCase()} AGENT]...`, type: 'info' },
        { time: Date.now() + 500, text: 'Deconstructing problem & gathering domain context...', type: 'info' },
      ],
      timestamp: Date.now(),
    };

    setTasks((prev) => [newTask, ...prev]);

    try {
      const res = await fetch('/api/ed/agent/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType,
          taskTitle: title,
          objective,
        }),
      });
      const data = await res.json();

      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: 'completed',
                progress: 100,
                logs: [
                  ...t.logs,
                  { time: Date.now(), text: 'Executing synthesis and verifying outputs...', type: 'info' },
                  { time: Date.now() + 100, text: 'Mission deliverable finalized.', type: 'success' },
                ],
                result: data.result || 'Task completed successfully.',
              }
            : t
        )
      );
    } catch (e: any) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                status: 'failed',
                logs: [...t.logs, { time: Date.now(), text: `Failed: ${e.message}`, type: 'warn' }],
              }
            : t
        )
      );
    }
  };

  // Add memory item to vault
  const handleAddMemory = (item: Omit<ProjectMemoryItem, 'id' | 'lastUpdated'>) => {
    const newItem: ProjectMemoryItem = {
      ...item,
      id: 'mem-' + Math.random().toString(36).substring(2, 9),
      lastUpdated: Date.now(),
    };
    setMemories((prev) => [newItem, ...prev]);
  };

  // Update memory item in vault
  const handleUpdateMemory = (id: string, updates: Partial<ProjectMemoryItem>) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates, lastUpdated: Date.now() } : m))
    );
  };

  // Delete memory item (and cleanup associated visual links)
  const handleDeleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
    setMemoryLinks((prev) => prev.filter((l) => l.sourceId !== id && l.targetId !== id));
  };

  // Add visual relational link
  const handleAddLink = (link: Omit<MemoryLink, 'id' | 'createdAt'>) => {
    const newLink: MemoryLink = {
      ...link,
      id: 'link-' + Math.random().toString(36).substring(2, 9),
      createdAt: Date.now(),
    };
    setMemoryLinks((prev) => [newLink, ...prev]);
  };

  // Delete visual relational link
  const handleDeleteLink = (linkId: string) => {
    setMemoryLinks((prev) => prev.filter((l) => l.id !== linkId));
  };

  // Export Vault to JSON (including visual links graph)
  const handleExportJSON = () => {
    const payload = {
      version: '2.4',
      exportDate: new Date().toISOString(),
      memories,
      links: memoryLinks,
    };
    const dataStr = JSON.stringify(payload, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ed-unplugged-vault-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import Vault from JSON
  const handleImportJSON = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        if (Array.isArray(parsed)) {
          setMemories(parsed);
          alert(`Successfully imported ${parsed.length} memory items.`);
        } else if (parsed && Array.isArray(parsed.memories)) {
          setMemories(parsed.memories);
          if (Array.isArray(parsed.links)) {
            setMemoryLinks(parsed.links);
          }
          alert(`Successfully imported ${parsed.memories.length} memories and ${parsed.links?.length || 0} relational visual links.`);
        } else {
          alert('Invalid JSON file format.');
        }
      } catch (err: any) {
        alert('Failed to parse JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  // Send snippet from chat or other modules to Builder IDE
  const handleSendToBuilder = (code: string, language?: string) => {
    setBuilderCode(code);
    if (language) setBuilderLang(language);
    setCurrentModule('builder');
  };

  // Quick execution from CLI Terminal
  const handleExecuteTerminalPrompt = async (promptText: string, mode: string = 'balanced') => {
    const memoryContext = memories
      .slice(0, 6)
      .map((m) => `[${m.category.toUpperCase()}] ${m.title}: ${m.description}`)
      .join('\n');

    const res = await fetch('/api/ed/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: promptText,
        history: [],
        mode,
        memoryContext,
      }),
    });
    const data = await res.json();
    return data.text || 'Command executed with no output.';
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans select-text">
      {/* Top Header */}
      <Header
        currentModule={currentModule}
        onSelectModule={setCurrentModule}
        thinkingMode={thinkingMode}
        onSelectThinkingMode={setThinkingMode}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onTriggerReset={handleTriggerReset}
        audioEnabled={audioEnabled}
        onToggleAudio={() => setAudioEnabled(!audioEnabled)}
        memoryCount={memories.length}
        activeAgentsCount={tasks.filter((t) => t.status === 'running').length || tasks.length}
      />

      {/* Main OS Viewport Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {currentModule === 'core' && (
          <CoreHomeModule
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            thinkingMode={thinkingMode}
            onSelectThinkingMode={setThinkingMode}
            onSendToBuilder={handleSendToBuilder}
            onTriggerReset={handleTriggerReset}
            onAddMemory={handleAddMemory}
            onNavigateModule={(mod) => setCurrentModule(mod as EDModule)}
          />
        )}

        {currentModule === 'whatif' && (
          <SphereWorkspace title="WHAT IF" onHome={() => setCurrentModule('core')}>
<WhatIfModule
            onSaveToMemory={(title, content, tags) =>
              handleAddMemory({
                title,
                category: 'decision',
                description: content,
                tags,
                status: 'active',
              })
            }
            onDispatchAgent={(agentTitle, agentObjective) =>
              handleDispatchTask('strategy', agentTitle, agentObjective)
            }
            onNavigateModule={(mod) => setCurrentModule(mod as EDModule)}
          />
</SphereWorkspace>
        )}

        {currentModule === 'legal' && (
          <SphereWorkspace title="LEGAL" onHome={() => setCurrentModule('core')}>
<LegalModule
            onSaveToMemory={(title, content, tags) =>
              handleAddMemory({
                title,
                category: 'decision',
                description: content,
                tags,
                status: 'active',
              })
            }
            onDispatchLegalAgent={(agentTitle, agentObjective) =>
              handleDispatchTask('legal', agentTitle, agentObjective)
            }
            onNavigateModule={(mod) => setCurrentModule(mod as EDModule)}
          />
</SphereWorkspace>
        )}

        {currentModule === 'builder' && (
          <SphereWorkspace title="TOOLS" onHome={() => setCurrentModule('core')}>
<BuilderModule
            initialCode={builderCode}
            initialLanguage={builderLang}
            onSaveToMemory={(title, code, notes) =>
              handleAddMemory({
                title,
                category: 'project',
                description: `Code Artifact:\n${code}\n\nNotes: ${notes}`,
                tags: ['builder', 'code', 'artifact'],
                status: 'active',
              })
            }
          />
</SphereWorkspace>
        )}

        {currentModule === 'research' && (
          <SphereWorkspace title="RESEARCH" onHome={() => setCurrentModule('core')}>
<ResearchModule
            onSaveToMemory={(title, content, tags) =>
              handleAddMemory({
                title,
                category: 'context',
                description: content,
                tags,
                status: 'active',
              })
            }
          />
</SphereWorkspace>
        )}

        {currentModule === 'strategy' && (
          <SphereWorkspace title="STRATEGY" onHome={() => setCurrentModule('core')}>
<StrategyModule
            onSaveToMemory={(title, content, tags) =>
              handleAddMemory({
                title,
                category: 'decision',
                description: content,
                tags,
                status: 'active',
              })
            }
          />
</SphereWorkspace>
        )}

        {currentModule === 'creative' && (
          <SphereWorkspace title="CREATE" onHome={() => setCurrentModule('core')}>
<CreativeModule
            onSaveToMemory={(title, content, tags) =>
              handleAddMemory({
                title,
                category: 'context',
                description: content,
                tags,
                status: 'active',
              })
            }
          />
</SphereWorkspace>
        )}

        {currentModule === 'agents' && (
          <SphereWorkspace title="TASKS" onHome={() => setCurrentModule('core')}>
<AgentsModule
            tasks={tasks}
            onDispatchTask={handleDispatchTask}
            onSaveToMemory={(title, content, tags) =>
              handleAddMemory({
                title,
                category: 'project',
                description: content,
                tags,
                status: 'active',
              })
            }
          />
</SphereWorkspace>
        )}

        {currentModule === 'memory' && (
          <SphereWorkspace title="MEMORY" onHome={() => setCurrentModule('core')}>
<MemoryVaultModule
            memories={memories}
            links={memoryLinks}
            runtimeMemoryFiles={runtimeMemoryFiles}
            onAddMemory={handleAddMemory}
            onUpdateMemory={handleUpdateMemory}
            onDeleteMemory={handleDeleteMemory}
            onAddLink={handleAddLink}
            onDeleteLink={handleDeleteLink}
            onExportJSON={handleExportJSON}
            onImportJSON={handleImportJSON}
          />
</SphereWorkspace>
        )}

        {currentModule === 'terminal' && (
          <SphereWorkspace title="TERMINAL" onHome={() => setCurrentModule('core')}>
<TerminalModule
            onExecutePrompt={handleExecuteTerminalPrompt}
            memories={memories}
            onNavigateModule={setCurrentModule}
            onReset={handleTriggerReset}
          />
</SphereWorkspace>
        )}
      </main>

      {/* Persistent OS Dock Navigation */}
      <OSDock activeModule={currentModule} onSelectModule={setCurrentModule} />

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectModule={setCurrentModule}
        onSelectThinkingMode={setThinkingMode}
        onTriggerReset={handleTriggerReset}
        onQuickAction={(type) => {
          if (type === 'open_palette') setIsCommandPaletteOpen(true);
        }}
      />
    </div>
  );
}
