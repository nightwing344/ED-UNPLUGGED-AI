import { ProjectMemoryItem, CodeProject, StrategyDecision, CreativeConcept, MemoryLink } from '../types';

const STORAGE_KEYS = {
  MEMORY: 'ed_os_memory_items',
  LINKS: 'ed_os_memory_links',
  PROJECTS: 'ed_os_code_projects',
  STRATEGIES: 'ed_os_strategies',
  CREATIVES: 'ed_os_creatives',
  SETTINGS: 'ed_os_settings',
};

// Initial default memory items embodying the user blueprint
export const DEFAULT_MEMORIES: ProjectMemoryItem[] = [
  {
    id: 'mem-core-identity',
    title: 'Operating Principles & Mindset',
    category: 'preference',
    description: 'Master fundamentals, then think beyond them. Self-taught builder mindset, prioritizing usefulness, truth, and tangible progress.',
    tags: ['mindset', 'craft', 'independence'],
    lastUpdated: Date.now() - 100000,
    status: 'active',
  },
  {
    id: 'mem-influences',
    title: 'Creative & Technical Pillars',
    category: 'context',
    description: 'Inspirations: Nikola Tesla (unconventional invention), Leonardo da Vinci (interdisciplinary mastery), Scott Robertson (industrial concept design), George Bridgman (constructive anatomy), Albrecht Dürer (precision).',
    tags: ['tesla', 'da-vinci', 'scott-robertson', 'bridgman', 'durer'],
    lastUpdated: Date.now() - 90000,
    status: 'active',
  },
  {
    id: 'mem-cultural',
    title: 'Musical & Story Dynamics',
    category: 'preference',
    description: 'Appreciation for intensity, lyrical skill, and originality: Oldies, R&B, Classic Rap, Eminem, Metallica, Korn, Nu-Metal. Storytelling with psychological depth (Batman vs. Joker strategy).',
    tags: ['music', 'rap-metal', 'batman', 'strategy'],
    lastUpdated: Date.now() - 80000,
    status: 'active',
  },
  {
    id: 'mem-family-priority',
    title: 'Family & Legacy Compass',
    category: 'preference',
    description: 'Long-term orientation towards family stability, creating opportunity, and leaving an enduring legacy.',
    tags: ['family', 'legacy', 'future'],
    lastUpdated: Date.now() - 70000,
    status: 'active',
  },
  {
    id: 'mem-legal-custody',
    title: 'Custody Stipulation & Non-Alienation Guardrails',
    category: 'legal',
    description: 'Enforceable 2-2-5-5 parenting time schedule with equal 50/50 overnights, strict 72-hour notice for medical decisions, and anti-alienation non-disparagement covenants for child welfare.',
    tags: ['legal', 'custody', 'best-interests', 'parenting-plan'],
    lastUpdated: Date.now() - 60000,
    status: 'active',
  },
  {
    id: 'mem-strategic-asset',
    title: 'Generational Asset Trust & Defense Strategy',
    category: 'decision',
    description: 'Strategic asset protection plan: separating premarital real estate equity, establishing education trusts for children, and structuring QDRO divisions to preserve capital resilience.',
    tags: ['strategy', 'asset-division', 'protection', 'decision'],
    lastUpdated: Date.now() - 50000,
    status: 'active',
  },
  {
    id: 'mem-arch-offline',
    title: 'Local-First Sovereign AI Architecture',
    category: 'architecture',
    description: 'Zero-cloud vulnerability framework for sensitive family records and strategic plans. Client-side encrypted graph indexing with instant offline retrieval.',
    tags: ['architecture', 'local-first', 'privacy', 'graph'],
    lastUpdated: Date.now() - 40000,
    status: 'active',
  },
];

export const DEFAULT_LINKS: MemoryLink[] = [
  {
    id: 'link-legal-strategic',
    sourceId: 'mem-legal-custody',
    targetId: 'mem-strategic-asset',
    relationType: 'governs',
    label: 'Governs Asset & Custody Rights',
    notes: 'Legal stipulations set the boundary constraints for family asset distribution and parental obligations.',
    createdAt: Date.now() - 50000,
  },
  {
    id: 'link-strategic-family',
    sourceId: 'mem-strategic-asset',
    targetId: 'mem-family-priority',
    relationType: 'implements',
    label: 'Secures Family Legacy',
    notes: 'Directly executes the core commitment to long-term family stability and protected generational wealth.',
    createdAt: Date.now() - 45000,
  },
  {
    id: 'link-identity-arch',
    sourceId: 'mem-core-identity',
    targetId: 'mem-arch-offline',
    relationType: 'influences',
    label: 'Shapes Sovereignty Architecture',
    notes: 'First-principles self-reliance mindset demands a local-first, zero-leakage knowledge repository.',
    createdAt: Date.now() - 40000,
  },
  {
    id: 'link-influences-identity',
    sourceId: 'mem-influences',
    targetId: 'mem-core-identity',
    relationType: 'influences',
    label: 'Foundational Inventions',
    notes: 'Tesla and Da Vinci interdisciplinary mastery informs the foundational builder mindset.',
    createdAt: Date.now() - 35000,
  },
];

export function getStoredMemories(): ProjectMemoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEMORY);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.MEMORY, JSON.stringify(DEFAULT_MEMORIES));
      return DEFAULT_MEMORIES;
    }
    const parsed = JSON.parse(data);
    // If empty or missing legal default, merge with defaults
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.MEMORY, JSON.stringify(DEFAULT_MEMORIES));
      return DEFAULT_MEMORIES;
    }
    return parsed;
  } catch (e) {
    return DEFAULT_MEMORIES;
  }
}

export function saveStoredMemories(items: ProjectMemoryItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.MEMORY, JSON.stringify(items));
  } catch (e) {
    console.error('Failed to save memories to localStorage:', e);
  }
}

export function getStoredMemoryLinks(): MemoryLink[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.LINKS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(DEFAULT_LINKS));
      return DEFAULT_LINKS;
    }
    const parsed = JSON.parse(data);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(DEFAULT_LINKS));
      return DEFAULT_LINKS;
    }
    return parsed;
  } catch (e) {
    return DEFAULT_LINKS;
  }
}

export function saveStoredMemoryLinks(links: MemoryLink[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
  } catch (e) {
    console.error('Failed to save memory links to localStorage:', e);
  }
}

export function getStoredProjects(): CodeProject[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!data) return [];
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export function saveStoredProjects(projects: CodeProject[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects to localStorage:', e);
  }
}
