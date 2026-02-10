// ============================================================
// StoryForge - Agent Service Contracts
// Vendor-agnostic interface, ready for Microsoft Foundry swap
// ============================================================

import type {
  NewProjectFormData,
  Epic,
  ConversationMessage,
  GeneratedArtifact,
  Persona,
  BusinessRule
} from './domain';

// --- Agent Types ---
export type AgentType =
  | 'context-ingestor'
  | 'questionnaire-discovery'
  | 'requirements-generator'
  | 'acceptance-criteria'
  | 'test-design'
  | 'quality-gate'
  | 'versioning-diff'
  | 'export'
  | 'audit-logging';

// --- Agent Response ---
export interface AgentResponse<T = unknown> {
  success: boolean;
  data: T;
  agentType: AgentType;
  processingTime: number;
  confidence?: number;
}

// --- Context Ingestor ---
export interface ContextAnalysis {
  summary: string;
  detectedDomain: string;
  suggestedCompliance: string[];
  suggestedPersonas: Persona[];
  suggestedBusinessRules: BusinessRule[];
  riskLevel: 'low' | 'medium' | 'high';
}

// --- Questionnaire Discovery ---
export interface QuestionnaireResult {
  messages: ConversationMessage[];
  completedCategories: string[];
  overallProgress: number;
}

// --- Requirements Generator ---
export interface GeneratedRequirements {
  epics: Epic[];
  artifacts: GeneratedArtifact[];
  qualityScore: number;
  complianceCoverage: Record<string, boolean>;
}

// --- Quality Gate ---
export interface QualityReport {
  overallScore: number;
  categories: {
    completeness: number;
    clarity: number;
    testability: number;
    compliance: number;
    consistency: number;
  };
  issues: Array<{
    severity: 'error' | 'warning' | 'info';
    artifact: string;
    message: string;
    suggestion: string;
  }>;
}

// --- Export Result ---
export interface ExportResult {
  platform: string;
  itemsExported: number;
  itemsFailed: number;
  duration: string;
  url: string;
  details: Array<{
    type: string;
    id: string;
    externalId: string;
    status: 'created' | 'updated' | 'failed';
  }>;
}

// --- Versioning & Diff Result ---
export interface VersionDiffResult {
  previousVersion: string;
  nextVersion: string;
  changeType: 'major' | 'minor' | 'patch';
  changelog: string[];
}

// --- Audit Logging Result ---
export interface AuditLoggingResult {
  eventId: string;
  stored: boolean;
  timestamp: string;
}

// --- IAgentService: Vendor-Agnostic Interface ---
export interface IAgentService {
  // Context Ingestor Agent
  analyzeContext(formData: NewProjectFormData): Promise<AgentResponse<ContextAnalysis>>;

  // Questionnaire/Discovery Agent
  generateNextQuestion(
    category: string,
    previousMessages: ConversationMessage[],
    formData: NewProjectFormData
  ): Promise<AgentResponse<ConversationMessage>>;

  // Requirements Generator Agent
  generateRequirements(
    formData: NewProjectFormData,
    conversationHistory: ConversationMessage[],
    contextAnalysis: ContextAnalysis
  ): Promise<AgentResponse<GeneratedRequirements>>;

  // Acceptance Criteria Agent
  enrichAcceptanceCriteria(
    epics: Epic[],
    compliance: string[]
  ): Promise<AgentResponse<Epic[]>>;

  // Test Design Agent
  generateTestCases(
    epics: Epic[],
    compliance: string[]
  ): Promise<AgentResponse<Epic[]>>;

  // Quality Gate Agent
  validateQuality(epics: Epic[]): Promise<AgentResponse<QualityReport>>;

  // Export Agent
  exportToplatform(
    epics: Epic[],
    platform: string,
    projectCode: string
  ): Promise<AgentResponse<ExportResult>>;

  // Versioning & Diff Agent
  generateVersionDiff(
    previousEpics: Epic[],
    nextEpics: Epic[],
    previousVersion: string
  ): Promise<AgentResponse<VersionDiffResult>>;

  // Audit & Logging Agent
  logAuditEvent(
    eventName: string,
    payload: Record<string, unknown>
  ): Promise<AgentResponse<AuditLoggingResult>>;
}
