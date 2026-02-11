import { useEffect, useState } from 'react';
import { Link2, CheckCircle2, XCircle, Settings, RefreshCw, ExternalLink, Clock, AlertCircle, Activity } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAgent } from '@/contexts/AgentContext';
import { useAudit } from '@/contexts/AuditContext';

type View =
  | 'dashboard'
  | 'new-project'
  | 'project-builder'
  | 'project-view'
  | 'templates'
  | 'library'
  | 'integrations'
  | 'audit';

interface IntegrationsProps {
  onNavigate?: (view: View) => void;
}

export function Integrations({ onNavigate }: IntegrationsProps = {}) {
  const {
    agentService,
    provider,
    providerId,
    setProviderId,
    foundrySettings,
    updateFoundrySettings,
  } = useAgent();
  const { logAction } = useAudit();

  const [selectedProvider, setSelectedProvider] = useState(providerId);
  const [draftFoundrySettings, setDraftFoundrySettings] = useState(foundrySettings);

  useEffect(() => {
    setSelectedProvider(providerId);
  }, [providerId]);

  useEffect(() => {
    setDraftFoundrySettings(foundrySettings);
  }, [foundrySettings]);

  const setAgentId = (key: keyof typeof foundrySettings.agentIds, value: string) => {
    setDraftFoundrySettings((prev) => ({
      ...prev,
      agentIds: {
        ...prev.agentIds,
        [key]: value || undefined,
      },
    }));
  };

  const applyProviderConfig = () => {
    updateFoundrySettings(draftFoundrySettings);
    setProviderId(selectedProvider);
    window.alert(`Provider aplicado: ${selectedProvider}.`);
  };

  const handleSync = async (integrationName: string) => {
    try {
      const result = await agentService.exportToplatform([], integrationName, 'SYNC-CHECK');
      logAction({
        action: 'Sincronizacao de integracao',
        actionType: 'integration',
        user: 'Susana Gamito',
        userInitials: 'SG',
        project: null,
        projectName: integrationName,
        details: `Sync concluido (${result.data.duration})`,
        status: 'success',
      });
      window.alert(`Sincronizacao concluida para ${integrationName}.`);
    } catch (error) {
      logAction({
        action: 'Falha na sincronizacao',
        actionType: 'integration',
        user: 'Susana Gamito',
        userInitials: 'SG',
        project: null,
        projectName: integrationName,
        details: error instanceof Error ? error.message : 'Erro desconhecido',
        status: 'error',
      });
      window.alert(`Falha na sincronizacao de ${integrationName}.`);
    }
  };

  const integrations = [
    {
      name: 'Jira Cloud',
      status: 'connected',
      projects: 12,
      description: 'Atlassian Jira Cloud - Gestao de projetos e tracking de issues',
      url: 'https://millennium-bcp.atlassian.net',
      lastSync: new Date('2026-01-09T08:30:00'),
      syncFrequency: 'A cada exportacao',
      apiVersion: 'REST API v3',
      features: [
        'Criacao automatica de Epics, Stories, Tasks',
        'Sincronizacao de status e assignees',
        'Exportacao de Test Cases para Xray',
        'Labels de compliance automaticos',
      ],
      stats: { totalExports: 47, lastWeek: 8, avgTime: '12s' },
    },
    {
      name: 'Azure DevOps',
      status: 'connected',
      projects: 8,
      description: 'Microsoft Azure DevOps - Gestao de work items e pipelines',
      url: 'https://dev.azure.com/millenniumbcp',
      lastSync: new Date('2026-01-08T16:45:00'),
      syncFrequency: 'A cada exportacao',
      apiVersion: 'REST API 7.0',
      features: [
        'Criacao de Epics, Features, User Stories',
        'Integracao com Azure Boards',
        'Test Plans automaticos',
        'Links entre work items',
      ],
      stats: { totalExports: 32, lastWeek: 5, avgTime: '15s' },
    },
    {
      name: 'Jira Data Center',
      status: 'disconnected',
      projects: 0,
      description: 'Jira Data Center on-premise para ambientes com requisitos de compliance especificos',
      url: null,
      lastSync: null,
      syncFrequency: null,
      apiVersion: 'REST API v2/v3',
      features: [
        'Instalacao on-premise para compliance',
        'Controlo total de dados',
        'Customizacao avancada de workflows',
        'Integracao com AD/LDAP corporativo',
      ],
      stats: null,
    },
  ] as const;

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours < 1) return 'Ha menos de 1 hora';
    if (diffHours < 24) return `Ha ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Ha ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">Integracoes</h1>
        <p className="text-slate-600">Gestao de conectores e configuracao de provider para agentes de IA.</p>
      </div>

      <Card className="p-6 border-slate-200 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Provider de Agentes (Admin)</h2>
            <p className="text-sm text-slate-600">Seleciona e configura o provider runtime dos agentes.</p>
          </div>
          <Badge variant="secondary">Ativo: {provider}</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="space-y-2">
            <Label htmlFor="provider-select">Provider</Label>
            <select
              id="provider-select"
              className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm bg-white"
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value as typeof selectedProvider)}
            >
              <option value="foundry">Microsoft Foundry</option>
              <option value="mock">Mock (Development)</option>
              <option value="openai">OpenAI (Mock Bridge)</option>
              <option value="claude">Claude (Mock Bridge)</option>
            </select>
          </div>
          <div className="md:col-span-2 p-3 rounded-md border border-amber-200 bg-amber-50 text-amber-800 text-xs">
            OpenAI e Claude ficam preparados para configuracao nesta UI; enquanto nao houver cliente dedicado,
            correm em modo Mock Bridge para nao quebrar o fluxo.
          </div>
        </div>

        {selectedProvider === 'foundry' && (
          <div className="space-y-4">
            <Separator />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fd-endpoint">Foundry Endpoint</Label>
                <Input
                  id="fd-endpoint"
                  value={draftFoundrySettings.endpoint}
                  onChange={(e) => setDraftFoundrySettings((prev) => ({ ...prev, endpoint: e.target.value }))}
                  placeholder="https://<resource>.services.ai.azure.com/api/projects/<project>"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fd-api-key">Foundry API Key / Bearer</Label>
                <Input
                  id="fd-api-key"
                  type="password"
                  value={draftFoundrySettings.apiKey}
                  onChange={(e) => setDraftFoundrySettings((prev) => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Token"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fd-project-id">Project ID</Label>
                <Input
                  id="fd-project-id"
                  value={draftFoundrySettings.projectId ?? ''}
                  onChange={(e) => setDraftFoundrySettings((prev) => ({ ...prev, projectId: e.target.value || undefined }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fd-api-version">API Version</Label>
                <Input
                  id="fd-api-version"
                  value={draftFoundrySettings.apiVersion}
                  onChange={(e) => setDraftFoundrySettings((prev) => ({ ...prev, apiVersion: e.target.value }))}
                  placeholder="v1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fd-mode">Modo</Label>
                <select
                  id="fd-mode"
                  className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm bg-white"
                  value={draftFoundrySettings.mode}
                  onChange={(e) =>
                    setDraftFoundrySettings((prev) => ({
                      ...prev,
                      mode: e.target.value === 'agent-id' ? 'agent-id' : 'single-endpoint',
                    }))
                  }
                >
                  <option value="agent-id">agent-id</option>
                  <option value="single-endpoint">single-endpoint</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fd-auth-mode">Auth Mode</Label>
                <select
                  id="fd-auth-mode"
                  className="w-full h-10 rounded-md border border-slate-300 px-3 text-sm bg-white"
                  value={draftFoundrySettings.authMode}
                  onChange={(e) =>
                    setDraftFoundrySettings((prev) => ({
                      ...prev,
                      authMode: e.target.value === 'api-key' ? 'api-key' : 'bearer',
                    }))
                  }
                >
                  <option value="bearer">bearer</option>
                  <option value="api-key">api-key</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fd-api-key-header">API Key Header</Label>
                <Input
                  id="fd-api-key-header"
                  value={draftFoundrySettings.apiKeyHeader}
                  onChange={(e) => setDraftFoundrySettings((prev) => ({ ...prev, apiKeyHeader: e.target.value }))}
                  placeholder="api-key"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input value={draftFoundrySettings.agentIds['context-ingestor'] ?? ''} onChange={(e) => setAgentId('context-ingestor', e.target.value)} placeholder="Agent ID - Context Ingestor" />
              <Input value={draftFoundrySettings.agentIds['questionnaire-discovery'] ?? ''} onChange={(e) => setAgentId('questionnaire-discovery', e.target.value)} placeholder="Agent ID - Questionnaire Discovery" />
              <Input value={draftFoundrySettings.agentIds['requirements-generator'] ?? ''} onChange={(e) => setAgentId('requirements-generator', e.target.value)} placeholder="Agent ID - Requirements Generator" />
              <Input value={draftFoundrySettings.agentIds['acceptance-criteria'] ?? ''} onChange={(e) => setAgentId('acceptance-criteria', e.target.value)} placeholder="Agent ID - Acceptance Criteria" />
              <Input value={draftFoundrySettings.agentIds['test-design'] ?? ''} onChange={(e) => setAgentId('test-design', e.target.value)} placeholder="Agent ID - Test Design" />
              <Input value={draftFoundrySettings.agentIds['quality-gate'] ?? ''} onChange={(e) => setAgentId('quality-gate', e.target.value)} placeholder="Agent ID - Quality Gate" />
              <Input value={draftFoundrySettings.agentIds['versioning-diff'] ?? ''} onChange={(e) => setAgentId('versioning-diff', e.target.value)} placeholder="Agent ID - Versioning Diff" />
              <Input value={draftFoundrySettings.agentIds.export ?? ''} onChange={(e) => setAgentId('export', e.target.value)} placeholder="Agent ID - Export" />
              <Input value={draftFoundrySettings.agentIds['audit-logging'] ?? ''} onChange={(e) => setAgentId('audit-logging', e.target.value)} placeholder="Agent ID - Audit Logging" />
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-end">
          <Button onClick={applyProviderConfig} className="gap-2">
            <Settings className="w-4 h-4" />
            Aplicar Configuracao
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">2</p>
              <p className="text-xs text-slate-600">Integracoes Ativas</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">20</p>
              <p className="text-xs text-slate-600">Projetos Sincronizados</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">79</p>
              <p className="text-xs text-slate-600">Exportacoes (Total)</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6">
        {integrations.map((integration) => (
          <Card key={integration.name} className="border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${integration.status === 'connected' ? 'bg-blue-100' : 'bg-slate-100'}`}>
                    <Link2 className={`w-7 h-7 ${integration.status === 'connected' ? 'text-blue-600' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-semibold text-slate-900">{integration.name}</h3>
                      {integration.status === 'connected' ? (
                        <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Conectado
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <XCircle className="w-3 h-3 mr-1" />
                          Desconectado
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{integration.description}</p>
                  </div>
                </div>
                <Button variant={integration.status === 'connected' ? 'outline' : 'default'} className="gap-2">
                  <Settings className="w-4 h-4" />
                  {integration.status === 'connected' ? 'Configurar' : 'Conectar'}
                </Button>
              </div>
            </div>

            <div className="p-6">
              {integration.status === 'connected' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Activity className="w-4 h-4 text-slate-500" />
                        <p className="text-xs font-medium text-slate-900">Projetos Sincronizados</p>
                      </div>
                      <p className="text-2xl font-semibold text-slate-900">{integration.projects}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <p className="text-xs font-medium text-slate-900">Ultima Sincronizacao</p>
                      </div>
                      <p className="text-sm text-slate-700">{integration.lastSync && formatRelativeTime(integration.lastSync)}</p>
                      <p className="text-xs text-slate-500">{integration.lastSync && formatDateTime(integration.lastSync)}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <RefreshCw className="w-4 h-4 text-slate-500" />
                        <p className="text-xs font-medium text-slate-900">Frequencia</p>
                      </div>
                      <p className="text-sm text-slate-700">{integration.syncFrequency}</p>
                    </div>
                  </div>

                  <Separator />

                  {integration.stats && (
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="p-3 bg-slate-50 border-slate-200">
                        <p className="text-xs text-slate-600 mb-1">Total de Exportacoes</p>
                        <p className="text-xl font-semibold text-slate-900">{integration.stats.totalExports}</p>
                      </Card>
                      <Card className="p-3 bg-slate-50 border-slate-200">
                        <p className="text-xs text-slate-600 mb-1">Ultima Semana</p>
                        <p className="text-xl font-semibold text-slate-900">{integration.stats.lastWeek}</p>
                      </Card>
                      <Card className="p-3 bg-slate-50 border-slate-200">
                        <p className="text-xs text-slate-600 mb-1">Tempo Medio</p>
                        <p className="text-xl font-semibold text-slate-900">{integration.stats.avgTime}</p>
                      </Card>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Funcionalidades Disponiveis</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {integration.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-xs text-slate-600">
                      {integration.url && (
                        <div className="flex items-center gap-2">
                          <ExternalLink className="w-4 h-4" />
                          <a href={integration.url} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 underline">
                            {integration.url}
                          </a>
                        </div>
                      )}
                      <div>
                        <span className="font-medium">API:</span> {integration.apiVersion}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="gap-2" onClick={() => void handleSync(integration.name)}>
                        <RefreshCw className="w-4 h-4" />
                        Sincronizar Agora
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-700">
                        Desconectar
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Funcionalidades Disponiveis</h4>
                    <ul className="grid grid-cols-2 gap-2">
                      {integration.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                          <CheckCircle2 className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Separator />
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">Como conectar {integration.name}</p>
                        <p className="text-sm text-blue-700">
                          Configure um Personal Access Token com permissao de escrita e clique em "Conectar".
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-6 border-slate-200 bg-slate-50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Precisa de ajuda com integracoes?</h3>
            <p className="text-sm text-slate-600 mb-3">
              Consulte a documentacao tecnica para configurar tokens, permissoes e troubleshooting.
            </p>
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Ver Documentacao
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
