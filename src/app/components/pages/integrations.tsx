import { Link2, CheckCircle2, XCircle, Settings, RefreshCw, ExternalLink, Calendar, Clock, AlertCircle, Activity } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
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
  const { agentService } = useAgent();
  const { logAction } = useAudit();

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
      description: 'Atlassian Jira Cloud - Gestão de projetos e tracking de issues',
      url: 'https://millennium-bcp.atlassian.net',
      lastSync: new Date('2026-01-09T08:30:00'),
      syncFrequency: 'A cada exportação',
      apiVersion: 'REST API v3',
      features: [
        'Criação automática de Epics, Stories, Tasks',
        'Sincronização de status e assignees',
        'Exportação de Test Cases para Xray',
        'Labels de compliance automáticos'
      ],
      credentials: {
        email: 'storyforge@millenniumbcp.pt',
        tokenActive: true
      },
      stats: {
        totalExports: 47,
        lastWeek: 8,
        avgTime: '12s'
      }
    },
    { 
      name: 'Azure DevOps', 
      status: 'connected', 
      projects: 8,
      description: 'Microsoft Azure DevOps - Gestão de work items e pipelines',
      url: 'https://dev.azure.com/millenniumbcp',
      lastSync: new Date('2026-01-08T16:45:00'),
      syncFrequency: 'A cada exportação',
      apiVersion: 'REST API 7.0',
      features: [
        'Criação de Epics, Features, User Stories',
        'Integração com Azure Boards',
        'Test Plans automáticos',
        'Links entre work items'
      ],
      credentials: {
        organization: 'millenniumbcp',
        tokenActive: true
      },
      stats: {
        totalExports: 32,
        lastWeek: 5,
        avgTime: '15s'
      }
    },
    { 
      name: 'Jira Data Center', 
      status: 'disconnected', 
      projects: 0,
      description: 'Jira Data Center on-premise - Para ambientes com requisitos de compliance específicos',
      url: null,
      lastSync: null,
      syncFrequency: null,
      apiVersion: 'REST API v2/v3',
      features: [
        'Instalação on-premise para compliance',
        'Controlo total de dados',
        'Customização avançada de workflows',
        'Integração com AD/LDAP corporativo'
      ],
      credentials: null,
      stats: null
    },
  ];

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Há menos de 1 hora';
    if (diffHours < 24) return `Há ${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Integrações
        </h1>
        <p className="text-slate-600">
          Gestão de conectores com plataformas de gestão de projetos - OAuth2 e REST APIs
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="p-4 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">2</p>
              <p className="text-xs text-slate-600">Integrações Ativas</p>
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
              <p className="text-xs text-slate-600">Exportações (Total)</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6">
        {integrations.map((integration) => (
          <Card key={integration.name} className="border-slate-200 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
                    integration.status === 'connected' ? 'bg-blue-100' : 'bg-slate-100'
                  }`}>
                    <Link2 className={`w-7 h-7 ${
                      integration.status === 'connected' ? 'text-blue-600' : 'text-slate-400'
                    }`} />
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

            {/* Details */}
            <div className="p-6">
              {integration.status === 'connected' ? (
                <div className="space-y-4">
                  {/* Connection Info */}
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
                        <p className="text-xs font-medium text-slate-900">Última Sincronização</p>
                      </div>
                      <p className="text-sm text-slate-700">{integration.lastSync && formatRelativeTime(integration.lastSync)}</p>
                      <p className="text-xs text-slate-500">{integration.lastSync && formatDateTime(integration.lastSync)}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <RefreshCw className="w-4 h-4 text-slate-500" />
                        <p className="text-xs font-medium text-slate-900">Frequência</p>
                      </div>
                      <p className="text-sm text-slate-700">{integration.syncFrequency}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Statistics */}
                  {integration.stats && (
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">Estatísticas de Exportação</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <Card className="p-3 bg-slate-50 border-slate-200">
                          <p className="text-xs text-slate-600 mb-1">Total de Exportações</p>
                          <p className="text-xl font-semibold text-slate-900">{integration.stats.totalExports}</p>
                        </Card>
                        <Card className="p-3 bg-slate-50 border-slate-200">
                          <p className="text-xs text-slate-600 mb-1">Última Semana</p>
                          <p className="text-xl font-semibold text-slate-900">{integration.stats.lastWeek}</p>
                        </Card>
                        <Card className="p-3 bg-slate-50 border-slate-200">
                          <p className="text-xs text-slate-600 mb-1">Tempo Médio</p>
                          <p className="text-xl font-semibold text-slate-900">{integration.stats.avgTime}</p>
                        </Card>
                      </div>
                    </div>
                  )}

                  <Separator />

                  {/* Features */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Funcionalidades Disponíveis</h4>
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

                  {/* Technical Details */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6 text-xs text-slate-600">
                      <div className="flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        <a href={integration.url} target="_blank" rel="noopener noreferrer" className="hover:text-slate-900 underline">
                          {integration.url}
                        </a>
                      </div>
                      <div>
                        <span className="font-medium">API:</span> {integration.apiVersion}
                      </div>
                      {integration.credentials && (
                        <div className="flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          <span>Token ativo</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        onClick={() => void handleSync(integration.name)}
                      >
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
                  {/* Features for disconnected integration */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 mb-3">Funcionalidades Disponíveis</h4>
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

                  {/* Connection Instructions */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">Como conectar {integration.name}</p>
                        <p className="text-sm text-blue-700">
                          Necessário configurar um Personal Access Token (PAT) no {integration.name} com permissões de escrita em projects e work items. 
                          Após criar o token, clique em "Conectar" e cole o token gerado.
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

      {/* Help Card */}
      <Card className="mt-6 p-6 border-slate-200 bg-slate-50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 mb-2">Precisa de ajuda com integrações?</h3>
            <p className="text-sm text-slate-600 mb-3">
              Consulte a documentação técnica para configurar tokens de acesso, permissões necessárias e troubleshooting de conexões.
            </p>
            <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              Ver Documentação
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
