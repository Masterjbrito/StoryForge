import { useState } from 'react';
import { 
  ChevronDown,
  ChevronRight,
  Layers,
  Boxes,
  FileText,
  CheckSquare,
  FlaskConical,
  Edit,
  Download,
  Rocket,
  Eye,
  AlertTriangle,
  Clock,
  User,
  Tag,
  CheckCircle2,
  XCircle,
  Copy,
  Trash2,
  Plus
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';

type View = 'dashboard' | 'analysis' | 'questionnaire' | 'structure' | 'integrations';

interface StructurePreviewProps {
  onNavigate: (view: View) => void;
}

interface Epic {
  id: string;
  title: string;
  description: string;
  businessValue: string;
  acceptanceCriteria: string[];
  features: Feature[];
  expanded?: boolean;
  selected?: boolean;
}

interface Feature {
  id: string;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  userStories: UserStory[];
  expanded?: boolean;
  selected?: boolean;
}

interface UserStory {
  id: string;
  title: string;
  asA: string;
  iWant: string;
  soThat: string;
  acceptanceCriteria: string[];
  tasks: Task[];
  testCases: TestCase[];
  priority: 'High' | 'Medium' | 'Low';
  storyPoints: number;
  expanded?: boolean;
  selected?: boolean;
}

interface Task {
  id: string;
  title: string;
  description: string;
  estimate: string;
  assignee?: string;
  selected?: boolean;
}

interface TestCase {
  id: string;
  title: string;
  type: 'Functional' | 'Security' | 'Performance' | 'Integration' | 'UI/UX';
  steps: string[];
  expectedResult: string;
  selected?: boolean;
}

export function StructurePreview({ onNavigate }: StructurePreviewProps) {
  const [structure, setStructure] = useState<Epic[]>([
    {
      id: 'EP-001',
      title: 'Sistema de Autenticação e Gestão de Utilizadores',
      description: 'Implementação completa do sistema de autenticação segura com múltiplos fatores, gestão de sessões e perfis de utilizador',
      businessValue: 'Garantir acesso seguro ao sistema, proteger dados sensíveis e cumprir requisitos de compliance bancário',
      acceptanceCriteria: [
        'Sistema deve suportar autenticação biométrica',
        'Implementar 2FA obrigatório para transações',
        'Sessões devem expirar após 5 minutos de inatividade',
        'Logs de auditoria para todas as ações de autenticação'
      ],
      expanded: true,
      selected: true,
      features: [
        {
          id: 'FT-001',
          title: 'Autenticação Multi-Factor',
          description: 'Sistema de login com suporte a múltiplos métodos de autenticação incluindo biometria, PIN, e 2FA via SMS/Email',
          priority: 'High',
          expanded: true,
          selected: true,
          userStories: [
            {
              id: 'US-001',
              title: 'Login com Biometria',
              asA: 'utilizador mobile',
              iWant: 'fazer login usando impressão digital ou Face ID',
              soThat: 'possa aceder rapidamente à app de forma segura',
              acceptanceCriteria: [
                'Deve suportar Touch ID e Face ID em iOS',
                'Deve suportar impressão digital em Android',
                'Fallback para PIN se biometria não estiver disponível',
                'Máximo 3 tentativas falhadas antes de bloquear',
                'Tempo de resposta < 2 segundos'
              ],
              priority: 'High',
              storyPoints: 8,
              expanded: true,
              selected: true,
              tasks: [
                { 
                  id: 'TSK-001', 
                  title: 'Implementar captura de biometria iOS',
                  description: 'Integrar LocalAuthentication framework para Touch ID e Face ID',
                  estimate: '5h',
                  assignee: 'iOS Developer',
                  selected: true
                },
                { 
                  id: 'TSK-002', 
                  title: 'Implementar captura de biometria Android',
                  description: 'Usar BiometricPrompt API do Android',
                  estimate: '5h',
                  assignee: 'Android Developer',
                  selected: true
                },
                { 
                  id: 'TSK-003', 
                  title: 'Criar API de validação biométrica',
                  description: 'Endpoint backend para validar token biométrico',
                  estimate: '4h',
                  assignee: 'Backend Developer',
                  selected: true
                },
                { 
                  id: 'TSK-004', 
                  title: 'Implementar fallback para PIN',
                  description: 'Fluxo alternativo quando biometria falha ou não disponível',
                  estimate: '3h',
                  selected: true
                },
                { 
                  id: 'TSK-005', 
                  title: 'Adicionar contadores de tentativas falhadas',
                  description: 'Sistema de tracking e bloqueio após 3 tentativas',
                  estimate: '3h',
                  selected: true
                }
              ],
              testCases: [
                { 
                  id: 'TC-001', 
                  title: 'Verificar login bem-sucedido com impressão digital válida',
                  type: 'Functional',
                  steps: [
                    'Abrir app',
                    'Clicar em Login com Biometria',
                    'Colocar dedo registado no sensor',
                    'Aguardar validação'
                  ],
                  expectedResult: 'Utilizador autenticado e redirecionado para dashboard em < 2s',
                  selected: true
                },
                { 
                  id: 'TC-002', 
                  title: 'Testar fallback quando biometria não disponível',
                  type: 'Functional',
                  steps: [
                    'Dispositivo sem biometria configurada',
                    'Abrir app',
                    'Tentar Login com Biometria'
                  ],
                  expectedResult: 'Sistema apresenta automaticamente opção de PIN',
                  selected: true
                },
                { 
                  id: 'TC-003', 
                  title: 'Validar bloqueio após 3 tentativas falhadas',
                  type: 'Security',
                  steps: [
                    'Tentar login com biometria inválida 3 vezes',
                    'Observar comportamento'
                  ],
                  expectedResult: 'Conta bloqueada temporariamente por 15 minutos',
                  selected: true
                },
                { 
                  id: 'TC-004', 
                  title: 'Testar performance de resposta biométrica',
                  type: 'Performance',
                  steps: [
                    'Executar 100 logins com biometria válida',
                    'Medir tempo de cada autenticação'
                  ],
                  expectedResult: '95% das autenticações completam em < 2s',
                  selected: true
                }
              ]
            },
            {
              id: 'US-002',
              title: 'Autenticação de Dois Fatores (2FA)',
              asA: 'utilizador do sistema bancário',
              iWant: 'receber um código de verificação adicional',
              soThat: 'minhas transações estejam mais seguras',
              acceptanceCriteria: [
                'Código enviado por SMS e Email',
                'Código válido por 5 minutos',
                'Possibilidade de reenviar código após 30 segundos',
                'Obrigatório para transações acima de 1000€'
              ],
              priority: 'High',
              storyPoints: 5,
              expanded: false,
              selected: true,
              tasks: [
                { 
                  id: 'TSK-006', 
                  title: 'Integrar serviço de envio de SMS',
                  description: 'Twilio ou AWS SNS para envio de códigos',
                  estimate: '4h',
                  selected: true
                },
                { 
                  id: 'TSK-007', 
                  title: 'Criar template de email para 2FA',
                  description: 'Template responsivo com código destacado',
                  estimate: '2h',
                  selected: true
                },
                { 
                  id: 'TSK-008', 
                  title: 'Implementar geração e validação de código',
                  description: 'Algoritmo de geração de código de 6 dígitos com expiração',
                  estimate: '5h',
                  selected: true
                },
                { 
                  id: 'TSK-009', 
                  title: 'Criar UI de inserção de código',
                  description: 'Interface com 6 campos para dígitos e timer',
                  estimate: '4h',
                  selected: true
                }
              ],
              testCases: [
                { 
                  id: 'TC-005', 
                  title: 'Validar código 2FA correto',
                  type: 'Functional',
                  steps: [
                    'Iniciar transação',
                    'Receber código',
                    'Inserir código correto',
                    'Submeter'
                  ],
                  expectedResult: 'Transação aprovada e processada',
                  selected: true
                },
                { 
                  id: 'TC-006', 
                  title: 'Testar expiração de código após 5 minutos',
                  type: 'Security',
                  steps: [
                    'Receber código 2FA',
                    'Aguardar 5 minutos',
                    'Tentar usar código'
                  ],
                  expectedResult: 'Código rejeitado, solicitar novo código',
                  selected: true
                }
              ]
            }
          ]
        },
        {
          id: 'FT-002',
          title: 'Gestão de Sessão e Timeout',
          description: 'Controlo automático de sessões com timeout por inatividade e gestão de múltiplos dispositivos',
          priority: 'High',
          expanded: false,
          selected: true,
          userStories: [
            {
              id: 'US-003',
              title: 'Timeout Automático por Inatividade',
              asA: 'sistema de segurança',
              iWant: 'fazer logout automático do utilizador após período de inatividade',
              soThat: 'dados sensíveis não fiquem expostos em dispositivos desacompanhados',
              acceptanceCriteria: [
                'Logout após 5 minutos de inatividade',
                'Modal de aviso 30 segundos antes do logout',
                'Opção de estender sessão no modal',
                'Qualquer ação do utilizador reinicia o timer'
              ],
              priority: 'High',
              storyPoints: 5,
              expanded: false,
              selected: true,
              tasks: [
                { 
                  id: 'TSK-010', 
                  title: 'Implementar timer de inatividade',
                  description: 'Serviço que monitoriza eventos de interação do utilizador',
                  estimate: '4h',
                  selected: true
                },
                { 
                  id: 'TSK-011', 
                  title: 'Criar modal de aviso de timeout',
                  description: 'UI com countdown e botão para estender sessão',
                  estimate: '3h',
                  selected: true
                },
                { 
                  id: 'TSK-012', 
                  title: 'Implementar extensão de sessão',
                  description: 'Endpoint e lógica para renovar token de sessão',
                  estimate: '3h',
                  selected: true
                }
              ],
              testCases: [
                { 
                  id: 'TC-007', 
                  title: 'Verificar logout após 5 minutos de inatividade',
                  type: 'Functional',
                  steps: [
                    'Fazer login',
                    'Não interagir com a app',
                    'Aguardar 5 minutos'
                  ],
                  expectedResult: 'Utilizador deslogado e redirecionado para tela de login',
                  selected: true
                },
                { 
                  id: 'TC-008', 
                  title: 'Testar modal de aviso 30s antes',
                  type: 'Functional',
                  steps: [
                    'Ficar inativo por 4min30s',
                    'Observar interface'
                  ],
                  expectedResult: 'Modal aparece com countdown de 30s',
                  selected: true
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'EP-002',
      title: 'Sistema de Transações e Pagamentos',
      description: 'Funcionalidades completas de transferências bancárias, pagamentos PIX, TED, DOC e gestão de histórico',
      businessValue: 'Funcionalidade core do sistema que gera receita e engagement dos utilizadores',
      acceptanceCriteria: [
        'Processar transações em tempo real',
        'Garantir integridade e atomicidade de transações',
        'Logs completos de auditoria',
        'Notificações em tempo real'
      ],
      expanded: false,
      selected: true,
      features: [
        {
          id: 'FT-003',
          title: 'Transferências PIX',
          description: 'Implementação completa de transferências via PIX com suporte a chave, QR Code e PIX copia e cola',
          priority: 'High',
          expanded: false,
          selected: true,
          userStories: [
            {
              id: 'US-004',
              title: 'Transferência PIX por Chave',
              asA: 'utilizador',
              iWant: 'transferir dinheiro usando chave PIX (email, telefone, CPF)',
              soThat: 'possa enviar dinheiro rapidamente sem dados bancários',
              acceptanceCriteria: [
                'Validar formato da chave antes de enviar',
                'Buscar dados do destinatário via API do Banco Central',
                'Confirmar dados antes de processar',
                'Transação completada em < 10 segundos',
                'Comprovante disponível imediatamente'
              ],
              priority: 'High',
              storyPoints: 13,
              expanded: false,
              selected: true,
              tasks: [
                { 
                  id: 'TSK-013', 
                  title: 'Integrar com API PIX do Banco Central',
                  description: 'Implementar consulta de chave e processamento de transferência',
                  estimate: '13h',
                  assignee: 'Backend Developer',
                  selected: true
                },
                { 
                  id: 'TSK-014', 
                  title: 'Criar interface de seleção de chave',
                  description: 'UI para escolher tipo de chave e inserir valor',
                  estimate: '5h',
                  selected: true
                },
                { 
                  id: 'TSK-015', 
                  title: 'Implementar validação de chaves',
                  description: 'Validar formato de email, telefone, CPF, CNPJ',
                  estimate: '4h',
                  selected: true
                },
                { 
                  id: 'TSK-016', 
                  title: 'Criar tela de confirmação de transferência',
                  description: 'Mostrar dados do destinatário e valor antes de confirmar',
                  estimate: '4h',
                  selected: true
                },
                { 
                  id: 'TSK-017', 
                  title: 'Implementar geração de comprovante',
                  description: 'PDF e visualização em tela com todos os dados da transação',
                  estimate: '6h',
                  selected: true
                }
              ],
              testCases: [
                { 
                  id: 'TC-009', 
                  title: 'Validar transferência PIX bem-sucedida',
                  type: 'Functional',
                  steps: [
                    'Selecionar transferência PIX',
                    'Inserir chave válida',
                    'Inserir valor',
                    'Confirmar dados',
                    'Autorizar com 2FA',
                    'Processar'
                  ],
                  expectedResult: 'Transferência processada, saldo atualizado, comprovante disponível',
                  selected: true
                },
                { 
                  id: 'TC-010', 
                  title: 'Testar limite de valor PIX',
                  type: 'Functional',
                  steps: [
                    'Tentar transferir valor acima do limite diário',
                    'Submeter transação'
                  ],
                  expectedResult: 'Sistema bloqueia e informa limite disponível',
                  selected: true
                },
                { 
                  id: 'TC-011', 
                  title: 'Verificar tempo de processamento PIX',
                  type: 'Performance',
                  steps: [
                    'Executar 50 transações PIX',
                    'Medir tempo de cada uma'
                  ],
                  expectedResult: '95% das transações completam em < 10s',
                  selected: true
                }
              ]
            }
          ]
        }
      ]
    }
  ]);

  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportPlatform, setExportPlatform] = useState<'jira' | 'azure'>('jira');
  const [exportProject, setExportProject] = useState('');

  const toggleEpic = (epicId: string) => {
    setStructure(prev => prev.map(epic => 
      epic.id === epicId ? { ...epic, expanded: !epic.expanded } : epic
    ));
  };

  const toggleFeature = (epicId: string, featureId: string) => {
    setStructure(prev => prev.map(epic => 
      epic.id === epicId 
        ? {
            ...epic,
            features: epic.features.map(feature =>
              feature.id === featureId ? { ...feature, expanded: !feature.expanded } : feature
            )
          }
        : epic
    ));
  };

  const toggleUserStory = (epicId: string, featureId: string, usId: string) => {
    setStructure(prev => prev.map(epic => 
      epic.id === epicId 
        ? {
            ...epic,
            features: epic.features.map(feature =>
              feature.id === featureId
                ? {
                    ...feature,
                    userStories: feature.userStories.map(us =>
                      us.id === usId ? { ...us, expanded: !us.expanded } : us
                    )
                  }
                : feature
            )
          }
        : epic
    ));
  };

  const totalStats = {
    epics: structure.length,
    features: structure.reduce((acc, e) => acc + e.features.length, 0),
    userStories: structure.reduce((acc, e) => 
      acc + e.features.reduce((acc2, f) => acc2 + f.userStories.length, 0), 0
    ),
    tasks: structure.reduce((acc, e) => 
      acc + e.features.reduce((acc2, f) => 
        acc2 + f.userStories.reduce((acc3, us) => acc3 + us.tasks.length, 0), 0
      ), 0
    ),
    testCases: structure.reduce((acc, e) => 
      acc + e.features.reduce((acc2, f) => 
        acc2 + f.userStories.reduce((acc3, us) => acc3 + us.testCases.length, 0), 0
      ), 0
    ),
    totalStoryPoints: structure.reduce((acc, e) => 
      acc + e.features.reduce((acc2, f) => 
        acc2 + f.userStories.reduce((acc3, us) => acc3 + us.storyPoints, 0), 0
      ), 0
    ),
    estimatedHours: structure.reduce((acc, e) => 
      acc + e.features.reduce((acc2, f) => 
        acc2 + f.userStories.reduce((acc3, us) => 
          acc3 + us.tasks.reduce((acc4, task) => 
            acc4 + parseInt(task.estimate.replace('h', '') || '0'), 0
          ), 0
        ), 0
      ), 0
    )
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Low': return 'bg-green-100 text-green-700 border-green-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  const getTestTypeColor = (type: string) => {
    switch(type) {
      case 'Functional': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Security': return 'bg-red-100 text-red-700 border-red-300';
      case 'Performance': return 'bg-green-100 text-green-700 border-green-300';
      case 'Integration': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'UI/UX': return 'bg-pink-100 text-pink-700 border-pink-300';
      default: return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => onNavigate('questionnaire')}
          className="text-slate-600 hover:text-slate-900 mb-4 flex items-center gap-2 transition-colors"
        >
          ← Voltar
        </button>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Estrutura Completa Gerada
            </h1>
            <p className="text-slate-600">
              Revise todos os detalhes antes de exportar para Jira/Azure DevOps
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar JSON
            </Button>
            <Button 
              onClick={() => setShowExportDialog(true)}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg gap-2"
            >
              <Rocket className="w-4 h-4" />
              Publicar no Jira/Azure
            </Button>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-500 to-cyan-500 text-white border-0">
            <Layers className="w-6 h-6 mb-2" />
            <p className="text-2xl font-bold">{totalStats.epics}</p>
            <p className="text-sm text-blue-100">Epics</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
            <Boxes className="w-6 h-6 mb-2" />
            <p className="text-2xl font-bold">{totalStats.features}</p>
            <p className="text-sm text-purple-100">Features</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-green-500 to-emerald-500 text-white border-0">
            <FileText className="w-6 h-6 mb-2" />
            <p className="text-2xl font-bold">{totalStats.userStories}</p>
            <p className="text-sm text-green-100">User Stories</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-orange-500 to-red-500 text-white border-0">
            <CheckSquare className="w-6 h-6 mb-2" />
            <p className="text-2xl font-bold">{totalStats.tasks}</p>
            <p className="text-sm text-orange-100">Tasks</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-indigo-500 to-purple-500 text-white border-0">
            <FlaskConical className="w-6 h-6 mb-2" />
            <p className="text-2xl font-bold">{totalStats.testCases}</p>
            <p className="text-sm text-indigo-100">Test Cases</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-pink-500 to-rose-500 text-white border-0">
            <Tag className="w-6 h-6 mb-2" />
            <p className="text-2xl font-bold">{totalStats.totalStoryPoints}</p>
            <p className="text-sm text-pink-100">Story Points</p>
          </Card>
          <Card className="p-4 bg-gradient-to-br from-cyan-500 to-blue-500 text-white border-0">
            <Clock className="w-6 h-6 mb-2" />
            <p className="text-2xl font-bold">{totalStats.estimatedHours}h</p>
            <p className="text-sm text-cyan-100">Estimado</p>
          </Card>
        </div>
      </div>

      {/* Structure Tree */}
      <div className="space-y-4">
        {structure.map((epic) => (
          <Card key={epic.id} className="overflow-hidden bg-white/80 backdrop-blur-sm border-slate-200/50">
            {/* Epic Header */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleEpic(epic.id)}
                  className="mt-1"
                >
                  {epic.expanded ? (
                    <ChevronDown className="w-6 h-6 text-blue-600" />
                  ) : (
                    <ChevronRight className="w-6 h-6 text-blue-600" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1">
                      <Layers className="w-6 h-6 text-blue-600 flex-shrink-0" />
                      <Badge className="bg-blue-600 text-white">{epic.id}</Badge>
                      <h3 className="text-xl font-semibold">{epic.title}</h3>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <p className="text-slate-700 mb-3 ml-9">{epic.description}</p>
                  
                  <div className="ml-9 space-y-2">
                    <div className="flex items-start gap-2">
                      <Tag className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">Business Value:</p>
                        <p className="text-sm text-slate-600">{epic.businessValue}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-700 mb-1">Acceptance Criteria:</p>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {epic.acceptanceCriteria.map((criteria, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-blue-600">•</span>
                              {criteria}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            {epic.expanded && (
              <div className="p-6 space-y-4">
                {epic.features.map((feature) => (
                  <div key={feature.id} className="ml-6 border-l-4 border-purple-300 pl-6">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <button onClick={() => toggleFeature(epic.id, feature.id)}>
                          {feature.expanded ? (
                            <ChevronDown className="w-5 h-5 text-purple-600" />
                          ) : (
                            <ChevronRight className="w-5 h-5 text-purple-600" />
                          )}
                        </button>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Boxes className="w-5 h-5 text-purple-600" />
                            <Badge variant="outline" className="border-purple-600 text-purple-600">
                              {feature.id}
                            </Badge>
                            <span className="font-semibold">{feature.title}</span>
                            <Badge className={getPriorityColor(feature.priority)}>
                              {feature.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 ml-7">{feature.description}</p>
                        </div>
                        
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* User Stories */}
                      {feature.expanded && (
                        <div className="mt-4 ml-7 space-y-3">
                          {feature.userStories.map((us) => (
                            <div key={us.id} className="border-l-4 border-green-300 pl-4">
                              <div className="bg-green-50 rounded-lg p-4">
                                <div className="flex items-start gap-3">
                                  <button onClick={() => toggleUserStory(epic.id, feature.id, us.id)}>
                                    {us.expanded ? (
                                      <ChevronDown className="w-4 h-4 text-green-600" />
                                    ) : (
                                      <ChevronRight className="w-4 h-4 text-green-600" />
                                    )}
                                  </button>
                                  
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                      <FileText className="w-4 h-4 text-green-600" />
                                      <Badge variant="outline" className="border-green-600 text-green-600">
                                        {us.id}
                                      </Badge>
                                      <span className="font-medium text-sm">{us.title}</span>
                                      <Badge className={getPriorityColor(us.priority)}>
                                        {us.priority}
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        {us.storyPoints} SP
                                      </Badge>
                                    </div>
                                    
                                    <div className="text-sm text-slate-700 ml-6 space-y-1">
                                      <p><span className="font-medium">Como</span> {us.asA},</p>
                                      <p><span className="font-medium">Eu quero</span> {us.iWant},</p>
                                      <p><span className="font-medium">Para que</span> {us.soThat}</p>
                                    </div>

                                    {us.expanded && (
                                      <div className="mt-4 ml-6 space-y-4">
                                        {/* Acceptance Criteria */}
                                        <div className="p-3 bg-white rounded-lg border border-green-200">
                                          <p className="text-sm font-medium text-green-900 mb-2">
                                            ✓ Acceptance Criteria:
                                          </p>
                                          <ul className="text-sm text-slate-600 space-y-1">
                                            {us.acceptanceCriteria.map((criteria, idx) => (
                                              <li key={idx} className="flex items-start gap-2">
                                                <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                                {criteria}
                                              </li>
                                            ))}
                                          </ul>
                                        </div>

                                        {/* Tasks */}
                                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                          <div className="flex items-center gap-2 mb-3">
                                            <CheckSquare className="w-4 h-4 text-orange-600" />
                                            <span className="text-sm font-medium text-orange-900">
                                              Tasks ({us.tasks.length})
                                            </span>
                                          </div>
                                          <div className="space-y-2">
                                            {us.tasks.map((task) => (
                                              <div key={task.id} className="bg-white p-3 rounded border border-orange-200">
                                                <div className="flex items-start justify-between">
                                                  <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                      <span className="text-xs font-mono text-slate-500">
                                                        {task.id}
                                                      </span>
                                                      <span className="text-sm font-medium">
                                                        {task.title}
                                                      </span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 mb-2">
                                                      {task.description}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                      <Badge variant="secondary" className="text-xs">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {task.estimate}
                                                      </Badge>
                                                      {task.assignee && (
                                                        <Badge variant="outline" className="text-xs">
                                                          <User className="w-3 h-3 mr-1" />
                                                          {task.assignee}
                                                        </Badge>
                                                      )}
                                                    </div>
                                                  </div>
                                                  <Button variant="ghost" size="sm">
                                                    <Edit className="w-3 h-3" />
                                                  </Button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>

                                        {/* Test Cases */}
                                        <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                          <div className="flex items-center gap-2 mb-3">
                                            <FlaskConical className="w-4 h-4 text-indigo-600" />
                                            <span className="text-sm font-medium text-indigo-900">
                                              Test Cases ({us.testCases.length})
                                            </span>
                                          </div>
                                          <div className="space-y-2">
                                            {us.testCases.map((tc) => (
                                              <div key={tc.id} className="bg-white p-3 rounded border border-indigo-200">
                                                <div className="flex items-start justify-between mb-2">
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-xs font-mono text-slate-500">
                                                      {tc.id}
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                      {tc.title}
                                                    </span>
                                                  </div>
                                                  <Badge className={getTestTypeColor(tc.type)}>
                                                    {tc.type}
                                                  </Badge>
                                                </div>
                                                <div className="text-xs space-y-2">
                                                  <div>
                                                    <p className="font-medium text-slate-700 mb-1">
                                                      Steps:
                                                    </p>
                                                    <ol className="text-slate-600 space-y-1 pl-4">
                                                      {tc.steps.map((step, idx) => (
                                                        <li key={idx}>{idx + 1}. {step}</li>
                                                      ))}
                                                    </ol>
                                                  </div>
                                                  <div>
                                                    <p className="font-medium text-slate-700">
                                                      Expected Result:
                                                    </p>
                                                    <p className="text-slate-600">
                                                      {tc.expectedResult}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  
                                  <Button variant="ghost" size="sm">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Exportar para Jira/Azure DevOps</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div>
              <Label className="mb-3">Selecione a Plataforma</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setExportPlatform('jira')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    exportPlatform === 'jira'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-3xl mb-2">🔷</div>
                  <p className="font-medium">Jira</p>
                </button>
                <button
                  onClick={() => setExportPlatform('azure')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    exportPlatform === 'azure'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-3xl mb-2">☁️</div>
                  <p className="font-medium">Azure DevOps</p>
                </button>
              </div>
            </div>

            <div>
              <Label className="mb-2">Projeto de Destino</Label>
              <select 
                value={exportProject}
                onChange={(e) => setExportProject(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Selecione um projeto</option>
                <option value="PAYMOB">PAYMOB - Sistema de Pagamentos Mobile</option>
                <option value="IBANK">IBANK - Internet Banking</option>
                <option value="INVEST">INVEST - Investimentos</option>
              </select>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900 font-medium mb-2">
                O que será exportado:
              </p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ {totalStats.epics} Epics com descrições e business value</li>
                <li>✓ {totalStats.features} Features com prioridades</li>
                <li>✓ {totalStats.userStories} User Stories completas com acceptance criteria</li>
                <li>✓ {totalStats.tasks} Tasks com estimativas e assignees</li>
                <li>✓ {totalStats.testCases} Test Cases detalhados</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowExportDialog(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  setShowExportDialog(false);
                  // Simular exportação
                  setTimeout(() => {
                    onNavigate('dashboard');
                  }, 1000);
                }}
                disabled={!exportProject}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Exportar Agora
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
