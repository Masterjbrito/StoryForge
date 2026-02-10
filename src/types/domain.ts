// ============================================================
// StoryForge - Domain Type Definitions
// ============================================================

// --- Navigation ---
export type View =
  | 'dashboard'
  | 'new-project'
  | 'project-builder'
  | 'project-view'
  | 'templates'
  | 'library'
  | 'integrations'
  | 'audit';

// --- Enums / Unions ---
export type ProjectStatus = 'draft' | 'in-progress' | 'published' | 'archived';
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';
export type ArtifactStatus = 'Rascunho' | 'Em Revisão' | 'Aprovado' | 'Exportado';
export type ExportPlatform = 'Jira Cloud' | 'Azure DevOps' | 'Jira Data Center';
export type TestCaseType = 'Functional' | 'Security' | 'Compliance' | 'Performance' | 'Integration';
export type NotificationType = 'success' | 'warning' | 'info' | 'error';
export type AuditActionType = 'export' | 'create' | 'edit' | 'template' | 'integration' | 'ai' | 'compliance' | 'library';

// --- Artifact Counts ---
export interface ArtifactCounts {
  epics: number;
  features: number;
  userStories: number;
  tasks: number;
  testCases: number;
}

// --- Task (within a User Story) ---
export interface Task {
  id: string;
  title: string;
  description: string;
  estimate?: string;
  assignee?: string;
  status: ArtifactStatus;
  technicalNotes?: string;
}

// --- Test Case (within a User Story or Library) ---
export interface TestCase {
  id: string;
  type: TestCaseType;
  priority: Priority;
  title: string;
  preconditions: string[];
  steps: string[];
  expectedResult: string;
  testData?: string;
}

// --- User Story ---
export interface UserStory {
  id: string;
  type: 'userStory';
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
  priority: Priority;
  storyPoints: number;
  status: ArtifactStatus;
  labels: string[];
  expanded: boolean;
  tasks: Task[];
  testCases: TestCase[];
}

// --- Feature ---
export interface Feature {
  id: string;
  type: 'feature';
  title: string;
  description: string;
  priority: Priority;
  status: ArtifactStatus;
  businessRules?: string[];
  acceptanceCriteria?: string[];
  labels?: string[];
  expanded: boolean;
  userStories: UserStory[];
}

// --- Epic ---
export interface Epic {
  id: string;
  type: 'epic';
  title: string;
  description: string;
  businessValue: string;
  priority: Priority;
  status: ArtifactStatus;
  acceptanceCriteria: string[];
  expanded: boolean;
  features: Feature[];
}

// --- Project (full detail for project-view) ---
export interface Project {
  id: number;
  name: string;
  code: string;
  department: string;
  type: string;
  platform: ExportPlatform;
  version: string;
  createdAt: Date;
  lastExport: Date;
  createdBy: string;
  description: string;
  objectives: string[];
  compliance: string[];
  qualityScore: number;
  url: string;
  structure: Epic[];
}

// --- Project Summary (for dashboard list) ---
export interface ProjectSummary {
  id: number;
  name: string;
  code: string;
  department: string;
  type: string;
  platform: ExportPlatform;
  version: string;
  createdAt: Date;
  lastExport: Date;
  status: ProjectStatus;
  artifacts: ArtifactCounts;
  compliance: string[];
  url: string;
  qualityScore: number;
  exportCount: number;
  lastModifiedBy: string;
}

// --- New Project Form Data ---
export interface NewProjectFormData {
  // Step 1 - Identity
  name: string;
  code: string;
  department: string;
  type: string;
  description: string;
  // Step 2 - Banking Context
  businessContext: string;
  targetAudience: string;
  channels: string[];
  existingSystems: string;
  // Step 3 - Compliance
  complianceFrameworks: string[];
  securityRequirements: string[];
  dataClassification: string;
  // Step 4 - Systems & Integrations
  coreSystemIntegrations: string[];
  externalAPIs: string[];
  targetPlatform: ExportPlatform;
  // Step 5 - Documents
  uploadedDocuments: string[];
  referenceLinks: string[];
  // Step 6 - AI Config
  aiMode: 'balanced' | 'rigorous' | 'creative';
  questionDepth: 'standard' | 'deep' | 'exhaustive';
  autoCompliance: boolean;
}

// --- Template ---
export interface Template {
  id: number;
  name: string;
  category: string;
  description: string;
  author: string;
  version: string;
  lastUpdated: Date;
  usage: number;
  rating: number;
  featured: boolean;
  stats: ArtifactCounts;
  compliance: string[];
  tags: string[];
}

// --- Library: Persona ---
export interface Persona {
  id: number;
  name: string;
  description: string;
  goals: string[];
  painPoints: string[];
  technicalProfile: string;
  usageFrequency: string;
  tags: string[];
  usedIn: number;
}

// --- Library: Business Rule ---
export interface BusinessRule {
  id: number;
  category: string;
  name: string;
  rule: string;
  validation: string;
  exceptions: string;
  compliance: string[];
  usedIn: number;
}

// --- Library: Acceptance Criteria Set ---
export interface AcceptanceCriteriaSet {
  id: number;
  category: string;
  feature: string;
  criteria: string[];
  usedIn: number;
}

// --- Library: Test Case Template ---
export interface LibraryTestCase {
  id: number;
  category: string;
  name: string;
  priority: Priority;
  type: TestCaseType;
  steps: string[];
  expectedResult: string;
  usedIn: number;
}

// --- Integration ---
export interface IntegrationCredentials {
  email?: string;
  organization?: string;
  tokenActive: boolean;
}

export interface IntegrationStats {
  totalExports: number;
  lastWeek: number;
  avgTime: string;
}

export interface Integration {
  name: string;
  status: 'connected' | 'disconnected';
  projects: number;
  description: string;
  url: string | null;
  lastSync: Date | null;
  syncFrequency: string | null;
  apiVersion: string;
  features: string[];
  credentials: IntegrationCredentials | null;
  stats: IntegrationStats | null;
}

// --- Audit Log ---
export interface AuditLog {
  id: number;
  action: string;
  actionType: AuditActionType;
  user: string;
  userInitials: string;
  project: string | null;
  projectName: string | null;
  timestamp: Date;
  details: string;
  ipAddress: string;
  duration: string;
  status: 'success' | 'error' | 'warning';
}

// --- Notification ---
export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  project: string | null;
}

// --- Recent Activity (Dashboard) ---
export interface RecentActivity {
  type: string;
  project: string;
  user: string;
  timestamp: Date;
  details: string;
}

// --- Project Builder: Question Category ---
export interface QuestionCategory {
  id: string;
  name: string;
  icon: string;
  questions: number;
  completed: number;
}

// --- Project Builder: Conversation Message ---
export interface ConversationMessage {
  id: number;
  role: 'assistant' | 'user';
  content: string;
  timestamp: Date;
  category?: string;
}

// --- Project Builder: Generated Artifact ---
export interface GeneratedArtifact {
  id: string;
  type: 'epic' | 'feature' | 'userStory' | 'task' | 'testCase';
  title: string;
  confidence: number;
  status: 'generated' | 'reviewed' | 'approved';
  details?: string;
}
