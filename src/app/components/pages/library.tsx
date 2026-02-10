import { Library as LibraryIcon, Users, BookOpen, TestTube, FileText, Plus, Eye, Copy, MoreVertical, Shield, CheckCircle2, Star, Sparkles, Clock, TrendingUp, Info } from 'lucide-react';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { AddPersonaDialog } from '../add-persona-dialog';
import { AddBusinessRuleDialog } from '../add-business-rule-dialog';
import { AddAcceptanceCriteriaDialog } from '../add-acceptance-criteria-dialog';
import { AddTestCaseDialog } from '../add-test-case-dialog';

type View = 
  | 'dashboard' 
  | 'new-project'
  | 'project-builder'
  | 'project-view'
  | 'templates'
  | 'library'
  | 'integrations'
  | 'audit';

interface LibraryProps {
  onNavigate?: (view: View) => void;
}

export function Library({ onNavigate }: LibraryProps = {}) {
  const [personas, setPersonas] = useState([
    {
      id: 1,
      name: 'Cliente Particular Digital',
      description: 'Cliente bancário entre 25-45 anos, alta literacia digital, utiliza principalmente canais digitais (app mobile, homebanking)',
      goals: [
        'Acesso rápido e seguro à conta bancária',
        'Realizar transferências sem deslocação ao balcão',
        'Monitorizar despesas e investimentos em tempo real'
      ],
      painPoints: [
        'Processos de autenticação longos e complexos',
        'Falta de transparência em comissões',
        'Dificuldade em contactar suporte quando necessário'
      ],
      technicalProfile: 'Smartphone iOS/Android, Confortável com biometria',
      usageFrequency: 'Diária',
      tags: ['Mobile', 'Digital-First', 'Retail'],
      usedIn: 12
    },
    {
      id: 2,
      name: 'Cliente Empresarial PME',
      description: 'Gestor financeiro ou CEO de PME, responsável por tesouraria e pagamentos a fornecedores, necessita de controlo multi-utilizador',
      goals: [
        'Gestão centralizada de múltiplas contas empresariais',
        'Aprovação de pagamentos com multi-assinatura',
        'Exportação de movimentos para software de contabilidade'
      ],
      painPoints: [
        'Falta de workflows de aprovação customizáveis',
        'Dificuldade em gerir permissões de utilizadores',
        'Ausência de APIs para integração com ERP'
      ],
      technicalProfile: 'Desktop/Web, Integrações via API',
      usageFrequency: 'Diária',
      tags: ['Corporate', 'Multi-user', 'Treasury'],
      usedIn: 8
    },
    {
      id: 3,
      name: 'Backoffice Operator',
      description: 'Colaborador interno do banco responsável por processar operações, resolver reclamações e executar tarefas de compliance',
      goals: [
        'Processar operações de forma eficiente',
        'Acesso a histórico completo de transações',
        'Gerar reports regulamentares'
      ],
      painPoints: [
        'Sistemas legacy com UI desatualizada',
        'Falta de automação em tarefas repetitivas',
        'Informação dispersa em múltiplos sistemas'
      ],
      technicalProfile: 'Desktop, Formação interna',
      usageFrequency: 'Contínua (8h/dia)',
      tags: ['Internal', 'Operations', 'Compliance'],
      usedIn: 5
    },
    {
      id: 4,
      name: 'Cliente Senior',
      description: 'Cliente bancário acima dos 65 anos, baixa/média literacia digital, prefere simplicidade e suporte humano',
      goals: [
        'Consultar saldos de forma simples',
        'Pagar serviços essenciais (água, luz)',
        'Contactar banco facilmente em caso de dúvida'
      ],
      painPoints: [
        'Interfaces complexas com muitas opções',
        'Medo de errar em operações financeiras',
        'Textos pequenos e contraste insuficiente'
      ],
      technicalProfile: 'Smartphone básico, Preferência por ATM',
      usageFrequency: 'Semanal',
      tags: ['Accessibility', 'Senior', 'Support'],
      usedIn: 3
    },
    {
      id: 5,
      name: 'Cliente Premium Private Banking',
      description: 'Cliente high-net-worth com patrimônio > €1M, espera atendimento personalizado e produtos exclusivos',
      goals: [
        'Acesso a produtos de investimento exclusivos',
        'Gestor de conta dedicado disponível 24/7',
        'Relatórios fiscais e patrimoniais customizados'
      ],
      painPoints: [
        'Falta de personalização nos dashboards',
        'Dificuldade em consolidar investimentos globais',
        'Produtos standard não atendem necessidades específicas'
      ],
      technicalProfile: 'Multi-dispositivo, Espera concierge digital',
      usageFrequency: 'Diária',
      tags: ['Premium', 'Wealth', 'Investments'],
      usedIn: 6
    },
    {
      id: 6,
      name: 'Developer Third-Party Provider',
      description: 'Desenvolvedor de FinTech TPP que consome APIs Open Banking PSD2',
      goals: [
        'Integração simples e bem documentada',
        'Sandbox para testes sem risco',
        'Monitorização de rate limits e quotas'
      ],
      painPoints: [
        'Documentação de APIs desatualizada',
        'Processos de onboarding demorados',
        'Ausência de webhooks para eventos'
      ],
      technicalProfile: 'REST/GraphQL, OAuth2, Postman',
      usageFrequency: 'Diária (desenvolvimento)',
      tags: ['Developer', 'API', 'OpenBanking'],
      usedIn: 4
    },
    {
      id: 7,
      name: 'Compliance Officer',
      description: 'Responsável por garantir conformidade regulamentar, auditorias e reports para Banco de Portugal',
      goals: [
        'Acesso a logs imutáveis de todas as transações',
        'Geração automática de reports regulamentares',
        'Alertas em tempo real de atividades suspeitas'
      ],
      painPoints: [
        'Dados espalhados em múltiplos sistemas',
        'Dificuldade em provar compliance em auditorias',
        'Reports manuais consumem muito tempo'
      ],
      technicalProfile: 'Desktop, Excel, BI Tools',
      usageFrequency: 'Diária',
      tags: ['Compliance', 'Audit', 'Regulatory'],
      usedIn: 7
    },
    {
      id: 8,
      name: 'Cliente Jovem Universitário',
      description: 'Estudante universitário 18-24 anos, primeira conta bancária, prefere app mobile e cashback',
      goals: [
        'Conta sem comissões de manutenção',
        'Notificações de gastos em tempo real',
        'Cashback e descontos em marcas jovens'
      ],
      painPoints: [
        'Comissões elevadas para saldo baixo',
        'Apps bancárias tradicionais pouco intuitivas',
        'Falta de educação financeira integrada'
      ],
      technicalProfile: 'Smartphone iOS/Android, Redes sociais',
      usageFrequency: 'Diária',
      tags: ['Youth', 'Student', 'Mobile'],
      usedIn: 5
    },
    {
      id: 9,
      name: 'Tesoureiro Corporate',
      description: 'CFO de grande empresa, gere milhões de euros diariamente, necessita de cash management avançado',
      goals: [
        'Visão consolidada de todas as contas e subsidiárias',
        'Previsão de cash flow automática',
        'Integração com Swift para pagamentos internacionais'
      ],
      painPoints: [
        'Impossível consolidar dados de múltiplos bancos',
        'Falta de previsão de liquidez',
        'Processos manuais para reconciliação'
      ],
      technicalProfile: 'Desktop, SAP/ERP, Excel avançado',
      usageFrequency: 'Contínua',
      tags: ['Treasury', 'Corporate', 'Enterprise'],
      usedIn: 3
    },
    {
      id: 10,
      name: 'Branch Manager',
      description: 'Gerente de balcão responsável por atendimento presencial e vendas de produtos',
      goals: [
        'Acesso rápido a dados do cliente durante atendimento',
        'Aprovar operações excepcionais',
        'Dashboard de performance da agência'
      ],
      painPoints: [
        'Sistemas lentos durante atendimento',
        'Impossível ver histórico completo do cliente',
        'Falta de sugestões de cross-sell'
      ],
      technicalProfile: 'Desktop, Tablet, CRM',
      usageFrequency: 'Contínua',
      tags: ['Branch', 'Sales', 'Internal'],
      usedIn: 4
    }
  ]);

  // Form state for new persona
  const [isAddPersonaOpen, setIsAddPersonaOpen] = useState(false);
  const [newPersona, setNewPersona] = useState({
    name: '',
    description: '',
    goals: ['', '', ''],
    painPoints: ['', '', ''],
    technicalProfile: '',
    usageFrequency: '',
    tags: ''
  });

  const [businessRules, setBusinessRules] = useState([
    {
      id: 1,
      category: 'Transferências',
      name: 'Limite diário de transferências MB Way',
      rule: 'Transferências via MB Way limitadas a €1000/dia para particulares e €5000/dia para empresas',
      validation: 'SUM(transferências_dia) <= limite_perfil',
      exceptions: 'Limites podem ser aumentados mediante pedido e aprovação de compliance',
      compliance: ['PSD2', 'AML'],
      usedIn: 8
    },
    {
      id: 2,
      category: 'Autenticação',
      name: 'SCA Obrigatória PSD2',
      rule: 'Strong Customer Authentication obrigatória para transações > €30 ou operações sensíveis',
      validation: 'IF valor > 30 EUR OR operacao_sensivel THEN require_sca()',
      exceptions: 'Isenções: Pagamentos recorrentes trusted, Low-value < 30€ (máx 5 consecutivas)',
      compliance: ['PSD2', 'SCA'],
      usedIn: 15
    },
    {
      id: 3,
      category: 'Cartões',
      name: 'Bloqueio após tentativas falhadas',
      rule: 'Cartão bloqueado automaticamente após 3 tentativas de PIN incorretas',
      validation: 'IF tentativas_pin_falhadas >= 3 THEN bloquear_cartao()',
      exceptions: 'Desbloqueio em balcão com identificação ou via app com biometria',
      compliance: ['Security', 'Fraud Prevention'],
      usedIn: 6
    },
    {
      id: 4,
      category: 'Onboarding',
      name: 'KYC Digital - Verificação de Identidade',
      rule: 'Abertura de conta digital requer validação de CC/Passaporte + Liveness detection + Prova de morada',
      validation: 'documento_valido AND face_match > 95% AND morada_confirmada',
      exceptions: 'Documentos expirados há menos de 6 meses aceites temporariamente',
      compliance: ['KYC', 'AML', 'eIDAS'],
      usedIn: 4
    },
    {
      id: 5,
      category: 'Transferências',
      name: 'Validação IBAN SEPA',
      rule: 'IBAN deve ser validado com algoritmo modulo 97 antes de processamento',
      validation: 'validar_iban_mod97(iban) AND iban.length IN (21,25) AND iban[0:2] IN paises_sepa',
      exceptions: 'IBANs de países fora SEPA requerem SWIFT/BIC obrigatório',
      compliance: ['SEPA', 'ISO 13616'],
      usedIn: 11
    },
    {
      id: 6,
      category: 'Compliance',
      name: 'Retenção de Logs Transacionais',
      rule: 'Todos os logs de transações devem ser mantidos por 10 anos em formato imutável',
      validation: 'log_retention_period >= 3650 days AND log_immutable = true',
      exceptions: 'Logs anonimizados para analytics podem ter retenção de 5 anos',
      compliance: ['Banco de Portugal', 'GDPR', 'Audit'],
      usedIn: 9
    },
    {
      id: 7,
      category: 'Pagamentos',
      name: 'Timeout de Sessão Pagamento',
      rule: 'Sessão de pagamento expira após 5 minutos de inatividade por segurança',
      validation: 'IF last_activity > 300 seconds THEN invalidar_sessao()',
      exceptions: 'Operações em curso têm timeout estendido para 10 minutos',
      compliance: ['PSD2', 'Security'],
      usedIn: 7
    },
    {
      id: 8,
      category: 'Crédito',
      name: 'Credit Scoring Mínimo',
      rule: 'Aprovação automática de crédito requer score >= 650 e debt-to-income < 40%',
      validation: 'credit_score >= 650 AND (dividas_mensais / rendimento) < 0.40',
      exceptions: 'Clientes Premium podem ter score >= 600 com análise manual',
      compliance: ['Banco de Portugal', 'Responsible Lending'],
      usedIn: 3
    },
    {
      id: 9,
      category: 'AML',
      name: 'Monitorização de Transações Suspeitas',
      rule: 'Transações >= €10.000 ou padrões anómalos devem ser sinalizadas para análise AML',
      validation: 'IF valor >= 10000 OR anomalia_detectada THEN criar_alerta_aml()',
      exceptions: 'Transferências empresariais recorrentes whitelist após aprovação',
      compliance: ['AML', 'FATF', 'Banco de Portugal'],
      usedIn: 10
    },
    {
      id: 10,
      category: 'Privacidade',
      name: 'Consentimento GDPR Explícito',
      rule: 'Processamento de dados sensíveis requer consentimento explícito e granular do cliente',
      validation: 'consentimento_explicito = true AND data_consentimento NOT NULL',
      exceptions: 'Processamento para compliance legal não requer consentimento',
      compliance: ['GDPR', 'Privacy'],
      usedIn: 12
    },
    {
      id: 11,
      category: 'Investimentos',
      name: 'MiFID II - Adequação de Produto',
      rule: 'Produtos de investimento só podem ser comercializados após teste de adequação do cliente',
      validation: 'teste_adequacao_completo AND risco_produto <= perfil_risco_cliente',
      exceptions: 'Clientes profissionais podem waiver o teste',
      compliance: ['MiFID II', 'CMVM'],
      usedIn: 5
    },
    {
      id: 12,
      category: 'API',
      name: 'Rate Limiting Open Banking',
      rule: 'APIs PSD2 limitadas a 100 requests/minuto por TPP com burst de 150',
      validation: 'requests_per_minute <= 100 OR (burst <= 150 AND burst_duration < 10s)',
      exceptions: 'TPPs certificados Tier-1 têm limite de 200 req/min',
      compliance: ['PSD2', 'API Security'],
      usedIn: 6
    }
  ]);

  const [acceptanceCriteria, setAcceptanceCriteria] = useState([
    {
      id: 1,
      category: 'Autenticação',
      feature: 'Login Biométrico',
      criteria: [
        'Sistema reconhece Face ID ou Touch ID do dispositivo',
        'Fallback para PIN em caso de falha biométrica',
        'Máximo 3 tentativas falhadas antes de bloqueio',
        'Tempo de autenticação < 2 segundos (P95)',
        'Biometria não armazenada em servidor (local device only)',
        'Log de auditoria criado para cada tentativa'
      ],
      usedIn: 10
    },
    {
      id: 2,
      category: 'Transferências',
      feature: 'Transferência SEPA',
      criteria: [
        'Campo IBAN validado com algoritmo modulo 97',
        'BIC preenchido automaticamente se IBAN PT',
        'Limite diário validado antes de submeter',
        'Descrição limitada a 140 caracteres',
        'Confirmação exibida antes de executar',
        'Notificação push enviada após conclusão'
      ],
      usedIn: 7
    },
    {
      id: 3,
      category: 'Pagamentos',
      feature: 'Pagamento MB Way Comerciante',
      criteria: [
        'QR Code escaneado e validado em < 1 segundo',
        'Montante exibido claramente antes de confirmar',
        'SCA obrigatória se valor > €30',
        'Recibo digital gerado automaticamente',
        'Pagamento reversível em 15 minutos',
        'Merchant validado contra lista SIBS'
      ],
      usedIn: 9
    }
  ]);

  const [testCases, setTestCases] = useState([
    {
      id: 1,
      category: 'Security',
      name: 'Validar proteção anti-spoofing biométrico',
      priority: 'Critical',
      type: 'Security',
      steps: [
        'Preparar foto impressa do utilizador',
        'Tentar autenticação com foto',
        'Preparar vídeo gravado do utilizador',
        'Tentar autenticação com vídeo',
        'Validar que ambos são rejeitados'
      ],
      expectedResult: 'Sistema rejeita foto e vídeo, exige liveness real, cria log de tentativa de spoofing',
      usedIn: 8
    },
    {
      id: 2,
      category: 'Compliance',
      name: 'Validar conformidade PSD2 em transação',
      priority: 'High',
      type: 'Compliance',
      steps: [
        'Iniciar transferência de €50',
        'Validar que SCA é solicitada',
        'Completar SCA com 2 fatores',
        'Verificar log de auditoria',
        'Validar retenção de logs (10 anos)'
      ],
      expectedResult: 'SCA executada, logs completos armazenados com encriptação AES-256, retenção configurada',
      usedIn: 12
    },
    {
      id: 3,
      category: 'Performance',
      name: 'Teste de carga - 1000 utilizadores simultâneos',
      priority: 'Medium',
      type: 'Performance',
      steps: [
        'Configurar JMeter com 1000 threads',
        'Simular login simultâneo',
        'Executar transferências concorrentes',
        'Medir tempos de resposta (P95, P99)',
        'Validar ausência de deadlocks'
      ],
      expectedResult: 'P95 < 2s, P99 < 3s, 0 erros, CPU < 70%, memória estável',
      usedIn: 5
    }
  ]);

  const [selectedPersona, setSelectedPersona] = useState(null);
  const [selectedRule, setSelectedRule] = useState(null);
  const [selectedCriteria, setSelectedCriteria] = useState(null);
  const [selectedTest, setSelectedTest] = useState(null);

  const handleAddPersona = (newPersona: any) => {
    setPersonas([...personas, newPersona]);
  };

  const handleAddBusinessRule = (newRule: any) => {
    setBusinessRules([...businessRules, newRule]);
  };

  const handleAddAcceptanceCriteria = (newCriteria: any) => {
    setAcceptanceCriteria([...acceptanceCriteria, newCriteria]);
  };

  const handleAddTestCase = (newTestCase: any) => {
    setTestCases([...testCases, newTestCase]);
  };

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Biblioteca Reutilizável
        </h1>
        <p className="text-slate-600">
          Repositório central de componentes bancários reutilizáveis para acelerar e padronizar a criação de projetos
        </p>
      </div>

      {/* What is Library - Explanation Card */}
      <Card className="p-6 border-blue-200 bg-gradient-to-br from-blue-50 to-white mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <LibraryIcon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
              O que é a Biblioteca Reutilizável?
              <Sparkles className="w-5 h-5 text-blue-600" />
            </h2>
            
            <p className="text-sm text-slate-700 mb-4 leading-relaxed">
              A <strong>Biblioteca</strong> é o repositório central da Ageas Portugal onde são armazenados e organizados <strong>componentes bancários reutilizáveis</strong> — personas, regras de negócio, acceptance criteria e test cases validados — que podem ser <strong>importados automaticamente</strong> pelo IA Assistant ao criar novos projetos.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-white border border-blue-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Acelera Criação</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Em vez de escrever personas do zero, <strong>reutilize "Cliente Particular Digital"</strong> ou "Cliente Empresarial PME" já validados em 12+ projetos anteriores.
                </p>
              </div>

              <div className="bg-white border border-blue-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-green-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Garante Compliance</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Regras de negócio como <strong>"SCA Obrigatória PSD2"</strong> já estão pré-aprovadas por Compliance e Jurídico, evitando revisões demoradas.
                </p>
              </div>

              <div className="bg-white border border-blue-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Padroniza Qualidade</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Todos os departamentos usam os <strong>mesmos acceptance criteria</strong> para "Login Biométrico", garantindo consistência entre projetos.
                </p>
              </div>

              <div className="bg-white border border-blue-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-orange-600" />
                  <h3 className="text-sm font-semibold text-slate-900">Melhora Continuamente</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Componentes são <strong>versionados e auditados</strong>. Quando uma regra PSD2 é atualizada, todos os projetos futuros usam a versão mais recente.
                </p>
              </div>
            </div>

            <div className="bg-blue-100 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-700 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-blue-900 mb-1">Como Funciona?</p>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    <strong>1)</strong> Durante o wizard de projeto, o IA Assistant sugere automaticamente personas e regras relevantes da Biblioteca. 
                    <strong>2)</strong> Você aceita ou adapta os componentes sugeridos. 
                    <strong>3)</strong> No final, toda a estrutura (Epics, Features, User Stories, Tasks, Test Cases) já inclui esses componentes validados, <strong>reduzindo tempo de criação em 60%</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{personas.length}</p>
              <p className="text-xs text-slate-600">Personas</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{businessRules.length}</p>
              <p className="text-xs text-slate-600">Regras de Negócio</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{acceptanceCriteria.length}</p>
              <p className="text-xs text-slate-600">Acceptance Criteria</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <TestTube className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{testCases.length}</p>
              <p className="text-xs text-slate-600">Test Cases Base</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="personas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personas">Personas</TabsTrigger>
          <TabsTrigger value="rules">Regras de Negócio</TabsTrigger>
          <TabsTrigger value="criteria">Acceptance Criteria</TabsTrigger>
          <TabsTrigger value="tests">Test Cases Base</TabsTrigger>
        </TabsList>

        <TabsContent value="personas">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">
              {personas.length} persona{personas.length !== 1 ? 's' : ''} disponíve{personas.length !== 1 ? 'is' : 'l'} na biblioteca
            </p>
            <AddPersonaDialog onAddPersona={handleAddPersona} />
          </div>

          <div className="space-y-4">
            {personas.map((persona) => (
              <Card key={persona.id} className="p-6 border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-slate-900">{persona.name}</h3>
                        <Badge variant="secondary" className="text-xs">
                          Usado em {persona.usedIn} projetos
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-700 mb-3">{persona.description}</p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <p className="text-xs font-medium text-slate-900 mb-2">🎯 Objetivos</p>
                          <ul className="text-sm text-slate-600 space-y-1">
                            {persona.goals.map((goal, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>{goal}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-900 mb-2">⚠️ Pain Points</p>
                          <ul className="text-sm text-slate-600 space-y-1">
                            {persona.painPoints.map((pain, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="text-red-600 mt-1">•</span>
                                <span>{pain}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-slate-600 mb-3">
                        <span>💻 {persona.technicalProfile}</span>
                        <span>📊 {persona.usageFrequency}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {persona.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Completo
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Duplicar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Plus className="w-4 h-4 mr-2" />
                        Usar em Projeto
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rules">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">
              {businessRules.length} regra{businessRules.length !== 1 ? 's' : ''} de negócio disponíve{businessRules.length !== 1 ? 'is' : 'l'} na biblioteca
            </p>
            <AddBusinessRuleDialog onAddRule={handleAddBusinessRule} />
          </div>

          <div className="space-y-4">
            {businessRules.map((rule) => (
              <Card key={rule.id} className="p-6 border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50">
                          {rule.category}
                        </Badge>
                        <h3 className="font-semibold text-slate-900">{rule.name}</h3>
                        <Badge variant="secondary" className="text-xs ml-auto">
                          Usado em {rule.usedIn} projetos
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-slate-900 mb-1">📋 Regra</p>
                          <p className="text-sm text-slate-700">{rule.rule}</p>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-slate-900 mb-1">✅ Validação</p>
                          <code className="text-xs bg-slate-50 text-slate-800 px-2 py-1 rounded font-mono block">
                            {rule.validation}
                          </code>
                        </div>

                        <div>
                          <p className="text-xs font-medium text-slate-900 mb-1">⚠️ Exceções</p>
                          <p className="text-sm text-slate-600">{rule.exceptions}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-green-600" />
                          {rule.compliance.map((comp) => (
                            <Badge key={comp} className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50 text-xs">
                              {comp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar Regra
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar a Feature
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="criteria">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">
              {acceptanceCriteria.length} set{acceptanceCriteria.length !== 1 ? 's' : ''} de acceptance criteria disponíve{acceptanceCriteria.length !== 1 ? 'is' : 'l'} na biblioteca
            </p>
            <AddAcceptanceCriteriaDialog onAddCriteria={handleAddAcceptanceCriteria} />
          </div>

          <div className="space-y-4">
            {acceptanceCriteria.map((ac) => (
              <Card key={ac.id} className="p-6 border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
                          {ac.category}
                        </Badge>
                        <h3 className="font-semibold text-slate-900">{ac.feature}</h3>
                        <Badge variant="secondary" className="text-xs ml-auto">
                          Usado em {ac.usedIn} projetos
                        </Badge>
                      </div>
                      
                      <div className="bg-white border border-green-200 rounded-lg p-4">
                        <p className="text-xs font-medium text-green-900 mb-2">Acceptance Criteria</p>
                        <ul className="space-y-2">
                          {ac.criteria.map((criterion, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                              <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{criterion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar Critérios
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar a US
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tests">
          {/* Header with Add Button */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-slate-600">
              {testCases.length} test case{testCases.length !== 1 ? 's' : ''} disponíve{testCases.length !== 1 ? 'is' : 'l'} na biblioteca
            </p>
            <AddTestCaseDialog onAddTestCase={handleAddTestCase} />
          </div>

          <div className="space-y-4">
            {testCases.map((test) => (
              <Card key={test.id} className="p-6 border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                      <TestTube className="w-6 h-6 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Badge className={
                          test.type === 'Security' ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-50' :
                          test.type === 'Compliance' ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50' :
                          'bg-green-50 text-green-700 border-green-200 hover:bg-green-50'
                        }>
                          {test.type}
                        </Badge>
                        <Badge className={
                          test.priority === 'Critical' ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-50' :
                          test.priority === 'High' ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50' :
                          'bg-green-50 text-green-700 border-green-200 hover:bg-green-50'
                        }>
                          {test.priority}
                        </Badge>
                        <h3 className="font-semibold text-slate-900">{test.name}</h3>
                        <Badge variant="secondary" className="text-xs ml-auto">
                          Usado em {test.usedIn} projetos
                        </Badge>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-slate-900 mb-2">📝 Passos</p>
                          <ol className="space-y-1">
                            {test.steps.map((step, idx) => (
                              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                                <span className="text-slate-500 font-medium min-w-[1.5rem]">{idx + 1}.</span>
                                <span>{step}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-xs font-medium text-green-900 mb-1">✅ Resultado Esperado</p>
                          <p className="text-sm text-green-700">{test.expectedResult}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar Test Case
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar a US
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
