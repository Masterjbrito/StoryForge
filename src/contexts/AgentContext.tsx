import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { IAgentService } from '@/types/agents';
import type {
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
import { MockAgentService } from '@/services/MockAgentService';
import { FoundryAgentService } from '@/services/FoundryAgentService';

interface AgentContextValue {
  agentService: IAgentService;
  provider: string;
  lastError: string | null;
  lastErrorAt: Date | null;
  debugEvents: Array<{
    id: number;
    at: Date;
    provider: 'foundry' | 'mock';
    stage: 'request' | 'response' | 'error';
    agentType: AgentType;
    url?: string;
    method?: string;
    requestBody?: unknown;
    responseBody?: unknown;
    status?: number;
    threadId?: string;
    runId?: string;
    message?: string;
    durationMs?: number;
  }>;
  clearDebugEvents: () => void;
}

const AgentContext = createContext<AgentContextValue | null>(null);

class FallbackAgentService implements IAgentService {
  private fallbackEnabled = false;
  private notified = false;

  constructor(
    private readonly primary: IAgentService,
    private readonly fallback: IAgentService,
    private readonly onFallback: (error: unknown) => void
  ) {}

  private async runWithFallback<T>(
    primaryCall: () => Promise<T>,
    fallbackCall: () => Promise<T>
  ): Promise<T> {
    if (this.fallbackEnabled) return fallbackCall();
    try {
      return await primaryCall();
    } catch (error) {
      this.fallbackEnabled = true;
      if (!this.notified) {
        this.notified = true;
        this.onFallback(error);
      }
      return fallbackCall();
    }
  }

  analyzeContext(formData: NewProjectFormData): Promise<AgentResponse<ContextAnalysis>> {
    return this.runWithFallback(
      () => this.primary.analyzeContext(formData),
      () => this.fallback.analyzeContext(formData)
    );
  }

  generateNextQuestion(
    category: string,
    previousMessages: ConversationMessage[],
    formData: NewProjectFormData
  ): Promise<AgentResponse<ConversationMessage>> {
    return this.runWithFallback(
      () => this.primary.generateNextQuestion(category, previousMessages, formData),
      () => this.fallback.generateNextQuestion(category, previousMessages, formData)
    );
  }

  generateRequirements(
    formData: NewProjectFormData,
    conversationHistory: ConversationMessage[],
    contextAnalysis: ContextAnalysis
  ): Promise<AgentResponse<GeneratedRequirements>> {
    return this.runWithFallback(
      () => this.primary.generateRequirements(formData, conversationHistory, contextAnalysis),
      () => this.fallback.generateRequirements(formData, conversationHistory, contextAnalysis)
    );
  }

  enrichAcceptanceCriteria(epics: Epic[], compliance: string[]): Promise<AgentResponse<Epic[]>> {
    return this.runWithFallback(
      () => this.primary.enrichAcceptanceCriteria(epics, compliance),
      () => this.fallback.enrichAcceptanceCriteria(epics, compliance)
    );
  }

  generateTestCases(epics: Epic[], compliance: string[]): Promise<AgentResponse<Epic[]>> {
    return this.runWithFallback(
      () => this.primary.generateTestCases(epics, compliance),
      () => this.fallback.generateTestCases(epics, compliance)
    );
  }

  validateQuality(epics: Epic[]): Promise<AgentResponse<QualityReport>> {
    return this.runWithFallback(
      () => this.primary.validateQuality(epics),
      () => this.fallback.validateQuality(epics)
    );
  }

  exportToplatform(epics: Epic[], platform: string, projectCode: string): Promise<AgentResponse<ExportResult>> {
    return this.runWithFallback(
      () => this.primary.exportToplatform(epics, platform, projectCode),
      () => this.fallback.exportToplatform(epics, platform, projectCode)
    );
  }

  generateVersionDiff(
    previousEpics: Epic[],
    nextEpics: Epic[],
    previousVersion: string
  ): Promise<AgentResponse<VersionDiffResult>> {
    return this.runWithFallback(
      () => this.primary.generateVersionDiff(previousEpics, nextEpics, previousVersion),
      () => this.fallback.generateVersionDiff(previousEpics, nextEpics, previousVersion)
    );
  }

  logAuditEvent(
    eventName: string,
    payload: Record<string, unknown>
  ): Promise<AgentResponse<AuditLoggingResult>> {
    return this.runWithFallback(
      () => this.primary.logAuditEvent(eventName, payload),
      () => this.fallback.logAuditEvent(eventName, payload)
    );
  }
}

export function AgentProvider({ children }: { children: ReactNode }) {
  const env = (import.meta as any).env ?? {};
  const configuredProvider = String(env.VITE_AGENT_PROVIDER ?? 'mock').toLowerCase();
  const foundryEndpoint = String(env.VITE_FOUNDRY_ENDPOINT ?? env.VITE_FOUNDRY_BASE_URL ?? '');
  const foundryApiKey = String(env.VITE_FOUNDRY_API_KEY ?? '');
  const foundryApiVersion = String(env.VITE_FOUNDRY_API_VERSION ?? 'v1');
  const foundryProjectId = env.VITE_FOUNDRY_PROJECT_ID ? String(env.VITE_FOUNDRY_PROJECT_ID) : undefined;
  const foundryMode = String(env.VITE_FOUNDRY_MODE ?? 'single-endpoint').toLowerCase() === 'agent-id'
    ? 'agent-id'
    : 'single-endpoint';
  const foundryAuthMode = String(env.VITE_FOUNDRY_AUTH_MODE ?? 'bearer').toLowerCase() === 'api-key'
    ? 'api-key'
    : 'bearer';
  const foundryApiKeyHeader = String(env.VITE_FOUNDRY_API_KEY_HEADER ?? 'api-key');
  // Only use an explicit URL template if the user set one; otherwise the service
  // defaults to the documented /threads/runs endpoint internally.
  const foundryAgentUrlTemplate = env.VITE_FOUNDRY_AGENT_URL_TEMPLATE
    ? String(env.VITE_FOUNDRY_AGENT_URL_TEMPLATE)
    : undefined;
  const foundryAgentIds = {
    'context-ingestor': env.VITE_FOUNDRY_AGENT_CONTEXT_INGESTOR_ID ? String(env.VITE_FOUNDRY_AGENT_CONTEXT_INGESTOR_ID) : undefined,
    'questionnaire-discovery': env.VITE_FOUNDRY_AGENT_QUESTIONNAIRE_DISCOVERY_ID ? String(env.VITE_FOUNDRY_AGENT_QUESTIONNAIRE_DISCOVERY_ID) : undefined,
    'requirements-generator': env.VITE_FOUNDRY_AGENT_REQUIREMENTS_GENERATOR_ID ? String(env.VITE_FOUNDRY_AGENT_REQUIREMENTS_GENERATOR_ID) : undefined,
    'acceptance-criteria': env.VITE_FOUNDRY_AGENT_ACCEPTANCE_CRITERIA_ID ? String(env.VITE_FOUNDRY_AGENT_ACCEPTANCE_CRITERIA_ID) : undefined,
    'test-design': env.VITE_FOUNDRY_AGENT_TEST_DESIGN_ID ? String(env.VITE_FOUNDRY_AGENT_TEST_DESIGN_ID) : undefined,
    'quality-gate': env.VITE_FOUNDRY_AGENT_QUALITY_GATE_ID ? String(env.VITE_FOUNDRY_AGENT_QUALITY_GATE_ID) : undefined,
    'versioning-diff': env.VITE_FOUNDRY_AGENT_VERSIONING_DIFF_ID ? String(env.VITE_FOUNDRY_AGENT_VERSIONING_DIFF_ID) : undefined,
    export: env.VITE_FOUNDRY_AGENT_EXPORT_ID ? String(env.VITE_FOUNDRY_AGENT_EXPORT_ID) : undefined,
    'audit-logging': env.VITE_FOUNDRY_AGENT_AUDIT_LOGGING_ID ? String(env.VITE_FOUNDRY_AGENT_AUDIT_LOGGING_ID) : undefined,
  } as const;
  const initInvalid = configuredProvider === 'foundry' && (!foundryEndpoint || !foundryApiKey);
  const [provider, setProvider] = useState(
    configuredProvider === 'foundry' ? 'Microsoft Foundry' : 'Mock (Development)'
  );
  const [lastError, setLastError] = useState<string | null>(null);
  const [lastErrorAt, setLastErrorAt] = useState<Date | null>(null);
  const [debugEvents, setDebugEvents] = useState<AgentContextValue['debugEvents']>([]);
  const popupShownRef = useRef(false);

  const value = useMemo<AgentContextValue>(() => {
    const mock = new MockAgentService();

    if (configuredProvider !== 'foundry') {
      return {
        agentService: mock,
        provider,
        lastError: null,
        lastErrorAt: null,
        debugEvents,
        clearDebugEvents: () => setDebugEvents([]),
      };
    }

    if (initInvalid) {
      return {
        agentService: mock,
        provider: 'Mock (Fallback)',
        lastError: 'Configuracao Foundry invalida (endpoint/api key em falta).',
        lastErrorAt,
        debugEvents,
        clearDebugEvents: () => setDebugEvents([]),
      };
    }

    try {
      const foundry = new FoundryAgentService({
        endpoint: foundryEndpoint,
        apiKey: foundryApiKey,
        projectId: foundryProjectId,
        apiVersion: foundryApiVersion,
        mode: foundryMode,
        authMode: foundryAuthMode,
        apiKeyHeader: foundryApiKeyHeader,
        agentUrlTemplate: foundryAgentUrlTemplate,
        agentIds: foundryAgentIds,
        onDebug: (event) => {
          setDebugEvents((prev) => {
            const next = [
              ...prev,
              {
                id: Date.now() + Math.floor(Math.random() * 1000),
                at: new Date(),
                provider: 'foundry' as const,
                ...event,
              },
            ];
            return next.slice(-80);
          });
        },
      });

      const safeService = new FallbackAgentService(foundry, mock, (error) => {
        setProvider('Mock (Fallback)');
        const message = error instanceof Error ? error.message : String(error);
        setLastError(message);
        setLastErrorAt(new Date());
        console.error('Foundry failed. Switching to mock.', error);
        if (!popupShownRef.current && typeof window !== 'undefined') {
          popupShownRef.current = true;
          window.alert(
            'Erro ao ligar ao Foundry. O sistema mudou automaticamente para o modo Mock para continuar a funcionar.'
          );
        }
      });

      return {
        agentService: safeService,
        provider,
        lastError,
        lastErrorAt,
        debugEvents,
        clearDebugEvents: () => setDebugEvents([]),
      };
    } catch (error) {
      console.error('Foundry initialization failed. Using mock.', error);
      return {
        agentService: mock,
        provider: 'Mock (Fallback)',
        lastError: error instanceof Error ? error.message : String(error),
        lastErrorAt,
        debugEvents,
        clearDebugEvents: () => setDebugEvents([]),
      };
    }
  }, [
    configuredProvider,
    foundryApiKey,
    foundryApiVersion,
    foundryEndpoint,
    foundryProjectId,
    foundryMode,
    foundryAuthMode,
    foundryApiKeyHeader,
    foundryAgentUrlTemplate,
    foundryAgentIds,
    initInvalid,
    provider,
    lastError,
    lastErrorAt,
    debugEvents,
  ]);

  useEffect(() => {
    if (!initInvalid) return;
    if (popupShownRef.current) return;
    popupShownRef.current = true;
    setProvider('Mock (Fallback)');
    setLastError('Configuracao Foundry invalida (endpoint/api key em falta).');
    setLastErrorAt(new Date());
    if (typeof window !== 'undefined') {
      window.alert('Configuracao Foundry invalida. O sistema vai usar Mock.');
    }
  }, [initInvalid]);

  return (
    <AgentContext.Provider value={value}>
      {children}
    </AgentContext.Provider>
  );
}

export function useAgent() {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error('useAgent must be used within AgentProvider');
  return ctx;
}
