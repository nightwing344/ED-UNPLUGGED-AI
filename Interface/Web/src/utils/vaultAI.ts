import { VaultTagSuggestion, MemoryCategory } from '../types';

export const CATEGORY_LABELS: Record<MemoryCategory, string> = {
  legal: 'Legal & Risk Audit',
  decision: 'Architecture Decision / Strategy',
  project: 'Projects & MVPs',
  architecture: 'Tech Stack Specs',
  preference: 'User Principles & Taste',
  context: 'Context & Influences',
  unfinished: 'Unfinished Work',
};

export async function requestVaultTagSuggestions(params: {
  title: string;
  description: string;
  existingTags?: string[];
  currentCategory?: string;
  signal?: AbortSignal;
}): Promise<VaultTagSuggestion> {
  const response = await fetch('/api/ed/vault/suggest-tags', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
    signal: params.signal,
  });

  if (!response.ok) {
    throw new Error(`Tagging engine responded with HTTP ${response.status}`);
  }

  const data: VaultTagSuggestion = await response.json();
  if (!data.categoryLabel && data.category && CATEGORY_LABELS[data.category]) {
    data.categoryLabel = CATEGORY_LABELS[data.category];
  }
  if (data.alternativeCategories) {
    data.alternativeCategories = data.alternativeCategories.map((alt) => ({
      ...alt,
      label: alt.label || CATEGORY_LABELS[alt.category] || alt.category,
    }));
  }

  return data;
}
