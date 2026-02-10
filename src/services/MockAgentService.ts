// ============================================================
// StoryForge - Mock Agent Service
// Smart mocks with realistic delays and data generation
// Implements IAgentService - swap to FoundryAgentService later
// ============================================================

import type {
  IAgentService,
  AgentResponse,
  ContextAnalysis,
  GeneratedRequirements,
  QualityReport,
  ExportResult,
  VersionDiffResult,
  AuditLoggingResult,
} from '@/types/agents';
import type {
  NewProjectFormData,
  Epic,
  ConversationMessage,
  Persona,
  BusinessRule,
} from '@/types/domain';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export class MockAgentService implements IAgentService {
  // --- Context Ingestor Agent ---
  async analyzeContext(
    formData: NewProjectFormData
  ): Promise<AgentResponse<ContextAnalysis>> {
    await delay(randomBetween(1500, 3000));

    const suggestedCompliance: string[] = ['GDPR'];
    if (formData.type?.toLowerCase().includes('banking') || formData.type?.toLowerCase().includes('pagamento')) {
      suggestedCompliance.push('PSD2', 'SCA', 'Banco de Portugal');
    }
    if (formData.description?.toLowerCase().includes('aml') || formData.description?.toLowerCase().includes('branqueamento')) {
      suggestedCompliance.push('AML', 'KYC');
    }
    if (formData.type?.toLowerCase().includes('api') || formData.type?.toLowerCase().includes('open')) {
      suggestedCompliance.push('PSD2', 'OAuth2');
    }

    const suggestedPersonas: Persona[] = [
      {
        id: 1,
        name: 'Cliente Particular Digital',
        description: 'Cliente bancário entre 25-45 anos, alta literacia digital',
        goals: ['Acesso rápido e seguro à conta bancária'],
        painPoints: ['Processos de autenticação longos e complexos'],
        technicalProfile: 'Smartphone iOS/Android',
        usageFrequency: 'Diária',
        tags: ['Mobile', 'Digital-First', 'Retail'],
        usedIn: 12,
      },
    ];

    const suggestedBusinessRules: BusinessRule[] = [
      {
        id: 1,
        category: 'Autenticação',
        name: 'SCA Obrigatória PSD2',
        rule: 'Strong Customer Authentication obrigatória para transações > €30',
        validation: 'IF valor > 30 EUR THEN require_sca()',
        exceptions: 'Isenções para pagamentos recorrentes trusted',
        compliance: ['PSD2', 'SCA'],
        usedIn: 15,
      },
    ];

    return {
      success: true,
      agentType: 'context-ingestor',
      processingTime: randomBetween(1500, 3000),
      confidence: 0.92,
      data: {
        summary: `Análise do projeto "${formData.name || 'Novo Projeto'}": domínio bancário identificado com foco em ${formData.type || 'serviços financeiros'}. Compliance regulamentar relevante detectada.`,
        detectedDomain: formData.type || 'Banking',
        suggestedCompliance,
        suggestedPersonas,
        suggestedBusinessRules,
        riskLevel: suggestedCompliance.length > 3 ? 'high' : 'medium',
      },
    };
  }

  // --- Questionnaire/Discovery Agent ---
  async generateNextQuestion(
    category: string,
    previousMessages: ConversationMessage[],
    _formData: NewProjectFormData
  ): Promise<AgentResponse<ConversationMessage>> {
    await delay(randomBetween(800, 2000));

    const questionBanks: Record<string, string[]> = {
      'Contexto do Negócio': [
        'Qual é o objetivo principal deste projeto e que problema de negócio pretende resolver?',
        'Quem são os principais stakeholders e decisores deste projeto?',
        'Existem KPIs de negócio específicos que devem ser atingidos? Quais são as métricas de sucesso?',
        'Este projeto substitui algum sistema existente ou é uma implementação nova?',
      ],
      'Utilizadores & Personas': [
        'Quais são os principais perfis de utilizadores que irão usar este sistema?',
        'Qual é o volume esperado de utilizadores simultâneos?',
        'Existem requisitos de acessibilidade específicos (ex: WCAG 2.1)?',
        'Os utilizadores acedem via mobile, desktop ou ambos?',
      ],
      'Funcionalidades Core': [
        'Quais são as funcionalidades essenciais (MVP) que devem estar na primeira versão?',
        'Existem fluxos de aprovação ou workflows complexos? Descreva-os.',
        'O sistema necessita de funcionalidades offline?',
        'Que tipo de notificações devem ser suportadas (push, email, SMS)?',
      ],
      'Segurança & Compliance': [
        'Que normas de compliance são obrigatórias para este projeto (PSD2, GDPR, AML)?',
        'Qual é a classificação de dados que o sistema irá tratar (público, interno, confidencial, secreto)?',
        'São necessários logs de auditoria? Qual o período de retenção obrigatório?',
        'O sistema necessita de encriptação end-to-end? Em que camadas?',
      ],
      'Integrações & Sistemas': [
        'Com que sistemas core do banco é necessário integrar (core banking, CRM, anti-fraude)?',
        'Existem APIs externas obrigatórias (SIBS, Banco de Portugal, BCE)?',
        'Qual é o formato preferido para integração (REST, SOAP, mensageria)?',
        'Existem requisitos de latência máxima para as integrações?',
      ],
      'Requisitos Técnicos': [
        'Qual é a stack tecnológica preferida ou obrigatória?',
        'Existem requisitos de performance específicos (tempo de resposta, throughput)?',
        'O deployment será on-premise, cloud ou híbrido?',
        'São necessários ambientes de staging, UAT e produção separados?',
      ],
    };

    const questions = questionBanks[category] || questionBanks['Contexto do Negócio'];
    const questionIndex = Math.min(
      previousMessages.filter((m) => m.role === 'assistant').length,
      questions.length - 1
    );

    return {
      success: true,
      agentType: 'questionnaire-discovery',
      processingTime: randomBetween(800, 2000),
      data: {
        id: Date.now(),
        role: 'assistant',
        content: questions[questionIndex],
        timestamp: new Date(),
        category,
      },
    };
  }

  // --- Requirements Generator Agent ---
  async generateRequirements(
    formData: NewProjectFormData,
    _conversationHistory: ConversationMessage[],
    _contextAnalysis: ContextAnalysis
  ): Promise<AgentResponse<GeneratedRequirements>> {
    await delay(randomBetween(3000, 6000));

    const projectName = formData.name || 'Novo Projeto';
    const epics: Epic[] = [
      {
        id: 'EP-001',
        type: 'epic',
        title: 'Autenticação e Segurança',
        description: `Sistema de autenticação segura para ${projectName}`,
        businessValue: 'Garantir conformidade PSD2 e proteger transações',
        priority: 'High',
        status: 'Rascunho',
        acceptanceCriteria: [
          'Autenticação forte (SCA) implementada',
          'Biometria suportada em iOS e Android',
          'Logs de auditoria para todas as autenticações',
        ],
        expanded: true,
        features: [
          {
            id: 'FT-001',
            type: 'feature',
            title: 'Login Biométrico',
            description: 'Autenticação via Face ID / Touch ID',
            priority: 'High',
            status: 'Rascunho',
            businessRules: ['SCA obrigatória para transações > 30€'],
            expanded: true,
            userStories: [
              {
                id: 'US-001',
                type: 'userStory',
                title: 'Login com Biometria',
                asA: 'cliente bancário',
                iWant: 'fazer login usando biometria',
                soThat: 'possa aceder à app de forma rápida e segura',
                acceptanceCriteria: [
                  'Suportar Touch ID e Face ID',
                  'Fallback para PIN de 6 dígitos',
                  'Máximo 3 tentativas antes de bloqueio',
                ],
                priority: 'High',
                storyPoints: 8,
                status: 'Rascunho',
                labels: ['Security', 'PSD2'],
                expanded: false,
                tasks: [
                  {
                    id: 'TSK-001',
                    title: 'Implementar biometria iOS',
                    description: 'Integrar LocalAuthentication Framework',
                    estimate: '8h',
                    assignee: 'Developer iOS',
                    status: 'Rascunho',
                  },
                  {
                    id: 'TSK-002',
                    title: 'Implementar biometria Android',
                    description: 'Usar BiometricPrompt API',
                    estimate: '8h',
                    assignee: 'Developer Android',
                    status: 'Rascunho',
                  },
                ],
                testCases: [
                  {
                    id: 'TC-001',
                    type: 'Functional',
                    priority: 'High',
                    title: 'Validar login biométrico',
                    preconditions: ['Utilizador com conta ativa', 'Biometria configurada'],
                    steps: [
                      'Abrir app',
                      'Apresentar biometria válida',
                      'Verificar acesso ao dashboard',
                    ],
                    expectedResult: 'Login completo em < 2s',
                  },
                ],
              },
            ],
          },
        ],
      },
      {
        id: 'EP-002',
        type: 'epic',
        title: 'Funcionalidades Core',
        description: `Funcionalidades principais de ${projectName}`,
        businessValue: 'Entregar valor core ao utilizador',
        priority: 'High',
        status: 'Rascunho',
        acceptanceCriteria: [
          'Funcionalidades MVP implementadas',
          'Testes de aceitação aprovados',
        ],
        expanded: false,
        features: [],
      },
      {
        id: 'EP-003',
        type: 'epic',
        title: 'Compliance e Auditoria',
        description: 'Sistema de logs e compliance regulamentar',
        businessValue: 'Garantir conformidade legal e facilitar auditorias',
        priority: 'High',
        status: 'Rascunho',
        acceptanceCriteria: [
          'Logs imutáveis de todas as transações',
          'Retenção de 10 anos',
          'Reports automáticos para regulador',
        ],
        expanded: false,
        features: [],
      },
    ];

    return {
      success: true,
      agentType: 'requirements-generator',
      processingTime: randomBetween(3000, 6000),
      confidence: 0.89,
      data: {
        epics,
        artifacts: epics.flatMap((epic) => [
          {
            id: epic.id,
            type: 'epic' as const,
            title: epic.title,
            confidence: 0.95,
            status: 'generated' as const,
          },
          ...epic.features.map((f) => ({
            id: f.id,
            type: 'feature' as const,
            title: f.title,
            confidence: 0.9,
            status: 'generated' as const,
          })),
          ...epic.features.flatMap((f) =>
            f.userStories.map((us) => ({
              id: us.id,
              type: 'userStory' as const,
              title: us.title,
              confidence: 0.87,
              status: 'generated' as const,
            }))
          ),
        ]),
        qualityScore: 92,
        complianceCoverage: {
          PSD2: true,
          GDPR: true,
          SCA: true,
          AML: false,
        },
      },
    };
  }

  // --- Acceptance Criteria Agent ---
  async enrichAcceptanceCriteria(
    epics: Epic[],
    _compliance: string[]
  ): Promise<AgentResponse<Epic[]>> {
    await delay(randomBetween(1000, 2000));
    return {
      success: true,
      agentType: 'acceptance-criteria',
      processingTime: randomBetween(1000, 2000),
      data: epics,
    };
  }

  // --- Test Design Agent ---
  async generateTestCases(
    epics: Epic[],
    _compliance: string[]
  ): Promise<AgentResponse<Epic[]>> {
    await delay(randomBetween(1500, 3000));
    return {
      success: true,
      agentType: 'test-design',
      processingTime: randomBetween(1500, 3000),
      data: epics,
    };
  }

  // --- Quality Gate Agent ---
  async validateQuality(
    _epics: Epic[]
  ): Promise<AgentResponse<QualityReport>> {
    await delay(randomBetween(1500, 2500));
    return {
      success: true,
      agentType: 'quality-gate',
      processingTime: randomBetween(1500, 2500),
      data: {
        overallScore: randomBetween(88, 98),
        categories: {
          completeness: randomBetween(85, 100),
          clarity: randomBetween(90, 100),
          testability: randomBetween(80, 95),
          compliance: randomBetween(90, 100),
          consistency: randomBetween(85, 98),
        },
        issues: [
          {
            severity: 'warning',
            artifact: 'EP-002',
            message: 'Epic sem Features detalhadas',
            suggestion: 'Considere decompor em Features com User Stories específicas',
          },
          {
            severity: 'info',
            artifact: 'US-001',
            message: 'Story Points elevados',
            suggestion: 'Considere dividir em stories mais pequenas (máx 8 SP)',
          },
        ],
      },
    };
  }

  // --- Export Agent ---
  async exportToplatform(
    epics: Epic[],
    platform: string,
    projectCode: string
  ): Promise<AgentResponse<ExportResult>> {
    await delay(randomBetween(2000, 5000));

    const totalItems = epics.reduce((acc, epic) => {
      let count = 1; // epic itself
      count += epic.features.length;
      epic.features.forEach((f) => {
        count += f.userStories.length;
        f.userStories.forEach((us) => {
          count += us.tasks.length;
          count += us.testCases.length;
        });
      });
      return acc + count;
    }, 0);

    return {
      success: true,
      agentType: 'export',
      processingTime: randomBetween(2000, 5000),
      data: {
        platform,
        itemsExported: totalItems,
        itemsFailed: 0,
        duration: `${randomBetween(8, 20)}s`,
        url: platform.includes('Jira')
          ? `https://company.atlassian.net/browse/${projectCode}`
          : `https://dev.azure.com/company/${projectCode}`,
        details: epics.map((epic) => ({
          type: 'epic',
          id: epic.id,
          externalId: `${projectCode}-${epic.id}`,
          status: 'created' as const,
        })),
      },
    };
  }

  // --- Versioning & Diff Agent ---
  async generateVersionDiff(
    previousEpics: Epic[],
    nextEpics: Epic[],
    previousVersion: string
  ): Promise<AgentResponse<VersionDiffResult>> {
    await delay(randomBetween(700, 1400));
    const prev = previousEpics.length;
    const next = nextEpics.length;
    const changeType: 'major' | 'minor' | 'patch' =
      next > prev ? 'minor' : next < prev ? 'major' : 'patch';

    const [maj, min, pat] = previousVersion.replace(/^v/i, '').split('.').map((x) => Number(x) || 0);
    let nextVersion = `${maj}.${min}.${pat + 1}`;
    if (changeType === 'minor') nextVersion = `${maj}.${min + 1}.0`;
    if (changeType === 'major') nextVersion = `${maj + 1}.0.0`;

    return {
      success: true,
      agentType: 'versioning-diff',
      processingTime: randomBetween(700, 1400),
      data: {
        previousVersion,
        nextVersion: `v${nextVersion}`,
        changeType,
        changelog: [
          'Updated requirements structure',
          'Recomputed compliance coverage',
          'Refreshed acceptance criteria links',
        ],
      },
    };
  }

  // --- Audit & Logging Agent ---
  async logAuditEvent(
    eventName: string,
    _payload: Record<string, unknown>
  ): Promise<AgentResponse<AuditLoggingResult>> {
    await delay(randomBetween(120, 300));
    return {
      success: true,
      agentType: 'audit-logging',
      processingTime: randomBetween(120, 300),
      data: {
        eventId: `AUD-${Date.now()}`,
        stored: true,
        timestamp: new Date().toISOString(),
      },
    };
  }
}
