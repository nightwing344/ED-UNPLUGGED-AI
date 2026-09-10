export type EDModule = 
  | 'core' 
  | 'builder' 
  | 'research' 
  | 'strategy' 
  | 'whatif'
  | 'legal'
  | 'creative' 
  | 'agents' 
  | 'memory' 
  | 'terminal';

export type ThinkingMode = 'direct' | 'balanced' | 'deep_thinking' | 'outside_box' | 'teacher';

export type TruthCategory = 'fact' | 'strong_evidence' | 'reasonable_inference' | 'personal_analysis' | 'speculation' | 'unknown';

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface EDMessage {
  id: string;
  sender: 'user' | 'ed' | 'agent';
  agentName?: string;
  text: string;
  timestamp: number;
  thinkingMode?: ThinkingMode;
  questions?: string[];
  outsideTheBoxInsights?: string[];
  truthAssessment?: {
    category: TruthCategory;
    explanation: string;
    certaintyScore: number; // 0 to 100
  };
  sources?: { title: string; uri: string }[];
  codeSnippets?: {
    language: string;
    code: string;
    title?: string;
  }[];
  isResetNotice?: boolean;
  suggestedMemory?: {
    title: string;
    category: 'project' | 'decision' | 'preference' | 'context' | 'architecture' | 'legal' | 'unfinished';
    description: string;
    tags: string[];
  };
}

export type MemoryRelationType = 
  | 'governs'
  | 'influences'
  | 'implements'
  | 'strategic_risk'
  | 'depends_on'
  | 'mitigates'
  | 'precedent_for'
  | 'related_to';

export interface MemoryLink {
  id: string;
  sourceId: string;
  targetId: string;
  relationType: MemoryRelationType;
  label?: string;
  notes?: string;
  createdAt: number;
}

export type MemoryCategory = 'project' | 'decision' | 'preference' | 'context' | 'architecture' | 'legal' | 'unfinished';

export interface VaultTagSuggestion {
  category: MemoryCategory;
  categoryLabel?: string;
  reasoning: string;
  tags: string[];
  confidence: number;
  alternativeCategories?: {
    category: MemoryCategory;
    confidence: number;
    reason?: string;
    label?: string;
  }[];
  suggestedConnections?: string[];
}

export interface ProjectMemoryItem {
  id: string;
  title: string;
  category: MemoryCategory;
  description: string;
  tags: string[];
  lastUpdated: number;
  status?: 'active' | 'completed' | 'on_hold';
  notes?: string;
  isPinned?: boolean;
  autoLearned?: boolean;
  linkedMemoryIds?: string[];
}

export interface AgentTask {
  id: string;
  agentType: 'research' | 'coding' | 'sysadmin' | 'creative' | 'strategy' | 'teacher' | 'automation' | 'legal';
  title: string;
  objective: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number; // 0 to 100
  logs: { time: number; text: string; type?: 'info' | 'warn' | 'success' | 'code' }[];
  result?: string;
  timestamp: number;
}

export interface WhatIfScenario {
  id: string;
  prompt: string;
  premiseCategory: 'technological' | 'strategic' | 'legal_regulatory' | 'black_swan' | 'counterfactual' | 'personal_venture';
  practicalPossibilities: {
    title: string;
    probability: 'High' | 'Medium';
    timeframe: string;
    rationale: string;
    engineeringFeasibility: string;
  }[];
  speculativeIdeas: {
    title: string;
    probability: 'Speculative' | 'Low/High-Impact';
    paradigmShift: string;
    unorthodoxAngle: string;
    catalystRequired: string;
  }[];
  cascadingOutcomes: {
    tier: '1st Order (Immediate)' | '2nd Order (Systemic)' | '3rd Order (Unintended)';
    impact: string;
    description: string;
  }[];
  keyVulnerabilities: string[];
  unexpectedOpportunities: string[];
  contingencyActionPlan: string;
  rawAnalysis?: string;
  timestamp: number;
}

export interface LegalAnalysisResult {
  id: string;
  title: string;
  analysisType: 
    | 'family_custody'
    | 'family_divorce'
    | 'family_assets'
    | 'family_support'
    | 'family_evidence'
    | 'contract_review' 
    | 'statute_doctrine' 
    | 'case_analysis' 
    | 'ip_licensing' 
    | 'compliance_risk' 
    | 'claim_evidence';
  summary: string;
  riskRating: 'Low' | 'Moderate' | 'High' | 'Critical';
  keyFindings: string[];
  clausesOrIssues: {
    heading: string;
    riskStatus: 'favorable' | 'caution' | 'high_risk';
    legalImplication: string;
    practicalRemedy: string;
  }[];
  plainEnglishBreakdown: string;
  statutoryOrPrecedentBasis: string;
  recommendedNextSteps: string[];
  disclaimer: string;
  timestamp: number;
}

export interface CustodyScheduleModel {
  name: string;
  type: '2-2-3' | '2-2-5-5' | '7-7' | '3-4-4-3' | 'every-other-weekend' | 'custom';
  parentAPercentage: number;
  parentBPercentage: number;
  description: string;
  pros: string[];
  cons: string[];
  recommendedAges: string;
  exchangeRules: string;
}

export interface BestInterestsFactor {
  factor: string;
  statutoryFocus: string;
  parentEvaluation: string;
  evidenceNeeded: string[];
  courtWeight: 'Critical' | 'High' | 'Moderate';
}

export interface CreativeConcept {
  id: string;
  title: string;
  conceptType: 'invention' | 'concept_art' | 'worldbuilding' | 'engineering' | 'branding';
  inspirationDomain: string[]; // e.g. ["Nikola Tesla", "Scott Robertson", "Korn / Rap Rock Energy"]
  description: string;
  coreMechanism: string;
  outsideTheBoxTwist: string;
  executionSteps: string[];
  timestamp: number;
}

export interface StrategyDecision {
  id: string;
  problemStatement: string;
  assumptionsChallenged: string[];
  provenApproach: string;
  experimentalApproach: string;
  speculativePossibility: string;
  recommendedPath: string;
  riskRewardAssessment: {
    risk: 'Low' | 'Medium' | 'High';
    payoff: 'Incremental' | 'High' | 'Transformational';
    reasoning: string;
  };
  timestamp: number;
}

export interface CodeProject {
  id: string;
  title: string;
  language: string;
  code: string;
  output?: string;
  mvpSteps: {
    step: string;
    done: boolean;
  }[];
  architectureNotes: string;
  updatedAt: number;
}

