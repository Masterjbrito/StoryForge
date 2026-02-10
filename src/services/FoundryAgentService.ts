import type {
  IAgentService,
  AgentResponse,
  ContextAnalysis,
  GeneratedRequirements,
  QualityReport,
  ExportResult,
  VersionDiffResult,
  AuditLoggingResult,
  AgentType,
} from '@/types/agents';
import type { NewProjectFormData, Epic, ConversationMessage } from '@/types/domain';

interface FoundryConfig {
  endpoint: string;
  apiKey: string;
  projectId?: string;
  timeoutMs?: number;
  mode?: 'single-endpoint' | 'agent-id';
  authMode?: 'bearer' | 'api-key';
  apiKeyHeader?: string;
  agentUrlTemplate?: string;
  agentIds?: Partial<Record<AgentType, string>>;
}

type FoundryPayload = Record<string, unknown>;

export class FoundryAgentService implements IAgentService {
  private readonly endpoint: string;
  private readonly apiKey: string;
  private readonly projectId?: string;
  private readonly timeoutMs: number;
  private readonly mode: 'single-endpoint' | 'agent-id';
  private readonly authMode: 'bearer' | 'api-key';
  private readonly apiKeyHeader: string;
  private readonly agentUrlTemplate?: string;
  private readonly agentIds: Partial<Record<AgentType, string>>;

  constructor(config: FoundryConfig) {
    this.endpoint = config.endpoint;
    this.apiKey = config.apiKey;
    this.projectId = config.projectId;
    this.timeoutMs = config.timeoutMs ?? 30000;
    this.mode = config.mode ?? 'single-endpoint';
    this.authMode = config.authMode ?? 'bearer';
    this.apiKeyHeader = config.apiKeyHeader ?? 'api-key';
    this.agentUrlTemplate = config.agentUrlTemplate;
    this.agentIds = config.agentIds ?? {};

    if (!this.endpoint || !this.apiKey) {
      throw new Error('Foundry configuration missing (endpoint/api key).');
    }
    if (this.mode === 'agent-id' && !this.agentUrlTemplate) {
      throw new Error('Foundry configuration missing (agentUrlTemplate for agent-id mode).');
    }
  }

  private getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (this.authMode === 'api-key') {
      headers[this.apiKeyHeader] = this.apiKey;
    } else {
      headers.Authorization = `Bearer ${this.apiKey}`;
    }
    return headers;
  }

  private resolveUrl(agentType: AgentType): string {
    if (this.mode !== 'agent-id') {
      return this.endpoint;
    }

    const agentId = this.agentIds[agentType];
    if (!agentId) {
      throw new Error(`Foundry agent id not configured for ${agentType}`);
    }

    return (this.agentUrlTemplate || '')
      .replace('{projectId}', this.projectId || '')
      .replace('{agentId}', agentId)
      .replace('{agentType}', agentType);
  }

  private async invoke<T>(agentType: AgentType, payload: FoundryPayload): Promise<AgentResponse<T>> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    const startedAt = Date.now();

    try {
      const response = await fetch(this.resolveUrl(agentType), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          agentType,
          projectId: this.projectId,
          payload,
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`Foundry request failed (${response.status}): ${body}`);
      }

      const json = await response.json();
      const processingTime = Date.now() - startedAt;

      return {
        success: json?.success ?? true,
        data: (json?.data ?? json) as T,
        agentType,
        processingTime: json?.processingTime ?? processingTime,
        confidence: json?.confidence,
      };
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error(`Foundry timeout after ${this.timeoutMs}ms`);
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  async analyzeContext(formData: NewProjectFormData): Promise<AgentResponse<ContextAnalysis>> {
    return this.invoke<ContextAnalysis>('context-ingestor', { formData });
  }

  async generateNextQuestion(
    category: string,
    previousMessages: ConversationMessage[],
    formData: NewProjectFormData
  ): Promise<AgentResponse<ConversationMessage>> {
    return this.invoke<ConversationMessage>('questionnaire-discovery', {
      category,
      previousMessages,
      formData,
    });
  }

  async generateRequirements(
    formData: NewProjectFormData,
    conversationHistory: ConversationMessage[],
    contextAnalysis: ContextAnalysis
  ): Promise<AgentResponse<GeneratedRequirements>> {
    return this.invoke<GeneratedRequirements>('requirements-generator', {
      formData,
      conversationHistory,
      contextAnalysis,
    });
  }

  async enrichAcceptanceCriteria(epics: Epic[], compliance: string[]): Promise<AgentResponse<Epic[]>> {
    return this.invoke<Epic[]>('acceptance-criteria', { epics, compliance });
  }

  async generateTestCases(epics: Epic[], compliance: string[]): Promise<AgentResponse<Epic[]>> {
    return this.invoke<Epic[]>('test-design', { epics, compliance });
  }

  async validateQuality(epics: Epic[]): Promise<AgentResponse<QualityReport>> {
    return this.invoke<QualityReport>('quality-gate', { epics });
  }

  async exportToplatform(
    epics: Epic[],
    platform: string,
    projectCode: string
  ): Promise<AgentResponse<ExportResult>> {
    return this.invoke<ExportResult>('export', { epics, platform, projectCode });
  }

  async generateVersionDiff(
    previousEpics: Epic[],
    nextEpics: Epic[],
    previousVersion: string
  ): Promise<AgentResponse<VersionDiffResult>> {
    return this.invoke<VersionDiffResult>('versioning-diff', {
      previousEpics,
      nextEpics,
      previousVersion,
    });
  }

  async logAuditEvent(
    eventName: string,
    payload: Record<string, unknown>
  ): Promise<AgentResponse<AuditLoggingResult>> {
    return this.invoke<AuditLoggingResult>('audit-logging', {
      eventName,
      payload,
    });
  }
}
