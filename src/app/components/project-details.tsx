import { useState } from 'react';
import { 
  ChevronDown,
  ChevronRight,
  Layers,
  Boxes,
  FileText,
  CheckSquare,
  FlaskConical,
  ArrowLeft,
  ExternalLink,
  Download,
  Calendar,
  Clock,
  User,
  Tag,
  CheckCircle2,
  Shield,
  Building2
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

type View = 'dashboard' | 'analysis' | 'questionnaire' | 'structure' | 'integrations' | 'project-details';

interface ProjectDetailsProps {
  onNavigate: (view: View) => void;
  projectId: number | null;
}

// Dados mock dos projetos - em produção viriam de uma API
const projectsData: any = {
  1: {
    id: 1,
    name: 'Sistema de Pagamentos MB Way',
    code: 'MBWAY',
    platform: 'Jira',
    url: 'https://company.atlassian.net/browse/MBWAY',
    createdAt: new Date('2026-01-05'),
    exportedAt: new Date('2026-01-06'),
    description: 'Sistema completo de pagamentos móveis MB Way para particulares e empresas, incluindo transferências instantâneas, pagamentos em comerciantes e levantamentos em ATM.',
    color: 'from-blue-500 to-cyan-500',
    structure: [
      {
        id: 'EP-001',
        title: 'Autenticação e Segurança Bancária',
        description: 'Implementação completa de autenticação forte com múltiplos fatores conforme PSD2 e Banco de Portugal',
        businessValue: 'Garantir conformidade com regulação PSD2, proteger transações financeiras e prevenir fraude',
        acceptanceCriteria: [
          'Autenticação forte (SCA) obrigatória para transações > 30€',
          'Biometria validada conforme normas do Banco de Portugal',
          'Logs de auditoria mantidos por 10 anos (requisito legal)',
          'Alertas de fraude em tempo real via SIBS'
        ],
        expanded: true,
        features: [
          {
            id: 'FT-001',
            title: 'Autenticação PSD2 Compliant',
            description: 'Sistema de autenticação forte com biometria, PIN e OTP conforme diretiva PSD2',
            priority: 'High',
            expanded: true,
            userStories: [
              {
                id: 'US-001',
                title: 'Login com Biometria Facial/Digital',
                asA: 'cliente bancário particular',
                iWant: 'fazer login usando biometria (impressão digital ou reconhecimento facial)',
                soThat: 'possa aceder de forma rápida e segura à minha conta sem memorizar passwords',
                acceptanceCriteria: [
                  'Suportar Touch ID e Face ID em iOS 14+',
                  'Suportar impressão digital e reconhecimento facial em Android 10+',
                  'Fallback automático para PIN de 6 dígitos se biometria indisponível',
                  'Máximo 3 tentativas falhadas, depois bloqueia e requer desbloqueio por SMS',
                  'Tempo de autenticação < 2 segundos',
                  'Validação de vivacidade (liveness) para prevenir spoofing'
                ],
                priority: 'High',
                storyPoints: 13,
                expanded: true,
                tasks: [
                  { 
                    id: 'TSK-001', 
                    title: 'Implementar LocalAuthentication iOS',
                    description: 'Integrar framework nativo iOS para Touch ID e Face ID com validação de vivacidade',
                    estimate: '8h',
                    assignee: 'Developer iOS',
                  },
                  { 
                    id: 'TSK-002', 
                    title: 'Implementar BiometricPrompt Android',
                    description: 'Usar API BiometricPrompt do Android com BiometricManager para validação',
                    estimate: '8h',
                    assignee: 'Developer Android',
                  },
                  { 
                    id: 'TSK-003', 
                    title: 'Criar API de validação biométrica',
                    description: 'Endpoint backend para validar token biométrico com HSM do banco',
                    estimate: '6h',
                    assignee: 'Backend Developer',
                  },
                  { 
                    id: 'TSK-004', 
                    title: 'Implementar sistema de fallback para PIN',
                    description: 'Fluxo alternativo com PIN de 6 dígitos cifrado',
                    estimate: '4h',
                  },
                  { 
                    id: 'TSK-005', 
                    title: 'Sistema de bloqueio e desbloqueio',
                    description: 'Contador de tentativas falhadas com bloqueio temporário e desbloqueio via SMS OTP',
                    estimate: '5h',
                  },
                  { 
                    id: 'TSK-006', 
                    title: 'Logs de auditoria para Banco de Portugal',
                    description: 'Registar todas as tentativas de autenticação conforme requisitos legais',
                    estimate: '4h',
                  }
                ],
                testCases: [
                  { 
                    id: 'TC-001', 
                    title: 'Validar login biométrico bem-sucedido',
                    type: 'Functional',
                    steps: [
                      'Abrir app MB Way',
                      'Sistema solicita biometria',
                      'Utilizador coloca dedo/face válida',
                      'Sistema valida com backend',
                      'Redireciona para dashboard'
                    ],
                    expectedResult: 'Login completo em < 2s, sessão criada, dashboard apresentado',
                  },
                  { 
                    id: 'TC-002', 
                    title: 'Testar fallback quando biometria não configurada',
                    type: 'Functional',
                    steps: [
                      'Dispositivo sem biometria configurada',
                      'Abrir app',
                      'Sistema deteta ausência de biometria'
                    ],
                    expectedResult: 'App apresenta automaticamente ecrã de PIN sem erro',
                  },
                  { 
                    id: 'TC-003', 
                    title: 'Validar bloqueio após 3 tentativas',
                    type: 'Security',
                    steps: [
                      'Tentar 3 vezes com biometria inválida',
                      'Sistema conta tentativas',
                      'Na 3ª tentativa, aciona bloqueio'
                    ],
                    expectedResult: 'Conta bloqueada por 15min, SMS enviado, log de segurança criado',
                  },
                  { 
                    id: 'TC-004', 
                    title: 'Testar proteção anti-spoofing',
                    type: 'Security',
                    steps: [
                      'Tentar autenticar com foto/vídeo',
                      'Sistema executa validação de vivacidade',
                      'Deteta tentativa de fraude'
                    ],
                    expectedResult: 'Autenticação rejeitada, alerta de segurança enviado, tentativa registada',
                  },
                  { 
                    id: 'TC-005', 
                    title: 'Validar conformidade PSD2',
                    type: 'Security',
                    steps: [
                      'Executar autenticação completa',
                      'Validar elementos SCA (algo que sei, algo que tenho, algo que sou)',
                      'Verificar logs e timestamps'
                    ],
                    expectedResult: 'Todos os elementos PSD2 presentes, logs completos para auditoria',
                  }
                ]
              },
              {
                id: 'US-002',
                title: 'OTP via SMS para Autenticação Forte',
                asA: 'cliente bancário',
                iWant: 'receber código OTP por SMS para transações sensíveis',
                soThat: 'tenha a certeza que sou eu a autorizar operações importantes',
                acceptanceCriteria: [
                  'OTP de 6 dígitos numéricos',
                  'Válido por 3 minutos',
                  'Enviado via gateway SIBS',
                  'Possibilidade de reenviar após 60 segundos',
                  'Máximo 3 códigos válidos em simultâneo',
                  'Obrigatório para transações > 50€ ou alterações de dados'
                ],
                priority: 'High',
                storyPoints: 8,
                expanded: false,
                tasks: [
                  { 
                    id: 'TSK-007', 
                    title: 'Integrar com gateway SMS SIBS',
                    description: 'Implementar comunicação com API SIBS para envio de SMS',
                    estimate: '8h',
                    assignee: 'Backend Developer',
                  },
                  { 
                    id: 'TSK-008', 
                    title: 'Algoritmo de geração OTP',
                    description: 'Implementar TOTP (Time-based OTP) com validação de janela temporal',
                    estimate: '5h',
                  },
                  { 
                    id: 'TSK-009', 
                    title: 'UI de inserção de código',
                    description: 'Interface com 6 campos + timer visual + opção de reenvio',
                    estimate: '6h',
                  },
                  { 
                    id: 'TSK-010', 
                    title: 'Sistema de rate limiting',
                    description: 'Prevenir abuso de reenvios e tentativas',
                    estimate: '4h',
                  }
                ],
                testCases: [
                  { 
                    id: 'TC-006', 
                    title: 'Validar fluxo completo OTP',
                    type: 'Functional',
                    steps: [
                      'Iniciar transação de 100€',
                      'Sistema solicita OTP',
                      'SMS recebido em < 10s',
                      'Inserir código correto',
                      'Validar e processar'
                    ],
                    expectedResult: 'Transação autorizada e processada com sucesso',
                  },
                  { 
                    id: 'TC-007', 
                    title: 'Testar expiração após 3 minutos',
                    type: 'Security',
                    steps: [
                      'Receber OTP',
                      'Aguardar 3 minutos',
                      'Tentar usar código'
                    ],
                    expectedResult: 'Código rejeitado, solicitar novo OTP',
                  }
                ]
              }
            ]
          },
          {
            id: 'FT-002',
            title: 'Gestão de Sessão e Timeout Regulamentar',
            description: 'Controlo de sessões conforme normas de segurança do Banco de Portugal',
            priority: 'High',
            expanded: false,
            userStories: [
              {
                id: 'US-003',
                title: 'Timeout Automático de Sessão',
                asA: 'sistema de segurança',
                iWant: 'terminar automaticamente sessões inativas',
                soThat: 'dados bancários não fiquem expostos em dispositivos sem supervisão',
                acceptanceCriteria: [
                  'Timeout após 5 minutos de inatividade',
                  'Modal de aviso 30 segundos antes',
                  'Qualquer interação renova o timer',
                  'Sessões terminadas limpam cache e dados sensíveis',
                  'Logs de início e fim de sessão'
                ],
                priority: 'High',
                storyPoints: 5,
                expanded: false,
                tasks: [
                  { id: 'TSK-011', title: 'Timer de inatividade global', estimate: '4h' },
                  { id: 'TSK-012', title: 'Modal de aviso com countdown', estimate: '3h' },
                  { id: 'TSK-013', title: 'Limpeza segura de dados na memória', estimate: '4h' }
                ],
                testCases: [
                  { 
                    id: 'TC-008', 
                    title: 'Validar timeout após 5min', 
                    type: 'Functional',
                    steps: ['Login', 'Não interagir', 'Aguardar 5min'],
                    expectedResult: 'Logout automático, dados limpos, redirect para login'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'EP-002',
        title: 'Transferências e Pagamentos MB Way',
        description: 'Sistema completo de transferências instantâneas, pagamentos a comerciantes e gestão de limites',
        businessValue: 'Funcionalidade core que gera volume transacional e receita de comissões',
        acceptanceCriteria: [
          'Transferências processadas em < 5 segundos',
          'Integração completa com rede SIBS',
          'Limites configuráveis por perfil de cliente',
          'Comprovantes digitais imediatos'
        ],
        expanded: false,
        features: [
          {
            id: 'FT-003',
            title: 'Transferências Instantâneas MB Way',
            description: 'Envio de dinheiro usando número de telemóvel, integrado com rede SIBS',
            priority: 'High',
            expanded: false,
            userStories: [
              {
                id: 'US-004',
                title: 'Transferir por Número de Telemóvel',
                asA: 'cliente particular',
                iWant: 'enviar dinheiro usando apenas o número de telemóvel do destinatário',
                soThat: 'não precise de saber o IBAN para fazer transferências',
                acceptanceCriteria: [
                  'Validar formato +351 9XX XXX XXX',
                  'Consultar destinatário via API SIBS',
                  'Apresentar nome do destinatário para confirmação',
                  'Processar em tempo real (< 5s)',
                  'Notificações push para ambos (remetente e destinatário)',
                  'Comprovante com QR code para prova de pagamento'
                ],
                priority: 'High',
                storyPoints: 13,
                expanded: false,
                tasks: [
                  { 
                    id: 'TSK-014', 
                    title: 'Integrar com API SIBS MB Way',
                    description: 'Implementar endpoints de consulta e transferência',
                    estimate: '13h',
                    assignee: 'Backend Developer'
                  },
                  { 
                    id: 'TSK-015', 
                    title: 'UI de seleção de destinatário',
                    description: 'Campo com validação de telemóvel + sugestões de contactos',
                    estimate: '5h'
                  },
                  { 
                    id: 'TSK-016', 
                    title: 'Tela de confirmação com OTP',
                    description: 'Mostrar dados, valor e solicitar OTP se > 50€',
                    estimate: '5h'
                  },
                  { 
                    id: 'TSK-017', 
                    title: 'Geração de comprovante PDF',
                    description: 'Template com QR code e dados completos da transação',
                    estimate: '6h'
                  },
                  { 
                    id: 'TSK-018', 
                    title: 'Sistema de notificações push',
                    description: 'Firebase/APNS para notificar ambas as partes',
                    estimate: '5h'
                  }
                ],
                testCases: [
                  { 
                    id: 'TC-009', 
                    title: 'Validar transferência completa',
                    type: 'Functional',
                    steps: [
                      'Inserir telemóvel válido',
                      'Sistema consulta SIBS',
                      'Confirma destinatário',
                      'Inserir valor (30€)',
                      'Autorizar (sem OTP < 50€)',
                      'Processar'
                    ],
                    expectedResult: 'Transferência concluída, saldo atualizado, notificações enviadas, comprovante disponível'
                  },
                  { 
                    id: 'TC-010', 
                    title: 'Testar limites diários',
                    type: 'Functional',
                    steps: [
                      'Executar transferências até atingir limite (1000€/dia)',
                      'Tentar mais uma transferência'
                    ],
                    expectedResult: 'Sistema bloqueia e informa limite atingido com valor disponível'
                  },
                  { 
                    id: 'TC-011', 
                    title: 'Validar performance de processamento',
                    type: 'Performance',
                    steps: [
                      'Executar 100 transferências sequenciais',
                      'Medir tempo de cada transação'
                    ],
                    expectedResult: '95% processadas em < 5s, sem erros'
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'EP-003',
        title: 'Compliance e Auditoria Bancária',
        description: 'Sistema de logs, auditoria e reports regulamentares para Banco de Portugal e BCE',
        businessValue: 'Garantir conformidade legal e evitar coimas regulamentares',
        acceptanceCriteria: [
          'Logs imutáveis de todas as transações',
          'Retenção de dados por 10 anos',
          'Reports automáticos para Banco de Portugal',
          'Pista de auditoria completa para BCE'
        ],
        expanded: false,
        features: []
      }
    ]
  },
  2: {
    id: 2,
    name: 'Portal Homebanking Empresas',
    code: 'HBEMP',
    platform: 'Azure DevOps',
    url: 'https://dev.azure.com/company/HBEMP',
    createdAt: new Date('2025-11-20'),
    exportedAt: new Date('2026-01-06'),
    description: 'Portal web de homebanking para empresas com gestão multi-utilizador, aprovações multinível e integração com sistemas ERP',
    color: 'from-purple-500 to-pink-500',
    structure: []
  },
  3: {
    id: 3,
    name: 'App Mobile Banking Particulares',
    code: 'MOBPART',
    platform: 'Jira',
    url: 'https://company.atlassian.net/browse/MOBPART',
    createdAt: new Date('2025-10-05'),
    exportedAt: new Date('2026-01-05'),
    description: 'App mobile nativa iOS/Android para clientes particulares com onboarding digital completo, gestão de contas, cartões e investimentos',
    color: 'from-green-500 to-emerald-500',
    structure: []
  },
  4: {
    id: 4,
    name: 'Plataforma Multibanco ATM',
    code: 'MBATM',
    platform: 'Jira',
    url: 'https://company.atlassian.net/browse/MBATM',
    createdAt: new Date('2025-09-10'),
    exportedAt: new Date('2026-01-02'),
    description: 'Plataforma de gestão de terminais ATM Multibanco com interface modernizada e integração completa com rede SIBS',
    color: 'from-orange-500 to-red-500',
    structure: []
  },
  5: {
    id: 5,
    name: 'API Open Banking PSD2',
    code: 'OPENAPI',
    platform: 'Azure DevOps',
    url: 'https://dev.azure.com/company/OPENAPI',
    createdAt: new Date('2025-08-25'),
    exportedAt: new Date('2025-12-28'),
    description: 'APIs RESTful PSD2 para Third Party Providers (AISP, PISP, CISP) com autenticação OAuth2 e mTLS',
    color: 'from-indigo-500 to-blue-500',
    structure: []
  },
  6: {
    id: 6,
    name: 'Portal Backoffice Operações',
    code: 'BACKOPS',
    platform: 'Jira',
    url: 'https://company.atlassian.net/browse/BACKOPS',
    createdAt: new Date('2025-07-15'),
    exportedAt: new Date('2025-12-20'),
    description: 'Portal interno para operadores de backoffice processar operações bancárias, gerir reclamações e gerar reports regulamentares',
    color: 'from-slate-500 to-gray-500',
    structure: []
  }
};

export function ProjectDetails({ onNavigate, projectId }: ProjectDetailsProps) {
  const project = projectId ? projectsData[projectId] : null;

  if (!project) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <p>Projeto não encontrado</p>
        <Button onClick={() => onNavigate('dashboard')}>Voltar ao Dashboard</Button>
      </div>
    );
  }

  const [structure, setStructure] = useState(project.structure);

  const toggleEpic = (epicId: string) => {
    setStructure((prev: any) => prev.map((epic: any) => 
      epic.id === epicId ? { ...epic, expanded: !epic.expanded } : epic
    ));
  };

  const toggleFeature = (epicId: string, featureId: string) => {
    setStructure((prev: any) => prev.map((epic: any) => 
      epic.id === epicId 
        ? {
            ...epic,
            features: epic.features.map((feature: any) =>
              feature.id === featureId ? { ...feature, expanded: !feature.expanded } : feature
            )
          }
        : epic
    ));
  };

  const toggleUserStory = (epicId: string, featureId: string, usId: string) => {
    setStructure((prev: any) => prev.map((epic: any) => 
      epic.id === epicId 
        ? {
            ...epic,
            features: epic.features.map((feature: any) =>
              feature.id === featureId
                ? {
                    ...feature,
                    userStories: feature.userStories.map((us: any) =>
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
    features: structure.reduce((acc: number, e: any) => acc + e.features.length, 0),
    userStories: structure.reduce((acc: number, e: any) => 
      acc + e.features.reduce((acc2: number, f: any) => acc2 + f.userStories.length, 0), 0
    ),
    tasks: structure.reduce((acc: number, e: any) => 
      acc + e.features.reduce((acc2: number, f: any) => 
        acc2 + f.userStories.reduce((acc3: number, us: any) => acc3 + us.tasks.length, 0), 0
      ), 0
    ),
    testCases: structure.reduce((acc: number, e: any) => 
      acc + e.features.reduce((acc2: number, f: any) => 
        acc2 + f.userStories.reduce((acc3: number, us: any) => acc3 + us.testCases.length, 0), 0
      ), 0
    ),
    totalStoryPoints: structure.reduce((acc: number, e: any) => 
      acc + e.features.reduce((acc2: number, f: any) => 
        acc2 + f.userStories.reduce((acc3: number, us: any) => acc3 + us.storyPoints, 0), 0
      ), 0
    ),
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
        <Button 
          onClick={() => onNavigate('dashboard')}
          variant="ghost"
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </Button>
        
        <div className="flex items-start gap-6 mb-6">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-xl flex-shrink-0`}>
            <Building2 className="w-10 h-10 text-white" />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-4xl mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {project.name}
                </h1>
                <p className="text-slate-600 mb-3">
                  {project.description}
                </p>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Badge variant="outline" className="font-mono text-base">
                    {project.code}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Criado: {project.createdAt.toLocaleDateString('pt-PT')}
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-4 h-4" />
                    Exportado: {project.exportedAt.toLocaleDateString('pt-PT')}
                  </span>
                </div>
              </div>
              
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors font-medium"
              >
                Abrir no {project.platform}
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
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
        </div>
      </div>

      {/* Structure */}
      <div className="space-y-4">
        {structure.map((epic: any) => (
          <Card key={epic.id} className="overflow-hidden bg-white/80 backdrop-blur-sm border-slate-200/50">
            {/* Epic Header */}
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div className="flex items-start gap-4">
                <button onClick={() => toggleEpic(epic.id)} className="mt-1">
                  {epic.expanded ? (
                    <ChevronDown className="w-6 h-6 text-blue-600" />
                  ) : (
                    <ChevronRight className="w-6 h-6 text-blue-600" />
                  )}
                </button>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Layers className="w-6 h-6 text-blue-600" />
                    <Badge className="bg-blue-600 text-white">{epic.id}</Badge>
                    <h3 className="text-xl font-semibold">{epic.title}</h3>
                  </div>
                  
                  <p className="text-slate-700 mb-3 ml-9">{epic.description}</p>
                  
                  <div className="ml-9 space-y-2">
                    <div className="flex items-start gap-2">
                      <Tag className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-700">Valor de Negócio:</p>
                        <p className="text-sm text-slate-600">{epic.businessValue}</p>
                      </div>
                    </div>
                    
                    {epic.acceptanceCriteria && epic.acceptanceCriteria.length > 0 && (
                      <div className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-slate-700 mb-1">Critérios de Aceitação:</p>
                          <ul className="text-sm text-slate-600 space-y-1">
                            {epic.acceptanceCriteria.map((criteria: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-600">•</span>
                                {criteria}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            {epic.expanded && epic.features.length > 0 && (
              <div className="p-6 space-y-4">
                {epic.features.map((feature: any) => (
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
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
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
                      </div>

                      {/* User Stories */}
                      {feature.expanded && feature.userStories.length > 0 && (
                        <div className="mt-4 ml-7 space-y-3">
                          {feature.userStories.map((us: any) => (
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
                                        {us.acceptanceCriteria && us.acceptanceCriteria.length > 0 && (
                                          <div className="p-3 bg-white rounded-lg border border-green-200">
                                            <p className="text-sm font-medium text-green-900 mb-2 flex items-center gap-2">
                                              <Shield className="w-4 h-4" />
                                              Critérios de Aceitação:
                                            </p>
                                            <ul className="text-sm text-slate-600 space-y-1">
                                              {us.acceptanceCriteria.map((criteria: string, idx: number) => (
                                                <li key={idx} className="flex items-start gap-2">
                                                  <CheckCircle2 className="w-3 h-3 text-green-600 mt-0.5 flex-shrink-0" />
                                                  {criteria}
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        )}

                                        {/* Tasks */}
                                        {us.tasks && us.tasks.length > 0 && (
                                          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                                            <div className="flex items-center gap-2 mb-3">
                                              <CheckSquare className="w-4 h-4 text-orange-600" />
                                              <span className="text-sm font-medium text-orange-900">
                                                Tasks Técnicas ({us.tasks.length})
                                              </span>
                                            </div>
                                            <div className="space-y-2">
                                              {us.tasks.map((task: any) => (
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
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {/* Test Cases */}
                                        {us.testCases && us.testCases.length > 0 && (
                                          <div className="p-3 bg-indigo-50 rounded-lg border border-indigo-200">
                                            <div className="flex items-center gap-2 mb-3">
                                              <FlaskConical className="w-4 h-4 text-indigo-600" />
                                              <span className="text-sm font-medium text-indigo-900">
                                                Casos de Teste ({us.testCases.length})
                                              </span>
                                            </div>
                                            <div className="space-y-2">
                                              {us.testCases.map((tc: any) => (
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
                                                        Passos:
                                                      </p>
                                                      <ol className="text-slate-600 space-y-1 pl-4">
                                                        {tc.steps.map((step: string, idx: number) => (
                                                          <li key={idx}>{idx + 1}. {step}</li>
                                                        ))}
                                                      </ol>
                                                    </div>
                                                    <div>
                                                      <p className="font-medium text-slate-700">
                                                        Resultado Esperado:
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
                                        )}
                                      </div>
                                    )}
                                  </div>
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
    </div>
  );
}
