import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft,
  MessageSquare,
  CheckCircle2,
  Circle,
  Sparkles,
  Send,
  Plus,
  ChevronRight,
  Layers,
  Boxes,
  FileText,
  CheckSquare,
  FlaskConical,
  AlertCircle,
  Info,
  Lightbulb,
  Shield,
  Eye,
  Download
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { Label } from '../ui/label';

type View = 
  | 'dashboard' 
  | 'new-project'
  | 'project-builder'
  | 'project-view'
  | 'templates'
  | 'library'
  | 'integrations'
  | 'audit';

interface ProjectBuilderProps {
  onNavigate?: (view: View) => void;
  projectData?: any;
  onFinish?: () => void;
}

export function ProjectBuilder({ onNavigate, projectData, onFinish }: ProjectBuilderProps = {}) {
  const navigate = useNavigate();
  const location = useLocation();
  const effectiveProjectData = projectData ?? (location.state as any)?.projectData ?? null;

  const navigateByView = (view: View) => {
    if (onNavigate) {
      onNavigate(view);
      return;
    }
    const map: Record<View, string> = {
      dashboard: '/dashboard',
      'new-project': '/new-project',
      'project-builder': '/project-builder',
      'project-view': '/project/999',
      templates: '/templates',
      library: '/library',
      integrations: '/integrations',
      audit: '/audit',
    };
    navigate(map[view]);
  };

  const finishFlow = () => {
    if (onFinish) {
      onFinish();
      return;
    }
    navigate('/project/999');
  };
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userInput, setUserInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedArtifact, setSelectedArtifact] = useState<any>(null);
  const [conversation, setConversation] = useState<any[]>([
    {
      role: 'assistant',
      content: 'Olá! Vou ajudá-lo a criar uma estrutura completa de requisitos para o projeto **Sistema de Pagamentos MB Way**. Vou fazer perguntas organizadas em 6 categorias para garantir que nada fica por documentar.',
      timestamp: new Date()
    },
    {
      role: 'assistant',
      content: 'Vamos começar pela categoria **Personas e Utilizadores** (1/6). Esta informação é fundamental para criar User Stories relevantes.',
      timestamp: new Date()
    },
    {
      role: 'assistant',
      content: '**Pergunta 1 de 6:** Quem são os utilizadores principais deste sistema? Descreva os perfis típicos que vão usar a aplicação MB Way.',
      timestamp: new Date(),
      categoryIndex: 0,
      questionIndex: 0
    }
  ]);

  const [capturedArtifacts, setCapturedArtifacts] = useState<any[]>([
    {
      type: 'userStory',
      id: 'US-001',
      title: 'Login com Biometria',
      confidence: 95,
      source: 'Inferido das respostas sobre autenticação'
    },
    {
      type: 'feature',
      id: 'FT-001',
      title: 'Autenticação PSD2',
      confidence: 98,
      source: 'Requisito de compliance mencionado'
    },
    {
      type: 'epic',
      id: 'EP-001',
      title: 'Segurança Bancária',
      confidence: 100,
      source: 'Categoria de compliance'
    }
  ]);

  const categories = [
    {
      id: 'personas',
      title: 'Personas e Utilizadores',
      icon: '👥',
      total: 6,
      questions: [
        'Quem são os utilizadores principais deste sistema?',
        'Quais são os objetivos e necessidades de cada persona?',
        'Que pain points enfrentam atualmente?',
        'Qual o nível de literacia digital esperado?',
        'Quais os contextos de uso principais (mobile, desktop, ATM)?',
        'Existem personas internas (backoffice, compliance)?'
      ]
    },
    {
      id: 'journeys',
      title: 'Jornadas de Utilizador',
      icon: '🗺️',
      total: 5,
      questions: [
        'Descreva o fluxo principal (happy path) da aplicação',
        'Quais são os pontos de entrada alternativos?',
        'Que cenários de erro devem ser contemplados?',
        'Existem jornadas secundárias importantes?',
        'Como funciona a navegação entre módulos?'
      ]
    },
    {
      id: 'business-rules',
      title: 'Regras de Negócio',
      icon: '⚖️',
      total: 5,
      questions: [
        'Quais são as regras de validação de dados críticas?',
        'Existem limites operacionais (valores, frequência)?',
        'Como funcionam os cálculos e algoritmos de negócio?',
        'Que condições acionam notificações ou alertas?',
        'Quais são as regras de compliance e regulação aplicáveis?'
      ]
    },
    {
      id: 'exceptions',
      title: 'Exceções e Casos Limite',
      icon: '⚠️',
      total: 4,
      questions: [
        'O que acontece quando dados estão indisponíveis?',
        'Como tratar timeouts de APIs externas (SIBS, Banco de Portugal)?',
        'Que fazer em caso de falha de pagamento ou transação?',
        'Como lidar com utilizadores bloqueados ou suspensos?'
      ]
    },
    {
      id: 'compliance',
      title: 'Compliance e Segurança',
      icon: '🛡️',
      total: 4,
      questions: [
        'Que requisitos PSD2 devem ser cumpridos?',
        'Como implementar Strong Customer Authentication (SCA)?',
        'Quais os logs de auditoria necessários (Banco de Portugal)?',
        'Que medidas anti-fraude devem ser implementadas?'
      ]
    },
    {
      id: 'testing',
      title: 'Testes e Validação',
      icon: '🧪',
      total: 4,
      questions: [
        'Que cenários de teste são prioritários?',
        'Quais os requisitos de performance esperados (SLA)?',
        'Que testes de segurança devem ser executados?',
        'Como validar compliance com regulação bancária?'
      ]
    }
  ];

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Add user message
    const newConversation = [
      ...conversation,
      {
        role: 'user',
        content: userInput,
        timestamp: new Date()
      }
    ];

    setConversation(newConversation);
    
    const nextQuestionIndex = currentQuestionIndex + 1;
    const currentCategory = categories[currentCategoryIndex];

    // Simulate AI response
    setTimeout(() => {
      const aiMessages: any[] = [
        {
          role: 'assistant',
          content: 'Excelente! Identifiquei **2 User Stories** e **1 Feature** com base na sua resposta. Veja os artefactos gerados no painel da direita.',
          timestamp: new Date(),
          artifacts: [
            { type: 'User Stories', count: 2 },
            { type: 'Features', count: 1 }
          ]
        }
      ];

      // Check if there are more questions in current category
      if (nextQuestionIndex < currentCategory.total) {
        // Next question in same category
        aiMessages.push({
          role: 'assistant',
          content: `**Pergunta ${nextQuestionIndex + 1} de ${currentCategory.total}:** ${currentCategory.questions[nextQuestionIndex]}`,
          timestamp: new Date(),
          categoryIndex: currentCategoryIndex,
          questionIndex: nextQuestionIndex
        });
        setCurrentQuestionIndex(nextQuestionIndex);
      } else {
        // Category completed
        aiMessages.push({
          role: 'assistant',
          content: `✅ **Categoria "${currentCategory.title}" concluída!** Todas as ${currentCategory.total} perguntas foram respondidas.`,
          timestamp: new Date()
        });

        // Check if there are more categories
        if (currentCategoryIndex < categories.length - 1) {
          const nextCategory = categories[currentCategoryIndex + 1];
          aiMessages.push({
            role: 'assistant',
            content: `Vamos avançar para a próxima categoria: **${nextCategory.title}** (${currentCategoryIndex + 2}/6). ${getCategoryIntro(currentCategoryIndex + 1)}`,
            timestamp: new Date()
          });
          aiMessages.push({
            role: 'assistant',
            content: `**Pergunta 1 de ${nextCategory.total}:** ${nextCategory.questions[0]}`,
            timestamp: new Date(),
            categoryIndex: currentCategoryIndex + 1,
            questionIndex: 0
          });
          setCurrentCategoryIndex(currentCategoryIndex + 1);
          setCurrentQuestionIndex(0);
        } else {
          // All done
          aiMessages.push({
            role: 'assistant',
            content: '🎉 **Parabéns!** Concluímos todas as 6 categorias e 24 perguntas. A estrutura completa do projeto está pronta para revisão e exportação.',
            timestamp: new Date()
          });
        }
      }

      setConversation([...newConversation, ...aiMessages]);
    }, 1000);

    setUserInput('');
  };

  const getCategoryIntro = (categoryIndex: number) => {
    const intros = [
      'Esta categoria ajuda-nos a mapear todos os fluxos de utilizador.',
      'Agora vamos definir as regras críticas de negócio.',
      'É importante identificar cenários de exceção e edge cases.',
      'Vamos validar as User Stories geradas automaticamente.',
      'Por fim, vamos garantir cobertura de testes adequada.'
    ];
    return intros[categoryIndex - 1] || '';
  };

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Calculate dynamic categories based on answered questions
  const getDynamicCategories = () => {
    return categories.map((cat, idx) => {
      let completed = 0;
      let status: 'pending' | 'in-progress' | 'completed' = 'pending';
      
      if (idx < currentCategoryIndex) {
        // Categorias anteriores - 100% completas
        completed = cat.total;
        status = 'completed';
      } else if (idx === currentCategoryIndex) {
        // Categoria atual - progresso real
        completed = currentQuestionIndex + 1; // +1 porque já respondemos à primeira pergunta
        status = completed === cat.total ? 'completed' : 'in-progress';
      } else {
        // Categorias futuras - 0%
        completed = 0;
        status = 'pending';
      }
      
      const progress = Math.round((completed / cat.total) * 100);
      
      return {
        ...cat,
        completed,
        progress,
        status
      };
    });
  };

  const dynamicCategories = getDynamicCategories();
  const totalAnswered = dynamicCategories.reduce((acc, cat) => acc + cat.completed, 0);
  const totalQuestions = dynamicCategories.reduce((acc, cat) => acc + cat.total, 0);
  const overallProgress = Math.round((totalAnswered / totalQuestions) * 100);

  const suggestions = [
    'Clientes particulares que fazem transferências frequentes',
    'Empresários que precisam de gestão de pagamentos',
    'Utilizadores seniores com menor literacia digital'
  ];

  const statusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'text-green-600 bg-green-50';
      case 'in-progress': return 'text-blue-600 bg-blue-50';
      case 'pending': return 'text-slate-400 bg-slate-50';
      default: return 'text-slate-400 bg-slate-50';
    }
  };

  const statusIcon = (status: string) => {
    switch(status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'in-progress': return <Circle className="w-4 h-4 fill-current" />;
      default: return <Circle className="w-4 h-4" />;
    }
  };

  const artifactIcon = (type: string) => {
    switch(type) {
      case 'epic': return <Layers className="w-3 h-3" />;
      case 'feature': return <Boxes className="w-3 h-3" />;
      case 'userStory': return <FileText className="w-3 h-3" />;
      case 'task': return <CheckSquare className="w-3 h-3" />;
      case 'testCase': return <FlaskConical className="w-3 h-3" />;
      default: return <FileText className="w-3 h-3" />;
    }
  };

  const artifactColor = (type: string) => {
    switch(type) {
      case 'epic': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'feature': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'userStory': return 'bg-green-50 text-green-700 border-green-200';
      case 'task': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'testCase': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigateByView('dashboard')}
              size="sm"
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div>
              <h1 className="text-lg font-semibold text-slate-900">IA Assistant - Estrutura de Requisitos</h1>
              <p className="text-sm text-slate-600">Sistema de Pagamentos MB Way</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-2">
              <Sparkles className="w-3 h-3" />
              Modo: Rigor Bancário
            </Badge>
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowPreview(true)}>
              <Eye className="w-4 h-4" />
              Preview
            </Button>
            <Button 
              size="sm" 
              className="gap-2 bg-slate-900 hover:bg-slate-800"
              disabled={totalAnswered < totalQuestions}
              onClick={() => {
                if (totalAnswered === totalQuestions) {
                  finishFlow();
                }
              }}
            >
              <Download className="w-4 h-4" />
              Finalizar e Exportar
            </Button>
          </div>
        </div>

        {/* Overall Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-slate-600">Progresso Geral</p>
            <p className="text-sm font-medium text-slate-900">
              {totalAnswered} de {totalQuestions} perguntas respondidas
            </p>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </div>

      {/* 3-Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column - Categories & Progress */}
        <div className="w-80 bg-white border-r border-slate-200 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex-shrink-0">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">Categorias de Análise</h2>
            <p className="text-xs text-slate-600">6 categorias de perguntas estruturadas</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {dynamicCategories.map((category, index) => (
                <button
                  key={category.id}
                  onClick={() => setCurrentCategoryIndex(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    currentCategoryIndex === index
                      ? 'border-slate-900 bg-slate-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${statusColor(category.status)}`}>
                      {category.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-medium text-slate-900">{category.title}</h3>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${statusColor(category.status)}`}>
                          {statusIcon(category.status)}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-slate-600">
                          {category.completed}/{category.total} perguntas
                        </p>
                        <p className="text-xs font-medium text-slate-900">{category.progress}%</p>
                      </div>
                      <Progress value={category.progress} className="h-1" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-slate-200 bg-blue-50 flex-shrink-0">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs font-medium text-blue-900 mb-1">Dica Inteligente</p>
                <p className="text-xs text-blue-700">
                  Responda com o máximo de detalhe possível. A IA vai usar as suas respostas para gerar User Stories, Tasks e Test Cases.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Center Column - Conversation */}
        <div className="flex-1 flex flex-col bg-slate-50 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-3xl mx-auto space-y-4 pb-4">
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                  )}
                  
                  <div className={`max-w-2xl ${message.role === 'user' ? 'order-1' : ''}`}>
                    <Card className={`p-4 ${
                      message.role === 'user'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-white border-slate-200'
                    }`}>
                      <p className={`text-sm whitespace-pre-wrap ${
                        message.role === 'user' ? 'text-white' : 'text-slate-700'
                      }`}>
                        {message.content}
                      </p>
                      
                      {message.artifacts && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-200">
                          {message.artifacts.map((artifact: any, idx: number) => (
                            <Badge key={idx} variant="secondary" className="gap-1">
                              <Plus className="w-3 h-3" />
                              {artifact.count} {artifact.type}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </Card>
                    <p className="text-xs text-slate-500 mt-1 px-4">
                      {message.timestamp.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>

                  {message.role === 'user' && (
                    <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center flex-shrink-0 order-2">
                      <span className="text-sm font-medium text-slate-700">AS</span>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 bg-white border-t border-slate-200 flex-shrink-0">
            <div className="max-w-3xl mx-auto">
              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="mb-3">
                  <p className="text-xs text-slate-600 mb-2 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    Sugestões:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => setUserInput(suggestion)}
                        className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Textarea
                  placeholder="Digite a sua resposta detalhada..."
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  className="min-h-24 resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!userInput.trim()}
                  className="bg-slate-900 hover:bg-slate-800 h-auto"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Enter para enviar, Shift+Enter para nova linha
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Captured Artifacts */}
        <div className="w-96 bg-white border-l border-slate-200 flex flex-col overflow-hidden">
          <div className="p-6 border-b border-slate-200 flex-shrink-0">
            <h2 className="text-sm font-semibold text-slate-900 mb-1">Artefactos Capturados</h2>
            <p className="text-xs text-slate-600">Gerados automaticamente pela IA</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Card className="p-3 border-blue-200 bg-blue-50">
                <div className="flex items-center gap-2 mb-1">
                  <Layers className="w-4 h-4 text-blue-600" />
                  <p className="text-xs font-medium text-blue-900">Epics</p>
                </div>
                <p className="text-2xl font-semibold text-blue-900">3</p>
              </Card>
              <Card className="p-3 border-purple-200 bg-purple-50">
                <div className="flex items-center gap-2 mb-1">
                  <Boxes className="w-4 h-4 text-purple-600" />
                  <p className="text-xs font-medium text-purple-900">Features</p>
                </div>
                <p className="text-2xl font-semibold text-purple-900">8</p>
              </Card>
              <Card className="p-3 border-green-200 bg-green-50">
                <div className="flex items-center gap-2 mb-1">
                  <FileText className="w-4 h-4 text-green-600" />
                  <p className="text-xs font-medium text-green-900">User Stories</p>
                </div>
                <p className="text-2xl font-semibold text-green-900">24</p>
              </Card>
              <Card className="p-3 border-orange-200 bg-orange-50">
                <div className="flex items-center gap-2 mb-1">
                  <FlaskConical className="w-4 h-4 text-orange-600" />
                  <p className="text-xs font-medium text-orange-900">Test Cases</p>
                </div>
                <p className="text-2xl font-semibold text-orange-900">45</p>
              </Card>
            </div>

            <Separator className="my-4" />

            {/* Recent Artifacts */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold text-slate-900">Recentes</h3>
                <Badge variant="secondary" className="text-xs">+3 novos</Badge>
              </div>

              <div className="space-y-2">
                {capturedArtifacts.map((artifact, index) => (
                  <Card key={index} className={`p-3 border ${artifactColor(artifact.type)}`}>
                    <div className="flex items-start gap-2 mb-2">
                      <div className={`w-6 h-6 rounded flex items-center justify-center ${artifactColor(artifact.type)}`}>
                        {artifactIcon(artifact.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-slate-600">{artifact.id}</span>
                          <Badge variant="outline" className="text-xs">
                            {artifact.confidence}% confiança
                          </Badge>
                        </div>
                        <p className="text-sm font-medium text-slate-900 mb-1">{artifact.title}</p>
                        <p className="text-xs text-slate-600">{artifact.source}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2 border-t border-current">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs flex-1"
                        onClick={() => setSelectedArtifact(artifact)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 text-xs flex-1"
                        onClick={() => {
                          alert(`✏️ A editar artefacto:\\n\\n` +
                                `ID: ${artifact.id}\\n` +
                                `Tipo: ${artifact.type}\\n` +
                                `Título: ${artifact.title}\\n\\n` +
                                `Esta funcionalidade permitiria editar:\\n` +
                                `• Título e descrição\\n` +
                                `• Critérios de aceitação\\n` +
                                `• Story points / complexidade\\n` +
                                `• Tags e labels`);
                        }}
                      >
                        Editar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            <Separator className="my-4" />

            {/* Quality Indicators */}
            <div>
              <h3 className="text-xs font-semibold text-slate-900 mb-3">Qualidade da Estrutura</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-slate-600">Cobertura de Requisitos</p>
                    <p className="text-xs font-medium text-green-700">85%</p>
                  </div>
                  <Progress value={85} className="h-1.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-slate-600">Compliance PSD2</p>
                    <p className="text-xs font-medium text-green-700">100%</p>
                  </div>
                  <Progress value={100} className="h-1.5" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-slate-600">Test Coverage</p>
                    <p className="text-xs font-medium text-amber-700">72%</p>
                  </div>
                  <Progress value={72} className="h-1.5" />
                </div>
              </div>
            </div>

            {/* Compliance Warnings */}
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-medium text-amber-900 mb-1">Atenção</p>
                  <p className="text-xs text-amber-700">
                    Faltam cenários de teste para autenticação SCA. Recomendo adicionar na categoria de Testes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Preview da Estrutura de Requisitos</h2>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => setShowPreview(false)}
              >
                Fechar
              </Button>
            </div>

            <div className="space-y-4">
              <Card className="p-4 bg-blue-50 text-blue-700 border-blue-200">
                <h3 className="text-sm font-medium mb-2">Epics (3)</h3>
                <ul className="text-xs space-y-1">
                  <li>• EP-001: Segurança Bancária</li>
                  <li>• EP-002: Gestão de Pagamentos</li>
                  <li>• EP-003: Experiência de Utilizador</li>
                </ul>
              </Card>
              <Card className="p-4 bg-purple-50 text-purple-700 border-purple-200">
                <h3 className="text-sm font-medium mb-2">Features (8)</h3>
                <ul className="text-xs space-y-1">
                  <li>• FT-001: Autenticação PSD2</li>
                  <li>• FT-002: Transferências Instantâneas</li>
                  <li>• FT-003: Gestão de Beneficiários</li>
                  <li>• FT-004: Notificações Push</li>
                  <li>• FT-005: Histórico de Transações</li>
                  <li className="text-xs text-purple-600">+ 3 more...</li>
                </ul>
              </Card>
              <Card className="p-4 bg-green-50 text-green-700 border-green-200">
                <h3 className="text-sm font-medium mb-2">User Stories (24)</h3>
                <ul className="text-xs space-y-1">
                  <li>• US-001: Login com Biometria</li>
                  <li>• US-002: Validação de Identidade</li>
                  <li>• US-003: Transferência entre Contas</li>
                  <li>• US-004: Confirmação por SMS</li>
                  <li>• US-005: Adicionar Beneficiário</li>
                  <li className="text-xs text-green-600">+ 19 more...</li>
                </ul>
              </Card>
              <Card className="p-4 bg-orange-50 text-orange-700 border-orange-200">
                <h3 className="text-sm font-medium mb-2">Test Cases (45)</h3>
                <p className="text-xs">Cenários de teste gerados para garantir cobertura completa de funcionalidades, edge cases e compliance PSD2.</p>
              </Card>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                size="sm"
                className="bg-slate-900 hover:bg-slate-800"
                onClick={() => {
                  setShowPreview(false);
                  navigateByView('project-view');
                }}
              >
                <Download className="w-4 h-4 mr-2" />
                Finalizar e Exportar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreview(false)}
              >
                Continuar a Editar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Artifact Detail Modal */}
      {selectedArtifact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 max-w-2xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded flex items-center justify-center ${artifactColor(selectedArtifact.type)}`}>
                  {artifactIcon(selectedArtifact.type)}
                </div>
                <div>
                  <p className="text-xs font-mono text-slate-600">{selectedArtifact.id}</p>
                  <h2 className="text-lg font-semibold text-slate-900">{selectedArtifact.title}</h2>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedArtifact(null)}
              >
                Fechar
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-xs font-medium text-slate-700">Descrição</Label>
                <p className="text-sm text-slate-600 mt-1">
                  Como utilizador do sistema MB Way, quero fazer login usando biometria (impressão digital ou Face ID) para aceder à aplicação de forma rápida e segura.
                </p>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-700">Critérios de Aceitação</Label>
                <ul className="text-sm text-slate-600 mt-1 space-y-1">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Sistema deve suportar impressão digital (Touch ID) e reconhecimento facial (Face ID)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Deve existir fallback para PIN em caso de falha biométrica</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Cumprimento de requisitos PSD2 para Strong Customer Authentication</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Máximo de 3 tentativas falhadas antes de bloqueio temporário</span>
                  </li>
                </ul>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs font-medium text-slate-700">Story Points</Label>
                  <p className="text-lg font-semibold text-slate-900 mt-1">5</p>
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-700">Prioridade</Label>
                  <Badge className="mt-1 bg-red-100 text-red-700">Alta</Badge>
                </div>
                <div>
                  <Label className="text-xs font-medium text-slate-700">Confiança IA</Label>
                  <p className="text-lg font-semibold text-green-700 mt-1">{selectedArtifact.confidence}%</p>
                </div>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-700">Fonte</Label>
                <p className="text-sm text-slate-600 mt-1">{selectedArtifact.source}</p>
              </div>

              <div>
                <Label className="text-xs font-medium text-slate-700">Tags</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  <Badge variant="outline">PSD2</Badge>
                  <Badge variant="outline">Biometria</Badge>
                  <Badge variant="outline">Autenticação</Badge>
                  <Badge variant="outline">Mobile</Badge>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                size="sm"
                className="bg-slate-900 hover:bg-slate-800"
                onClick={() => {
                  alert('✏️ Modo de edição ativado para ' + selectedArtifact.id);
                  setSelectedArtifact(null);
                }}
              >
                Editar Artefacto
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedArtifact(null)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
