import { ProjectMemoryItem, CodeProject, StrategyDecision, CreativeConcept } from '../types';

const STORAGE_KEYS = {
  MEMORY: 'ed_os_memory_items',
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
];

export function getStoredMemories(): ProjectMemoryItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.MEMORY);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.MEMORY, JSON.stringify(DEFAULT_MEMORIES));
      return DEFAULT_MEMORIES;
    }
    return JSON.parse(data);
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
