import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { 
  ProjectMemoryItem, 
  MemoryLink, 
  MemoryRelationType 
} from '../types';
import { 
  Share2, 
  Plus, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  X, 
  ArrowRight, 
  Link2, 
  Sparkles, 
  Info, 
  Filter,
  Check,
  Radio,
  Eye
} from 'lucide-react';
import { speakText, stopSpeaking } from '../utils/voice';

interface MemoryGraphViewProps {
  memories: ProjectMemoryItem[];
  links: MemoryLink[];
  onAddLink: (link: Omit<MemoryLink, 'id' | 'createdAt'>) => void;
  onDeleteLink: (linkId: string) => void;
  onDeleteMemory: (memoryId: string) => void;
  onSelectMemory?: (memory: ProjectMemoryItem) => void;
}

interface NodePosition {
  x: number;
  y: number;
  vx?: number;
  vy?: number;
}

const CATEGORY_COLORS: Record<string, {
  bg: string;
  border: string;
  text: string;
  glow: string;
  hex: string;
  badge: string;
}> = {
  legal: {
    bg: 'bg-indigo-950/80',
    border: 'border-indigo-500',
    text: 'text-indigo-300',
    glow: 'rgba(99, 102, 241, 0.4)',
    hex: '#818cf8',
    badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
  },
  decision: {
    bg: 'bg-amber-950/80',
    border: 'border-amber-500',
    text: 'text-amber-300',
    glow: 'rgba(245, 158, 11, 0.4)',
    hex: '#fbbf24',
    badge: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
  },
  architecture: {
    bg: 'bg-sky-950/80',
    border: 'border-sky-500',
    text: 'text-sky-300',
    glow: 'rgba(14, 165, 233, 0.4)',
    hex: '#38bdf8',
    badge: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
  },
  project: {
    bg: 'bg-cyan-950/80',
    border: 'border-cyan-500',
    text: 'text-cyan-300',
    glow: 'rgba(6, 182, 212, 0.4)',
    hex: '#22d3ee',
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  },
  preference: {
    bg: 'bg-emerald-950/80',
    border: 'border-emerald-500',
    text: 'text-emerald-300',
    glow: 'rgba(16, 185, 129, 0.4)',
    hex: '#34d399',
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  },
  context: {
    bg: 'bg-purple-950/80',
    border: 'border-purple-500',
    text: 'text-purple-300',
    glow: 'rgba(168, 85, 247, 0.4)',
    hex: '#c084fc',
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
  },
  unfinished: {
    bg: 'bg-rose-950/80',
    border: 'border-rose-500',
    text: 'text-rose-300',
    glow: 'rgba(244, 63, 94, 0.4)',
    hex: '#fb7185',
    badge: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
  },
};

const RELATION_PRESETS: { type: MemoryRelationType; label: string; desc: string; color: string }[] = [
  { type: 'governs', label: 'Governs / Regulates', desc: 'Sets statutory, legal, or policy constraints', color: '#818cf8' },
  { type: 'influences', label: 'Influences / Informs', desc: 'Provides mindset, principles, or historical context', color: '#c084fc' },
  { type: 'implements', label: 'Implements / Realizes', desc: 'Translates high-level strategy or principle into tangible reality', color: '#34d399' },
  { type: 'strategic_risk', label: 'Strategic Risk / Vulnerability', desc: 'Identifies liability, dependency, or attack surface', color: '#fb7185' },
  { type: 'depends_on', label: 'Depends On / Prerequisite', desc: 'Requires prior completion or foundational setup', color: '#38bdf8' },
  { type: 'mitigates', label: 'Mitigates Risk', desc: 'Acts as defense mechanism or safety guardrail', color: '#fbbf24' },
  { type: 'precedent_for', label: 'Precedent For', desc: 'Forms factual basis for future decisions', color: '#a78bfa' },
  { type: 'related_to', label: 'Direct Association', desc: 'Shares operational context or cross-cutting synergy', color: '#94a3b8' },
];

export const MemoryGraphView: React.FC<MemoryGraphViewProps> = ({
  memories,
  links,
  onAddLink,
  onDeleteLink,
  onDeleteMemory,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [positions, setPositions] = useState<Record<string, NodePosition>>({});
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  
  // Interaction State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);
  const [isLinkingModalOpen, setIsLinkingModalOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Link Form State
  const [linkSource, setLinkSource] = useState<string>('');
  const [linkTarget, setLinkTarget] = useState<string>('');
  const [linkRelation, setLinkRelation] = useState<MemoryRelationType>('governs');
  const [linkLabel, setLinkLabel] = useState<string>('');
  const [linkNotes, setLinkNotes] = useState<string>('');

  // Dragging State
  const dragRef = useRef<{
    isDragging: boolean;
    nodeId: string | null;
    startX: number;
    startY: number;
    initialPanX: number;
    initialPanY: number;
    initialNodeX: number;
    initialNodeY: number;
    isPan: boolean;
  }>({
    isDragging: false,
    nodeId: null,
    startX: 0,
    startY: 0,
    initialPanX: 0,
    initialPanY: 0,
    initialNodeX: 0,
    initialNodeY: 0,
    isPan: false,
  });

  // Track container sizing with ResizeObserver
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        setDimensions({
          width: Math.max(entry.contentRect.width, 400),
          height: Math.max(entry.contentRect.height, 400),
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute Initial Positions in a balanced organic circle layout
  const initializePositions = useCallback(() => {
    if (memories.length === 0) return;
    const { width, height } = dimensions;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.35;

    const newPositions: Record<string, NodePosition> = {};
    const count = memories.length;

    memories.forEach((mem, index) => {
      // If position already exists, keep it
      if (positions[mem.id]) {
        newPositions[mem.id] = positions[mem.id];
        return;
      }
      const angle = (index / count) * 2 * Math.PI - Math.PI / 2;
      const jitter = (index % 2 === 0 ? 1 : 0.85);
      newPositions[mem.id] = {
        x: centerX + Math.cos(angle) * radius * jitter,
        y: centerY + Math.sin(angle) * radius * jitter,
      };
    });

    setPositions(newPositions);
  }, [memories, dimensions]);

  useEffect(() => {
    initializePositions();
  }, [initializePositions]);

  // Memory map for quick lookup
  const memoryMap = useMemo(() => {
    return new Map(memories.map((m) => [m.id, m]));
  }, [memories]);

  // Filtered nodes
  const visibleMemories = useMemo(() => {
    if (filterCategory === 'all') return memories;
    return memories.filter((m) => m.category === filterCategory);
  }, [memories, filterCategory]);

  const visibleNodeIds = useMemo(() => {
    return new Set(visibleMemories.map((m) => m.id));
  }, [visibleMemories]);

  // Filtered links
  const visibleLinks = useMemo(() => {
    return links.filter(
      (l) => visibleNodeIds.has(l.sourceId) && visibleNodeIds.has(l.targetId)
    );
  }, [links, visibleNodeIds]);

  // Get connected links for a node
  const getNodeLinks = useCallback(
    (nodeId: string) => {
      const incoming = links.filter((l) => l.targetId === nodeId);
      const outgoing = links.filter((l) => l.sourceId === nodeId);
      return { incoming, outgoing, all: [...incoming, ...outgoing] };
    },
    [links]
  );

  // Highlighting: check if node or link is connected to hovered or selected node
  const activeFocusId = selectedNodeId || hoveredNodeId;
  const connectedNodeIds = useMemo(() => {
    if (!activeFocusId) return new Set<string>();
    const ids = new Set<string>([activeFocusId]);
    links.forEach((l) => {
      if (l.sourceId === activeFocusId) ids.add(l.targetId);
      if (l.targetId === activeFocusId) ids.add(l.sourceId);
    });
    return ids;
  }, [activeFocusId, links]);

  // Zoom / Pan handlers
  const handleZoom = (delta: number) => {
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.4), 2.2));
  };

  const handleResetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
    initializePositions();
  };

  // Drag and Pan interactions
  const handlePointerDown = (e: React.PointerEvent, nodeId?: string) => {
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

    if (nodeId) {
      // Dragging a node
      const currentPos = positions[nodeId] || { x: 0, y: 0 };
      dragRef.current = {
        isDragging: true,
        nodeId,
        startX: e.clientX,
        startY: e.clientY,
        initialPanX: pan.x,
        initialPanY: pan.y,
        initialNodeX: currentPos.x,
        initialNodeY: currentPos.y,
        isPan: false,
      };
    } else {
      // Panning the canvas
      dragRef.current = {
        isDragging: true,
        nodeId: null,
        startX: e.clientX,
        startY: e.clientY,
        initialPanX: pan.x,
        initialPanY: pan.y,
        initialNodeX: 0,
        initialNodeY: 0,
        isPan: true,
      };
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragRef.current.isDragging) return;

    const dx = (e.clientX - dragRef.current.startX) / zoom;
    const dy = (e.clientY - dragRef.current.startY) / zoom;

    if (dragRef.current.isPan) {
      setPan({
        x: dragRef.current.initialPanX + (e.clientX - dragRef.current.startX),
        y: dragRef.current.initialPanY + (e.clientY - dragRef.current.startY),
      });
    } else if (dragRef.current.nodeId) {
      const id = dragRef.current.nodeId;
      setPositions((prev) => ({
        ...prev,
        [id]: {
          x: dragRef.current.initialNodeX + dx,
          y: dragRef.current.initialNodeY + dy,
        },
      }));
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    dragRef.current.isDragging = false;
    dragRef.current.nodeId = null;
    dragRef.current.isPan = false;
  };

  // Node Click
  const handleNodeClick = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();

    // If in "Connect Mode"
    if (connectSourceId && connectSourceId !== nodeId) {
      setLinkSource(connectSourceId);
      setLinkTarget(nodeId);
      const s = memoryMap.get(connectSourceId);
      const t = memoryMap.get(nodeId);
      if (s?.category === 'legal') {
        setLinkRelation('governs');
      } else if (s?.category === 'preference') {
        setLinkRelation('influences');
      } else {
        setLinkRelation('implements');
      }
      setIsLinkingModalOpen(true);
      setConnectSourceId(null);
      return;
    }

    if (connectSourceId === nodeId) {
      setConnectSourceId(null);
      return;
    }

    setSelectedNodeId(nodeId === selectedNodeId ? null : nodeId);
    setSelectedLinkId(null);
  };

  // Voice playback of selected node
  const handleSpeakMemory = (item: ProjectMemoryItem) => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    const { incoming, outgoing } = getNodeLinks(item.id);
    let speech = `Memory: ${item.title}. Category: ${item.category}. Description: ${item.description}. `;

    if (outgoing.length > 0) {
      const targets = outgoing.map((l) => {
        const target = memoryMap.get(l.targetId);
        return `${l.relationType} ${target?.title || 'target memory'}`;
      });
      speech += `This memory actively connects forward: ${targets.join(', ')}. `;
    }

    if (incoming.length > 0) {
      const sources = incoming.map((l) => {
        const src = memoryMap.get(l.sourceId);
        return `linked from ${src?.title || 'source memory'}`;
      });
      speech += `Inbound connections include: ${sources.join(', ')}. `;
    }

    setIsSpeaking(true);
    speakText(speech, {
      onEnd: () => setIsSpeaking(false),
    });
  };

  // Create Link submission
  const handleCreateLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkSource || !linkTarget || linkSource === linkTarget) return;

    onAddLink({
      sourceId: linkSource,
      targetId: linkTarget,
      relationType: linkRelation,
      label: linkLabel.trim() || undefined,
      notes: linkNotes.trim() || undefined,
    });

    setIsLinkingModalOpen(false);
    setLinkSource('');
    setLinkTarget('');
    setLinkLabel('');
    setLinkNotes('');
  };

  // Selected memory item for inspector
  const selectedMemory = selectedNodeId ? memoryMap.get(selectedNodeId) : null;
  const selectedNodeConnections = selectedNodeId ? getNodeLinks(selectedNodeId) : null;

  // Selected link for inspector
  const selectedLink = selectedLinkId ? links.find((l) => l.id === selectedLinkId) : null;

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-[640px] md:h-[700px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden select-none flex flex-col"
      id="memory-graph-container"
    >
      {/* Top Controls Overlay */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: View Info & Categories */}
        <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto bg-slate-900/90 backdrop-blur border border-slate-800 p-1.5 rounded-xl shadow-lg">
          <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-mono font-semibold text-cyan-400 border-r border-slate-800 mr-1">
            <Share2 className="w-3.5 h-3.5" />
            <span>KNOWLEDGE GRAPH</span>
          </div>

          {(['all', 'legal', 'decision', 'architecture', 'project', 'preference'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all ${
                filterCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200 bg-slate-950/40'
              }`}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Right: Actions & Tools */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-slate-900/90 backdrop-blur border border-slate-800 p-1.5 rounded-xl shadow-lg">
          {connectSourceId ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs animate-pulse">
              <Radio className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              <span>Click target node to link...</span>
              <button
                onClick={() => setConnectSourceId(null)}
                className="text-amber-400 hover:text-amber-100 ml-1 font-bold"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setLinkSource(selectedNodeId || memories[0]?.id || '');
                setLinkTarget(memories[1]?.id || '');
                setIsLinkingModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm shadow-cyan-500/20"
              title="Create new relational connection between memories"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Connect Nodes</span>
            </button>
          )}

          <div className="h-4 w-px bg-slate-800 mx-0.5" />

          {/* Zoom controls */}
          <button
            onClick={() => handleZoom(0.15)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleZoom(-0.15)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetView}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Reset Graph Layout & Position"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div 
        className="flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden"
        onPointerDown={(e) => handlePointerDown(e)}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <svg
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        >
          <defs>
            {/* Arrow Markers for each relation color */}
            {RELATION_PRESETS.map((preset) => (
              <marker
                key={preset.type}
                id={`arrow-${preset.type}`}
                viewBox="0 0 10 10"
                refX="28"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill={preset.color} />
              </marker>
            ))}

            {/* Default Arrow */}
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="28"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#06b6d4" />
            </marker>

            {/* Subtle grid pattern */}
            <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="20" r="0.8" fill="#334155" opacity="0.4" />
            </pattern>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="url(#graph-grid)" />

          {/* Main Transformed Graph Space */}
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Render Links (Edges) */}
            {visibleLinks.map((link) => {
              const sourcePos = positions[link.sourceId];
              const targetPos = positions[link.targetId];
              if (!sourcePos || !targetPos) return null;

              const isHighlighted =
                selectedLinkId === link.id ||
                activeFocusId === link.sourceId ||
                activeFocusId === link.targetId;

              const isDimmed = activeFocusId && !isHighlighted;

              const relationPreset =
                RELATION_PRESETS.find((p) => p.type === link.relationType) ||
                RELATION_PRESETS[0];

              // Bezier curve calculation
              const dx = targetPos.x - sourcePos.x;
              const dy = targetPos.y - sourcePos.y;
              const midX = (sourcePos.x + targetPos.x) / 2;
              const midY = (sourcePos.y + targetPos.y) / 2;

              // Gentle arc curvature perpendicular to line
              const curveOffset = Math.min(Math.max(Math.hypot(dx, dy) * 0.12, 15), 45);
              const angle = Math.atan2(dy, dx) + Math.PI / 2;
              const ctrlX = midX + Math.cos(angle) * curveOffset;
              const ctrlY = midY + Math.sin(angle) * curveOffset;

              const pathData = `M ${sourcePos.x} ${sourcePos.y} Q ${ctrlX} ${ctrlY} ${targetPos.x} ${targetPos.y}`;

              return (
                <g 
                  key={link.id} 
                  className="cursor-pointer transition-opacity duration-200"
                  opacity={isDimmed ? 0.2 : 1}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLinkId(link.id);
                    setSelectedNodeId(null);
                  }}
                >
                  {/* Invisible thick path for easier clicking */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke="transparent"
                    strokeWidth="16"
                  />

                  {/* Visual Line */}
                  <path
                    d={pathData}
                    fill="none"
                    stroke={relationPreset.color}
                    strokeWidth={isHighlighted ? 2.5 : 1.5}
                    strokeDasharray={link.relationType === 'strategic_risk' ? '5,4' : undefined}
                    markerEnd={`url(#arrow-${link.relationType})`}
                    className={`transition-all ${isHighlighted ? 'filter drop-shadow-[0_0_8px_rgba(6,182,212,0.6)]' : ''}`}
                  />

                  {/* Relationship Label Pill along curve */}
                  <g transform={`translate(${ctrlX}, ${ctrlY})`}>
                    <rect
                      x="-45"
                      y="-11"
                      width="90"
                      height="22"
                      rx="6"
                      fill="#090d16"
                      stroke={relationPreset.color}
                      strokeWidth={isHighlighted ? 1.5 : 0.8}
                      opacity="0.95"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill={relationPreset.color}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                    >
                      {link.label || relationPreset.label.split('/')[0].trim()}
                    </text>
                  </g>
                </g>
              );
            })}

            {/* Render Nodes */}
            {visibleMemories.map((mem) => {
              const pos = positions[mem.id] || { x: dimensions.width / 2, y: dimensions.height / 2 };
              const categoryConfig = CATEGORY_COLORS[mem.category] || CATEGORY_COLORS.project;
              const isSelected = selectedNodeId === mem.id;
              const isHovered = hoveredNodeId === mem.id;
              const isConnecting = connectSourceId === mem.id;
              const isConnectedToFocus = connectedNodeIds.has(mem.id);
              const isDimmed = activeFocusId && !isConnectedToFocus;

              const { all } = getNodeLinks(mem.id);

              return (
                <g
                  key={mem.id}
                  transform={`translate(${pos.x}, ${pos.y})`}
                  className="cursor-pointer select-none transition-opacity duration-200"
                  opacity={isDimmed ? 0.25 : 1}
                  onPointerDown={(e) => handlePointerDown(e, mem.id)}
                  onClick={(e) => handleNodeClick(e, mem.id)}
                  onMouseEnter={() => setHoveredNodeId(mem.id)}
                  onMouseLeave={() => setHoveredNodeId(null)}
                >
                  {/* Outer Pulsing Aura when selected or connecting */}
                  {(isSelected || isConnecting) && (
                    <circle
                      cx="0"
                      cy="0"
                      r="52"
                      fill="none"
                      stroke={categoryConfig.hex}
                      strokeWidth="2"
                      strokeDasharray="4,4"
                      className="animate-spin"
                      style={{ animationDuration: '8s' }}
                    />
                  )}

                  {/* Outer glow circle */}
                  <circle
                    cx="0"
                    cy="0"
                    r="38"
                    fill={categoryConfig.hex}
                    opacity={isSelected || isHovered ? 0.25 : 0.12}
                    filter="blur(4px)"
                  />

                  {/* Main Node Hexagon / Circle */}
                  <circle
                    cx="0"
                    cy="0"
                    r="32"
                    fill="#0a0f1d"
                    stroke={isSelected ? '#ffffff' : categoryConfig.hex}
                    strokeWidth={isSelected ? 2.5 : isHovered ? 2 : 1.2}
                    className="transition-all"
                  />

                  {/* Node Inner Icon / Initial */}
                  <text
                    x="0"
                    y="-4"
                    textAnchor="middle"
                    fill={categoryConfig.hex}
                    fontSize="13"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {mem.category.slice(0, 3).toUpperCase()}
                  </text>

                  {/* Connection counter badge */}
                  <g transform="translate(18, -20)">
                    <circle cx="0" cy="0" r="9" fill={categoryConfig.hex} />
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      fill="#090d16"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="monospace"
                    >
                      {all.length}
                    </text>
                  </g>

                  {/* Node Title Label Box below */}
                  <g transform="translate(0, 44)">
                    <rect
                      x="-70"
                      y="-10"
                      width="140"
                      height="20"
                      rx="5"
                      fill="#090d16"
                      stroke="#1e293b"
                      strokeWidth="1"
                      opacity="0.9"
                    />
                    <text
                      x="0"
                      y="3.5"
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="10"
                      fontWeight="600"
                    >
                      {mem.title.length > 20 ? mem.title.slice(0, 18) + '…' : mem.title}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Floating Inspector Panel for Selected Node */}
      {selectedMemory && (
        <div 
          className="absolute right-3 top-16 bottom-3 w-80 md:w-96 bg-slate-900/95 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl z-30 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right-4 duration-200"
          id="node-inspector-panel"
        >
          <div className="space-y-4">
            {/* Top Bar: Category & Close */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border font-semibold ${CATEGORY_COLORS[selectedMemory.category]?.badge}`}>
                  {selectedMemory.category}
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {new Date(selectedMemory.lastUpdated).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleSpeakMemory(selectedMemory)}
                  className={`p-1.5 rounded-lg border transition-colors ${
                    isSpeaking 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
                  }`}
                  title={isSpeaking ? 'Stop speech' : 'Listen to voice summary'}
                >
                  {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Title & Description */}
            <div>
              <h3 className="text-base font-bold text-slate-100 leading-snug">
                {selectedMemory.title}
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed whitespace-pre-wrap max-h-36 overflow-y-auto pr-1">
                {selectedMemory.description}
              </p>
            </div>

            {/* Tags */}
            {selectedMemory.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {selectedMemory.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Connected Links Breakdown */}
            {selectedNodeConnections && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
                    <Link2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>SYNAPTIC CONNECTIONS ({selectedNodeConnections.all.length})</span>
                  </span>
                  <button
                    onClick={() => {
                      setConnectSourceId(selectedMemory.id);
                    }}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium"
                  >
                    + Link to Node
                  </button>
                </div>

                {/* List of Outgoing & Incoming Connections */}
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {selectedNodeConnections.all.length === 0 ? (
                    <div className="p-3 text-center rounded-xl bg-slate-950/60 border border-slate-800/80 text-[11px] text-slate-500">
                      No active links for this memory. Click "+ Link to Node" to establish synergy.
                    </div>
                  ) : (
                    selectedNodeConnections.all.map((link) => {
                      const isOutgoing = link.sourceId === selectedMemory.id;
                      const otherId = isOutgoing ? link.targetId : link.sourceId;
                      const otherMem = memoryMap.get(otherId);
                      const relationPreset = RELATION_PRESETS.find((p) => p.type === link.relationType);

                      return (
                        <div
                          key={link.id}
                          className="p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors flex items-center justify-between gap-2 group"
                        >
                          <div 
                            className="flex-1 cursor-pointer"
                            onClick={() => setSelectedNodeId(otherId)}
                          >
                            <div className="flex items-center gap-1.5 text-[10px] font-mono">
                              <span
                                className="px-1.5 py-0.5 rounded font-semibold"
                                style={{
                                  backgroundColor: `${relationPreset?.color}20`,
                                  color: relationPreset?.color,
                                  border: `1px solid ${relationPreset?.color}40`,
                                }}
                              >
                                {isOutgoing ? `➔ ${link.relationType}` : `⬅ ${link.relationType}`}
                              </span>
                              {link.label && (
                                <span className="text-slate-400 text-[10px] truncate max-w-[120px]">
                                  {link.label}
                                </span>
                              )}
                            </div>
                            <div className="text-xs font-medium text-slate-200 truncate mt-1">
                              {otherMem?.title || 'Unknown Memory'}
                            </div>
                          </div>

                          <button
                            onClick={() => onDeleteLink(link.id)}
                            className="p-1 rounded text-slate-600 hover:text-red-400 hover:bg-slate-900 transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove Link"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
            <button
              onClick={() => onDeleteMemory(selectedMemory.id)}
              className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/20 text-xs transition-colors"
            >
              Delete Memory
            </button>
            <button
              onClick={() => {
                setConnectSourceId(selectedMemory.id);
              }}
              className="px-3 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition-colors"
            >
              Connect to Target
            </button>
          </div>
        </div>
      )}

      {/* Selected Link Inspector */}
      {selectedLink && (
        <div 
          className="absolute right-3 top-16 w-80 bg-slate-900/95 backdrop-blur border border-slate-800 rounded-2xl p-4 shadow-2xl z-30 space-y-3 animate-in fade-in duration-150"
          id="link-inspector-panel"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-semibold text-cyan-400 flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5" />
              <span>RELATIONAL LINK</span>
            </span>
            <button
              onClick={() => setSelectedLinkId(null)}
              className="text-slate-500 hover:text-slate-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-mono">From (Source):</div>
              <div className="text-xs font-semibold text-slate-200 truncate">
                {memoryMap.get(selectedLink.sourceId)?.title || selectedLink.sourceId}
              </div>
            </div>

            <div className="flex items-center justify-center text-cyan-400 text-xs font-mono font-bold">
              ↓ {selectedLink.relationType.toUpperCase()} ↓
            </div>

            <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
              <div className="text-[10px] text-slate-500 uppercase font-mono">To (Target):</div>
              <div className="text-xs font-semibold text-slate-200 truncate">
                {memoryMap.get(selectedLink.targetId)?.title || selectedLink.targetId}
              </div>
            </div>

            {selectedLink.label && (
              <div className="text-xs text-slate-300">
                <span className="text-slate-500 font-mono text-[10px]">Label:</span> {selectedLink.label}
              </div>
            )}

            {selectedLink.notes && (
              <div className="text-xs text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80">
                {selectedLink.notes}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                onDeleteLink(selectedLink.id);
                setSelectedLinkId(null);
              }}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 text-red-300 border border-red-800/50 hover:bg-red-900/60 text-xs font-medium"
            >
              Sever Connection
            </button>
          </div>
        </div>
      )}

      {/* Modal: Create Visual Link */}
      {isLinkingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateLink}
            className="w-full max-w-md bg-slate-900 border border-cyan-500/40 rounded-2xl p-5 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Link2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">Create Memory Link</h3>
                  <p className="text-[11px] text-slate-400">Connect two memories with a logical relationship</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLinkingModalOpen(false)}
                className="text-slate-500 hover:text-slate-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Source and Target Selectors */}
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Source Memory (Origin):</label>
                <select
                  value={linkSource}
                  onChange={(e) => setLinkSource(e.target.value)}
                  className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
                  required
                >
                  <option value="" disabled>Select origin memory...</option>
                  {memories.map((m) => (
                    <option key={m.id} value={m.id}>
                      [{m.category.toUpperCase()}] {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Relationship Type:</label>
                <select
                  value={linkRelation}
                  onChange={(e) => setLinkRelation(e.target.value as MemoryRelationType)}
                  className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
                >
                  {RELATION_PRESETS.map((p) => (
                    <option key={p.type} value={p.type}>
                      {p.label} — {p.desc}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Target Memory (Destination):</label>
                <select
                  value={linkTarget}
                  onChange={(e) => setLinkTarget(e.target.value)}
                  className="w-full bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
                  required
                >
                  <option value="" disabled>Select target memory...</option>
                  {memories
                    .filter((m) => m.id !== linkSource)
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        [{m.category.toUpperCase()}] {m.title}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Connection Label (Optional):</label>
                <input
                  type="text"
                  value={linkLabel}
                  onChange={(e) => setLinkLabel(e.target.value)}
                  placeholder="e.g. Governs Custody, Informs Tech Stack..."
                  className="w-full bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-slate-400 font-medium">Notes / Strategic Justification (Optional):</label>
                <textarea
                  value={linkNotes}
                  onChange={(e) => setLinkNotes(e.target.value)}
                  rows={2}
                  placeholder="Why are these two memories bound together?"
                  className="w-full bg-slate-950 p-2 rounded-xl border border-slate-800 text-xs text-slate-200 outline-none focus:border-cyan-500/50 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsLinkingModalOpen(false)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-slate-200 text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs shadow-sm shadow-cyan-500/20"
              >
                Establish Link
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Bottom Status Bar inside Canvas */}
      <div className="absolute bottom-3 left-3 z-20 pointer-events-none">
        <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur border border-slate-800 text-[11px] font-mono text-slate-400 pointer-events-auto">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-200 font-semibold">{visibleMemories.length} Nodes</span>
          </span>
          <span className="text-slate-600">•</span>
          <span>{visibleLinks.length} Connections</span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-500">Drag to arrange • Click to inspect</span>
        </div>
      </div>
    </div>
  );
};
