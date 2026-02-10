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
} from '@/types/agents';
import type { NewProjectFormData, Epic, ConversationMessage } from '@/types/domain';
import { MockAgentService } from '@/services/MockAgentService';
import { FoundryAgentService } from '@/services/FoundryAgentService';

interface AgentContextValue {
  agentService: IAgentService;
  provider: string;
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
  const foundryEndpoint = String(env.VITE_FOUNDRY_ENDPOINT ?? '');
  const foundryApiKey = String(env.VITE_FOUNDRY_API_KEY ?? '');
  const foundryProjectId = env.VITE_FOUNDRY_PROJECT_ID ? String(env.VITE_FOUNDRY_PROJECT_ID) : undefined;
  const initInvalid = configuredProvider === 'foundry' && (!foundryEndpoint || !foundryApiKey);
  const [provider, setProvider] = useState(
    configuredProvider === 'foundry' ? 'Microsoft Foundry' : 'Mock (Development)'
  );
  const popupShownRef = useRef(false);

  const value = useMemo<AgentContextValue>(() => {
    const mock = new MockAgentService();

    if (configuredProvider !== 'foundry') {
      return { agentService: mock, provider };
    }

    if (initInvalid) {
      return { agentService: mock, provider: 'Mock (Fallback)' };
    }

    try {
      const foundry = new FoundryAgentService({
        endpoint: foundryEndpoint,
        apiKey: foundryApiKey,
        projectId: foundryProjectId,
      });

      const safeService = new FallbackAgentService(foundry, mock, (error) => {
        setProvider('Mock (Fallback)');
        console.error('Foundry failed. Switching to mock.', error);
        if (!popupShownRef.current && typeof window !== 'undefined') {
          popupShownRef.current = true;
          window.alert(
            'Erro ao ligar ao Foundry. O sistema mudou automaticamente para o modo Mock para continuar a funcionar.'
          );
        }
      });

      return { agentService: safeService, provider };
    } catch (error) {
      console.error('Foundry initialization failed. Using mock.', error);
      return { agentService: mock, provider: 'Mock (Fallback)' };
    }
  }, [configuredProvider, foundryApiKey, foundryEndpoint, foundryProjectId, initInvalid, provider]);

  useEffect(() => {
    if (!initInvalid) return;
    if (popupShownRef.current) return;
    popupShownRef.current = true;
    setProvider('Mock (Fallback)');
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
