import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Brain,
  MessageCircle,
  ListChecks
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

type View = 'dashboard' | 'analysis' | 'questionnaire' | 'structure' | 'integrations';

interface AIQuestionnaireProps {
  onNavigate: (view: View) => void;
  projectData: any;
}

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  category?: string;
}

interface QuestionCategory {
  name: string;
  completed: boolean;
  questions: number;
  answered: number;
}

export function AIQuestionnaire({ onNavigate, projectData }: AIQuestionnaireProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: 'ai',
      content: `Olá! Recebi as informações do projeto "${projectData?.projectName || 'seu projeto'}". Vou fazer perguntas detalhadas em 6 categorias para criar a estrutura mais completa possível. Cada pergunta ajuda a IA a gerar Epics, Features, User Stories, Tasks e Test Cases mais precisos.`,
      timestamp: new Date(),
      category: 'intro'
    },
    {
      id: 2,
      type: 'ai',
      content: '📋 **CATEGORIA 1: PERSONAS E UTILIZADORES**\n\nVamos começar pelos utilizadores. Descreva as principais personas que vão interagir com o sistema. Para cada persona, inclua:\n- Papel/função\n- Objetivos principais\n- Pain points\n- Nível de conhecimento técnico\n\nExemplo: "Cliente final: idade 25-45, usa mobile frequentemente, precisa fazer pagamentos rápidos, frustrado com processos lentos..."',
      timestamp: new Date(),
      category: 'personas'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(0);
  const [currentQuestionInCategory, setCurrentQuestionInCategory] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const questionCategories: QuestionCategory[] = [
    { name: 'Personas e Utilizadores', completed: false, questions: 3, answered: 0 },
    { name: 'Fluxos e Jornadas', completed: false, questions: 4, answered: 0 },
    { name: 'Funcionalidades Detalhadas', completed: false, questions: 5, answered: 0 },
    { name: 'Integrações e APIs', completed: false, questions: 3, answered: 0 },
    { name: 'Casos de Erro e Exceções', completed: false, questions: 4, answered: 0 },
    { name: 'Testes e Qualidade', completed: false, questions: 3, answered: 0 },
  ];

  const detailedQuestions = [
    // Personas (3 questions)
    [
      '📋 **CATEGORIA 1: PERSONAS E UTILIZADORES**\n\nVamos começar pelos utilizadores. Descreva as principais personas que vão interagir com o sistema. Para cada persona, inclua:\n- Papel/função\n- Objetivos principais\n- Pain points\n- Nível de conhecimento técnico',
      '👤 Excelente! Agora, para cada persona, quais são as **permissões e níveis de acesso** diferentes que cada uma deve ter? Pense em:\n- O que cada persona pode ver\n- O que cada persona pode fazer\n- Restrições específicas por função',
      '🎯 Perfeito! Por último nesta categoria: Quais são as **ações mais frequentes** que cada persona vai executar no sistema? Liste por ordem de prioridade/frequência.'
    ],
    // Fluxos (4 questions)
    [
      '🔄 **CATEGORIA 2: FLUXOS E JORNADAS**\n\nVamos detalhar os fluxos principais. Descreva o **fluxo de onboarding**: Como é que um novo utilizador se regista e começa a usar o sistema? Passo a passo.',
      '📊 Agora o **fluxo principal de utilização**: Depois de autenticado, qual é o caminho típico que o utilizador percorre para atingir o objetivo principal do sistema?',
      '💳 Vamos falar de **transações críticas**: Quais são os fluxos que envolvem dinheiro, dados sensíveis ou ações irreversíveis? Descreva cada um em detalhe.',
      '🔔 Por fim: Que **notificações e alertas** devem ser enviados aos utilizadores? Em que momentos? Por que canais (email, SMS, push, in-app)?'
    ],
    // Funcionalidades (5 questions)
    [
      '⚙️ **CATEGORIA 3: FUNCIONALIDADES DETALHADAS**\n\nVamos detalhar cada funcionalidade principal. Comecemos pela **pesquisa e filtragem**: Como os utilizadores vão encontrar informação? Que filtros são necessários?',
      '📝 **Formulários e inputs**: Que dados os utilizadores precisam de inserir? Quais são obrigatórios? Que validações são necessárias?',
      '📱 **Visualizações e dashboards**: Que informação precisa de ser apresentada? Em que formato (tabelas, gráficos, cards)? Com que frequência atualiza?',
      '⚡ **Ações em massa**: Existem operações que precisam de ser feitas em múltiplos items ao mesmo tempo? (ex: aprovar várias transações, exportar dados, etc)',
      '🔐 **Configurações e preferências**: O que é que os utilizadores podem personalizar? Configurações de conta, notificações, aparência?'
    ],
    // Integrações (3 questions)
    [
      '🔌 **CATEGORIA 4: INTEGRAÇÕES E APIs**\n\nVamos detalhar as integrações externas. Quais **sistemas externos** precisam de comunicar com esta plataforma? Para cada um, descreva:\n- Que dados são trocados\n- Direção do fluxo (envio/recepção)\n- Frequência',
      '📡 **APIs de terceiros**: Que serviços externos vão ser consumidos? (pagamentos, email, SMS, analytics, etc). Que dados vêm desses serviços?',
      '🔄 **Sincronização**: Alguma informação precisa de estar sincronizada em tempo real com outros sistemas? Que acontece se a sincronização falhar?'
    ],
    // Erros (4 questions)
    [
      '⚠️ **CATEGORIA 5: CASOS DE ERRO E EXCEÇÕES**\n\nVamos pensar no que pode correr mal. Quais são os **cenários de erro mais prováveis** em cada fluxo principal? Como devem ser tratados?',
      '🔒 **Segurança e fraude**: Que comportamentos suspeitos devem ser detetados? Que ações tomar quando detetados? (bloquear, alertar, requerer verificação adicional)',
      '📉 **Degradação graceful**: Se um serviço externo falhar, o sistema deve continuar a funcionar parcialmente? Como?',
      '♿ **Limites e restrições**: Que limites existem? (rate limiting, tamanho de ficheiros, número de items, etc). Como informar o utilizador quando atingir limites?'
    ],
    // Testes (3 questions)
    [
      '🧪 **CATEGORIA 6: TESTES E QUALIDADE**\n\nÚltima categoria! Quais são os **cenários de teste críticos** que absolutamente não podem falhar? (ex: processar pagamento, autenticação, proteção de dados)',
      '📊 **Testes de performance**: Que métricas de performance são importantes? Tempo de resposta, capacidade de utilizadores simultâneos, volume de dados?',
      '✅ **Critérios de aceitação**: Para considerar o projeto completo e pronto para produção, quais são os critérios obrigatórios? O que é dealbreaker?'
    ]
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Progress through questions
    setTimeout(() => {
      const nextQuestionIndex = currentQuestionInCategory + 1;
      
      if (nextQuestionIndex < detailedQuestions[currentCategory].length) {
        // More questions in current category
        setCurrentQuestionInCategory(nextQuestionIndex);
        const aiMessage: Message = {
          id: messages.length + 2,
          type: 'ai',
          content: detailedQuestions[currentCategory][nextQuestionIndex],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else if (currentCategory < detailedQuestions.length - 1) {
        // Move to next category
        setCurrentCategory(currentCategory + 1);
        setCurrentQuestionInCategory(0);
        const aiMessage: Message = {
          id: messages.length + 2,
          type: 'ai',
          content: detailedQuestions[currentCategory + 1][0],
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        // Finished all questions
        const finalMessage: Message = {
          id: messages.length + 2,
          type: 'ai',
          content: '🎉 **ANÁLISE COMPLETA!**\n\nExcelente! Recolhi todas as informações necessárias. Vou agora processar tudo e gerar:\n\n✅ **Epics** - Organizados por áreas funcionais\n✅ **Features** - Detalhadas com acceptance criteria\n✅ **User Stories** - No formato "Como [persona], quero [ação], para [benefício]"\n✅ **Tasks técnicas** - Com estimativas de tempo\n✅ **Test Cases** - Funcionais, segurança, performance e integração\n\nTodo o conteúdo estará completo, estruturado e pronto para exportar para Jira ou Azure DevOps!\n\nClique em "Gerar Estrutura Completa" para continuar.',
          timestamp: new Date(),
          category: 'complete'
        };
        setMessages(prev => [...prev, finalMessage]);
      }
      setIsTyping(false);
    }, 1500);
  };

  const totalQuestions = questionCategories.reduce((acc, cat) => acc + cat.questions, 0);
  const answeredQuestions = Math.min(
    messages.filter(m => m.type === 'user').length,
    totalQuestions
  );
  const progress = (answeredQuestions / totalQuestions) * 100;

  return (
    <div className="h-screen flex">
      {/* Sidebar - Progress */}
      <div className="w-80 bg-white border-r border-slate-200 p-6 overflow-y-auto">
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Progresso da Análise</h3>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">
              {answeredQuestions} de {totalQuestions} perguntas
            </span>
            <span className="text-sm font-medium text-blue-600">
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {questionCategories.map((category, index) => {
            const isActive = index === currentCategory;
            const isCompleted = index < currentCategory;
            
            return (
              <div
                key={category.name}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isActive
                    ? 'border-blue-500 bg-blue-50'
                    : isCompleted
                    ? 'border-green-500 bg-green-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isActive
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium mb-1 ${
                      isActive ? 'text-blue-900' : isCompleted ? 'text-green-900' : 'text-slate-600'
                    }`}>
                      {category.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            isCompleted ? 'bg-green-500' : 'bg-blue-600'
                          }`}
                          style={{ 
                            width: isCompleted 
                              ? '100%' 
                              : isActive 
                              ? `${(currentQuestionInCategory / category.questions) * 100}%`
                              : '0%'
                          }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {isCompleted ? category.questions : isActive ? currentQuestionInCategory : 0}/{category.questions}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5" />
            <p className="font-medium">IA Processando</p>
          </div>
          <p className="text-sm text-blue-100">
            Quanto mais detalhadas as respostas, melhor será a estrutura gerada!
          </p>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <div className="p-6 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl mb-1 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                  <MessageCircle className="w-6 h-6 text-blue-600" />
                  Questionário Detalhado com IA
                </h1>
                <p className="text-slate-600">
                  {projectData?.projectName}
                </p>
              </div>
              
              <Button
                onClick={() => onNavigate('structure')}
                disabled={progress < 100}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Gerar Estrutura Completa
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'ai'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
                    : 'bg-gradient-to-br from-slate-600 to-slate-700'
                }`}>
                  {message.type === 'ai' ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-white" />
                  )}
                </div>

                <Card className={`p-4 max-w-2xl ${
                  message.type === 'ai'
                    ? 'bg-white/80 backdrop-blur-sm border-slate-200/50'
                    : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0'
                }`}>
                  <div className="leading-relaxed whitespace-pre-line">
                    {message.content}
                  </div>
                  <span className={`text-xs mt-2 block ${
                    message.type === 'ai' ? 'text-slate-500' : 'text-blue-100'
                  }`}>
                    {message.timestamp.toLocaleTimeString('pt-PT', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </Card>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <Card className="p-4 bg-white/80 backdrop-blur-sm border-slate-200/50">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </Card>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-6 bg-white/80 backdrop-blur-lg border-t border-slate-200/50">
          <div className="max-w-4xl mx-auto">
            <div className="flex gap-3 mb-3">
              <textarea
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Digite sua resposta detalhada... (Shift+Enter para nova linha)"
                className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none min-h-[80px]"
                disabled={isTyping}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 self-end"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setInputMessage('Sim, pode continuar')}
                className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Continuar
              </button>
              <button
                onClick={() => setInputMessage('Não tenho essa informação no momento, pode sugerir algo baseado nas best practices?')}
                className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Não sei, sugerir
              </button>
              <button
                onClick={() => setInputMessage('Preciso de exemplos para responder melhor')}
                className="px-3 py-1.5 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Dar exemplos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
