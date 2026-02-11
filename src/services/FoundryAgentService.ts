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
  apiVersion?: string;
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
  private readonly apiVersion: string;
  private readonly mode: 'single-endpoint' | 'agent-id';
  private readonly authMode: 'bearer' | 'api-key';
  private readonly apiKeyHeader: string;
  private readonly agentUrlTemplate?: string;
  private readonly agentIds: Partial<Record<AgentType, string>>;

  constructor(config: FoundryConfig) {
    this.endpoint = config.endpoint;
    this.apiKey = config.apiKey;
    this.projectId = config.projectId;
    this.timeoutMs = config.timeoutMs ?? 60000;
    this.apiVersion = config.apiVersion ?? 'v1';
    this.mode = config.mode ?? 'single-endpoint';
    this.authMode = config.authMode ?? 'bearer';
    this.apiKeyHeader = config.apiKeyHeader ?? 'api-key';
    this.agentUrlTemplate = config.agentUrlTemplate;
    this.agentIds = config.agentIds ?? {};

    if (!this.endpoint || !this.apiKey) {
      throw new Error('Foundry configuration missing (endpoint/api key).');
    }
    if (this.mode === 'agent-id' && !this.agentUrlTemplate && !this.endpoint) {
      throw new Error('Foundry configuration missing (agentUrlTemplate or endpoint for agent-id mode).');
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

  /** Primary URL: POST {endpoint}/threads/runs?api-version={v} (Create Thread and Run) */
  private resolveThreadsRunsUrl(): string {
    const base = this.endpoint.replace(/\/$/, '');
    return `${base}/threads/runs?api-version=${encodeURIComponent(this.apiVersion)}`;
  }

  private resolveAgentUrlTemplate(): string {
    if (this.agentUrlTemplate) return this.agentUrlTemplate;
    const base = this.endpoint.replace(/\/$/, '');
    return `${base}/agents/{agentId}/runs?api-version=${encodeURIComponent(this.apiVersion)}`;
  }

  private resolveBaseUrl(agentType: AgentType): string {
    if (this.mode !== 'agent-id') {
      return this.endpoint;
    }

    const agentId = this.agentIds[agentType];
    if (!agentId) {
      throw new Error(`Foundry agent id not configured for ${agentType}`);
    }

    return this.resolveAgentUrlTemplate()
      .replace('{projectId}', this.projectId || '')
      .replace('{agentId}', agentId)
      .replace('{agentType}', agentType);
  }

  private buildCandidateUrls(agentType: AgentType): string[] {
    // Primary: the documented Foundry endpoint (threads/runs)
    const threadsRunsUrl = this.resolveThreadsRunsUrl();
    const urls = new Set<string>([threadsRunsUrl]);

    // Fallback: legacy per-agent URL patterns
    if (this.mode === 'agent-id' && this.agentIds[agentType]) {
      try {
        const legacyUrl = this.resolveBaseUrl(agentType);
        urls.add(legacyUrl);
        if (legacyUrl.includes('/runs?')) {
          urls.add(legacyUrl.replace('/runs?', '/runs:create?'));
        }
        if (legacyUrl.includes('/agents/')) {
          urls.add(legacyUrl.replace('/agents/', '/assistants/'));
        }
      } catch { /* skip if agent id missing */ }
    }

    return Array.from(urls);
  }

  private buildCandidateBodies(agentType: AgentType, payload: FoundryPayload, agentId?: string): unknown[] {
    const inputText = JSON.stringify({
      source: 'storyforge',
      projectId: this.projectId,
      agentType,
      payload,
    });

    const bodies: unknown[] = [];

    // Primary: documented Foundry "Create Thread and Run" body format
    if (agentId) {
      bodies.push({
        assistant_id: agentId,
        thread: {
          messages: [{ role: 'user', content: inputText }],
        },
      });
    }

    // Fallback formats for compatibility
    bodies.push(
      {
        input: inputText,
        metadata: { source: 'storyforge', agentType, projectId: this.projectId },
      },
      {
        thread: {
          messages: [{ role: 'user', content: inputText }],
        },
        metadata: { source: 'storyforge', agentType, projectId: this.projectId },
      },
      {
        agentType,
        projectId: this.projectId,
        payload,
      },
    );

    return bodies;
  }

  private tryExtractText(value: unknown): string | undefined {
    if (typeof value === 'string') return value;
    if (!value || typeof value !== 'object') return undefined;

    const obj = value as Record<string, unknown>;
    const direct = obj.output_text || obj.outputText || obj.text || obj.content || obj.message;
    if (typeof direct === 'string') return direct;

    const output = obj.output;
    if (Array.isArray(output)) {
      for (const item of output) {
        if (item && typeof item === 'object') {
          const text = (item as Record<string, unknown>).text;
          if (typeof text === 'string') return text;
        }
      }
    }

    return undefined;
  }

  private normalizeByAgent<T>(agentType: AgentType, responseJson: unknown): T {
    const root = (responseJson && typeof responseJson === 'object')
      ? (responseJson as Record<string, unknown>)
      : {};
    const data = (root.data ?? root) as Record<string, unknown>;
    const text = this.tryExtractText(root) ?? this.tryExtractText(data);

    switch (agentType) {
      case 'questionnaire-discovery': {
        const mapped: ConversationMessage = {
          id: Date.now(),
          role: 'assistant',
          content: (typeof data.content === 'string' && data.content) || text || 'Pode detalhar melhor este ponto funcional?',
          timestamp: new Date(),
          category: typeof data.category === 'string' ? data.category : undefined,
        };
        return mapped as T;
      }

      case 'context-ingestor': {
        const mapped: ContextAnalysis = {
          summary: (typeof data.summary === 'string' && data.summary) || text || 'Contexto analisado.',
          detectedDomain: (typeof data.detectedDomain === 'string' && data.detectedDomain) || 'Banking',
          suggestedCompliance: Array.isArray(data.suggestedCompliance) ? (data.suggestedCompliance as string[]) : ['PSD2', 'SCA', 'GDPR'],
          suggestedPersonas: Array.isArray(data.suggestedPersonas) ? (data.suggestedPersonas as any[]) : [],
          suggestedBusinessRules: Array.isArray(data.suggestedBusinessRules) ? (data.suggestedBusinessRules as any[]) : [],
          riskLevel: (data.riskLevel as 'low' | 'medium' | 'high') || 'medium',
        };
        return mapped as T;
      }

      case 'quality-gate': {
        const mapped: QualityReport = {
          overallScore: Number(data.overallScore ?? 85),
          categories: {
            completeness: Number((data.categories as any)?.completeness ?? 80),
            clarity: Number((data.categories as any)?.clarity ?? 80),
            testability: Number((data.categories as any)?.testability ?? 80),
            compliance: Number((data.categories as any)?.compliance ?? 80),
            consistency: Number((data.categories as any)?.consistency ?? 80),
          },
          issues: Array.isArray(data.issues) ? (data.issues as any[]) : [],
        };
        return mapped as T;
      }

      case 'export': {
        const mapped: ExportResult = {
          platform: String(data.platform ?? 'Unknown'),
          itemsExported: Number(data.itemsExported ?? 0),
          itemsFailed: Number(data.itemsFailed ?? 0),
          duration: String(data.duration ?? 'n/a'),
          url: String(data.url ?? ''),
          details: Array.isArray(data.details) ? (data.details as any[]) : [],
        };
        return mapped as T;
      }

      case 'versioning-diff': {
        const mapped: VersionDiffResult = {
          previousVersion: String(data.previousVersion ?? 'v1.0.0'),
          nextVersion: String(data.nextVersion ?? 'v1.0.1'),
          changeType: (data.changeType as 'major' | 'minor' | 'patch') || 'patch',
          changelog: Array.isArray(data.changelog) ? (data.changelog as string[]) : ['No changelog returned by Foundry'],
        };
        return mapped as T;
      }

      case 'audit-logging': {
        const mapped: AuditLoggingResult = {
          eventId: String(data.eventId ?? `AUD-${Date.now()}`),
          stored: Boolean(data.stored ?? true),
          timestamp: String(data.timestamp ?? new Date().toISOString()),
        };
        return mapped as T;
      }

      default:
        return (data as unknown) as T;
    }
  }

  /**
   * Poll a Foundry run until it reaches a terminal status.
   * Returns the final run object when completed, or throws on failure/timeout.
   */
  private async pollRun(
    threadId: string,
    runId: string,
    signal: AbortSignal,
    deadline: number
  ): Promise<Record<string, unknown>> {
    const base = this.endpoint.replace(/\/$/, '');
    const pollUrl = `${base}/threads/${threadId}/runs/${runId}?api-version=${encodeURIComponent(this.apiVersion)}`;
    const pollIntervalMs = 1000;
    const terminalStatuses = new Set(['completed', 'failed', 'cancelled', 'expired', 'incomplete']);

    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, pollIntervalMs));
      if (signal.aborted) throw new Error('Foundry poll aborted');

      const resp = await fetch(pollUrl, {
        method: 'GET',
        headers: this.getHeaders(),
        signal,
      });

      if (!resp.ok) {
        const txt = await resp.text().catch(() => '');
        throw new Error(`Foundry poll error [${resp.status}]: ${txt.slice(0, 200)}`);
      }

      const run = await resp.json() as Record<string, unknown>;
      const status = String(run.status ?? '');

      if (status === 'completed') return run;
      if (terminalStatuses.has(status) && status !== 'completed') {
        throw new Error(`Foundry run ${runId} ended with status: ${status}. ${JSON.stringify(run.last_error ?? '')}`);
      }
      // still in_progress / queued — keep polling
    }

    throw new Error(`Foundry run ${runId} polling timed out`);
  }

  /**
   * After a run completes, fetch the messages from the thread to get the agent's response.
   */
  private async fetchThreadMessages(
    threadId: string,
    signal: AbortSignal
  ): Promise<unknown> {
    const base = this.endpoint.replace(/\/$/, '');
    const url = `${base}/threads/${threadId}/messages?api-version=${encodeURIComponent(this.apiVersion)}`;

    const resp = await fetch(url, {
      method: 'GET',
      headers: this.getHeaders(),
      signal,
    });

    if (!resp.ok) {
      const txt = await resp.text().catch(() => '');
      throw new Error(`Foundry messages fetch error [${resp.status}]: ${txt.slice(0, 200)}`);
    }

    const json = await resp.json() as Record<string, unknown>;
    const data = Array.isArray(json.data) ? json.data : [];

    // Find the last assistant message
    for (const msg of data) {
      if (msg && typeof msg === 'object' && (msg as any).role === 'assistant') {
        const content = (msg as any).content;
        if (Array.isArray(content)) {
          for (const block of content) {
            if (block?.type === 'text' && block?.text?.value) {
              return block.text.value;
            }
          }
        }
        if (typeof content === 'string') return content;
      }
    }

    return json;
  }

  private async invoke<T>(agentType: AgentType, payload: FoundryPayload): Promise<AgentResponse<T>> {
    const controller = new AbortController();
    const deadline = Date.now() + this.timeoutMs;
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);
    const startedAt = Date.now();

    try {
      const agentId = this.mode === 'agent-id' ? this.agentIds[agentType] : undefined;
      const urls = this.buildCandidateUrls(agentType);
      const bodies = this.buildCandidateBodies(agentType, payload, agentId);
      const errors: string[] = [];

      for (const url of urls) {
        for (const body of bodies) {
          try {
            const response = await fetch(url, {
              method: 'POST',
              headers: this.getHeaders(),
              body: JSON.stringify(body),
              signal: controller.signal,
            });

            if (!response.ok) {
              const bodyText = await response.text().catch(() => '');
              errors.push(`[${response.status}] ${url} :: ${bodyText.slice(0, 180)}`);
              continue;
            }

            const json = await response.json() as Record<string, unknown>;

            // If response is a run object (threads/runs endpoint), poll until complete
            const isRunObject = json.id && json.thread_id && json.status;
            let responseData: unknown;

            if (isRunObject) {
              const threadId = String(json.thread_id);
              const runId = String(json.id);
              const status = String(json.status);

              if (status !== 'completed') {
                await this.pollRun(threadId, runId, controller.signal, deadline);
              }

              // Fetch the assistant's response from the thread messages
              responseData = await this.fetchThreadMessages(threadId, controller.signal);

              // Try to parse as JSON if the agent returns structured data
              if (typeof responseData === 'string') {
                try {
                  responseData = JSON.parse(responseData);
                } catch { /* keep as string */ }
              }
            } else {
              responseData = json;
            }

            const processingTime = Date.now() - startedAt;
            const normalized = this.normalizeByAgent<T>(agentType, responseData);

            return {
              success: true,
              data: normalized,
              agentType,
              processingTime,
              confidence: Number((json as any)?.confidence ?? 0.85),
            };
          } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            errors.push(`[network] ${url} :: ${msg}`);
          }
        }
      }

      throw new Error(`Foundry request failed for ${agentType}. Attempts:\n${errors.join('\n')}`);
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
