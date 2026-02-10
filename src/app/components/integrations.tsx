import { useState } from 'react';
import { 
  Link2,
  CheckCircle2,
  XCircle,
  Settings,
  Key,
  Globe,
  AlertCircle,
  Trash2,
  RefreshCw,
  ChevronRight
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Badge } from './ui/badge';

type View = 'dashboard' | 'analysis' | 'questionnaire' | 'structure' | 'integrations';

interface IntegrationsProps {
  onNavigate: (view: View) => void;
}

interface Integration {
  id: string;
  name: string;
  logo: string;
  connected: boolean;
  lastSync?: Date;
  projectsCount?: number;
  color: string;
}

export function Integrations({ onNavigate }: IntegrationsProps) {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'jira',
      name: 'Jira',
      logo: '🔷',
      connected: true,
      lastSync: new Date(Date.now() - 1000 * 60 * 15),
      projectsCount: 5,
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'azure',
      name: 'Azure DevOps',
      logo: '☁️',
      connected: false,
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      id: 'github',
      name: 'GitHub',
      logo: '🐙',
      connected: false,
      color: 'from-slate-600 to-slate-700'
    },
    {
      id: 'gitlab',
      name: 'GitLab',
      logo: '🦊',
      connected: false,
      color: 'from-orange-500 to-orange-600'
    }
  ]);

  const [selectedIntegration, setSelectedIntegration] = useState<string | null>('jira');
  const [autoSync, setAutoSync] = useState(true);

  const handleConnect = (id: string) => {
    setIntegrations(prev => prev.map(int => 
      int.id === id ? { ...int, connected: true, lastSync: new Date() } : int
    ));
  };

  const handleDisconnect = (id: string) => {
    setIntegrations(prev => prev.map(int => 
      int.id === id ? { ...int, connected: false, lastSync: undefined, projectsCount: 0 } : int
    ));
  };

  const formatLastSync = (date?: Date) => {
    if (!date) return 'Nunca';
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    
    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `Há ${minutes} minutos`;
    if (minutes < 1440) return `Há ${Math.floor(minutes / 60)} horas`;
    return `Há ${Math.floor(minutes / 1440)} dias`;
  };

  const currentIntegration = integrations.find(i => i.id === selectedIntegration);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="text-slate-600 hover:text-slate-900 mb-4 flex items-center gap-2 transition-colors"
        >
          ← Voltar ao Dashboard
        </button>
        <h1 className="text-4xl mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Integrações
        </h1>
        <p className="text-slate-600">
          Conecte suas ferramentas de gestão de projetos
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Integrations List */}
        <div className="lg:col-span-1">
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50">
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <Link2 className="w-5 h-5 text-blue-600" />
              Plataformas Disponíveis
            </h2>

            <div className="space-y-3">
              {integrations.map((integration) => (
                <button
                  key={integration.id}
                  onClick={() => setSelectedIntegration(integration.id)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    selectedIntegration === integration.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${integration.color} flex items-center justify-center text-2xl`}>
                        {integration.logo}
                      </div>
                      <div>
                        <p className="font-medium">{integration.name}</p>
                        {integration.connected && (
                          <p className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Conectado
                          </p>
                        )}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                  {integration.connected && integration.projectsCount && (
                    <div className="flex gap-2 text-xs text-slate-600 mt-2">
                      <Badge variant="secondary">{integration.projectsCount} projetos</Badge>
                      <Badge variant="secondary">{formatLastSync(integration.lastSync)}</Badge>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-6 p-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0">
            <h3 className="text-lg mb-4">Estatísticas</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-blue-100">Integrações ativas</span>
                <span className="text-2xl font-bold">
                  {integrations.filter(i => i.connected).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-100">Projetos sincronizados</span>
                <span className="text-2xl font-bold">
                  {integrations.reduce((acc, i) => acc + (i.projectsCount || 0), 0)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-blue-100">Última sincronização</span>
                <span className="text-sm font-medium">
                  {formatLastSync(integrations.find(i => i.connected)?.lastSync)}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Integration Details */}
        <div className="lg:col-span-2">
          {currentIntegration && (
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${currentIntegration.color} flex items-center justify-center text-4xl shadow-lg`}>
                    {currentIntegration.logo}
                  </div>
                  <div>
                    <h2 className="text-2xl">{currentIntegration.name}</h2>
                    {currentIntegration.connected ? (
                      <Badge className="bg-green-100 text-green-700 border-green-300 mt-1">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Conectado
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="mt-1">
                        <XCircle className="w-3 h-3 mr-1" />
                        Desconectado
                      </Badge>
                    )}
                  </div>
                </div>

                {currentIntegration.connected ? (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleConnect(currentIntegration.id)}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sincronizar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(currentIntegration.id)}
                      className="text-red-600 border-red-200 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Desconectar
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleConnect(currentIntegration.id)}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                  >
                    Conectar
                  </Button>
                )}
              </div>

              {/* Configuration */}
              <div className="space-y-6">
                {currentIntegration.connected ? (
                  <>
                    {/* Connection Info */}
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium text-green-900 mb-1">
                            Conexão estabelecida
                          </p>
                          <p className="text-sm text-green-700">
                            A integração está ativa e sincronizando dados automaticamente.
                          </p>
                          {currentIntegration.lastSync && (
                            <p className="text-xs text-green-600 mt-2">
                              Última sincronização: {formatLastSync(currentIntegration.lastSync)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Settings */}
                    <div>
                      <h3 className="text-lg mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-slate-600" />
                        Configurações
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div>
                            <Label className="text-base">Sincronização Automática</Label>
                            <p className="text-sm text-slate-600 mt-1">
                              Sincronizar automaticamente a cada 15 minutos
                            </p>
                          </div>
                          <Switch
                            checked={autoSync}
                            onCheckedChange={setAutoSync}
                          />
                        </div>

                        <div className="p-4 bg-slate-50 rounded-lg">
                          <Label className="text-base mb-3 block">URL da Instância</Label>
                          <Input
                            type="url"
                            placeholder={`https://your-company.${currentIntegration.id}.com`}
                            defaultValue={currentIntegration.id === 'jira' ? 'https://mycompany.atlassian.net' : ''}
                          />
                        </div>

                        <div className="p-4 bg-slate-50 rounded-lg">
                          <Label className="text-base mb-3 block flex items-center gap-2">
                            <Key className="w-4 h-4" />
                            API Token
                          </Label>
                          <Input
                            type="password"
                            placeholder="••••••••••••••••"
                            defaultValue="existing-token-here"
                          />
                          <p className="text-xs text-slate-500 mt-2">
                            O token é armazenado de forma segura e criptografada
                          </p>
                        </div>

                        <div className="p-4 bg-slate-50 rounded-lg">
                          <Label className="text-base mb-3 block">Projeto Padrão</Label>
                          <select className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option>Selecione um projeto</option>
                            <option>BANK - Sistema Bancário</option>
                            <option>MOB - Mobile Apps</option>
                            <option>WEB - Web Portal</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Sync Settings */}
                    <div>
                      <h3 className="text-lg mb-4">Opções de Sincronização</h3>
                      <div className="space-y-3">
                        {[
                          'Sincronizar Epics',
                          'Sincronizar Features',
                          'Sincronizar User Stories',
                          'Sincronizar Tasks',
                          'Sincronizar Test Cases',
                          'Sincronizar Comentários'
                        ].map((option) => (
                          <div key={option} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <Label>{option}</Label>
                            <Switch defaultChecked />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Connection Instructions */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-blue-900 mb-2">
                            Como conectar ao {currentIntegration.name}
                          </p>
                          <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
                            <li>Acesse as configurações da sua conta {currentIntegration.name}</li>
                            <li>Gere um novo API token nas configurações de segurança</li>
                            <li>Copie o token e cole nos campos abaixo</li>
                            <li>Clique em "Conectar" para estabelecer a integração</li>
                          </ol>
                        </div>
                      </div>
                    </div>

                    {/* Connection Form */}
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-2 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          URL da Instância
                        </Label>
                        <Input
                          type="url"
                          placeholder={`https://your-company.${currentIntegration.id}.com`}
                        />
                      </div>

                      <div>
                        <Label className="mb-2 flex items-center gap-2">
                          <Key className="w-4 h-4" />
                          API Token
                        </Label>
                        <Input
                          type="password"
                          placeholder="Cole seu API token aqui"
                        />
                      </div>

                      <div>
                        <Label className="mb-2">Email / Username</Label>
                        <Input
                          type="email"
                          placeholder="seu-email@empresa.com"
                        />
                      </div>

                      <Button
                        onClick={() => handleConnect(currentIntegration.id)}
                        className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                      >
                        <Link2 className="w-4 h-4 mr-2" />
                        Conectar ao {currentIntegration.name}
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
