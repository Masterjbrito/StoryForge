import type { Persona, BusinessRule, AcceptanceCriteriaSet, LibraryTestCase } from '@/types/domain';

export const initialPersonas: Persona[] = [
  {
    id: 1,
    name: 'Cliente Particular Digital',
    description: 'Cliente bancario entre 25-45 anos, alta literacia digital, utiliza principalmente canais digitais (app mobile, homebanking)',
    goals: [
      'Acesso rapido e seguro a conta bancaria',
      'Realizar transferencias sem deslocacao ao balcao',
      'Monitorizar despesas e investimentos em tempo real'
    ],
    painPoints: [
      'Processos de autenticacao longos e complexos',
      'Falta de transparencia em comissoes',
      'Dificuldade em contactar suporte quando necessario'
    ],
    technicalProfile: 'Smartphone iOS/Android, Confortavel com biometria',
    usageFrequency: 'Diaria',
    tags: ['Mobile', 'Digital-First', 'Retail'],
    usedIn: 12
  },
  {
    id: 2,
    name: 'Cliente Empresarial PME',
    description: 'Gestor financeiro ou CEO de PME, responsavel por tesouraria e pagamentos a fornecedores, necessita de controlo multi-utilizador',
    goals: [
      'Gestao centralizada de multiplas contas empresariais',
      'Aprovacao de pagamentos com multi-assinatura',
      'Exportacao de movimentos para software de contabilidade'
    ],
    painPoints: [
      'Falta de workflows de aprovacao customizaveis',
      'Dificuldade em gerir permissoes de utilizadores',
      'Ausencia de APIs para integracao com ERP'
    ],
    technicalProfile: 'Desktop/Web, Integracoes via API',
    usageFrequency: 'Diaria',
    tags: ['Corporate', 'Multi-user', 'Treasury'],
    usedIn: 8
  },
  {
    id: 3,
    name: 'Backoffice Operator',
    description: 'Colaborador interno do banco responsavel por processar operacoes, resolver reclamacoes e executar tarefas de compliance',
    goals: [
      'Processar operacoes de forma eficiente',
      'Acesso a historico completo de transacoes',
      'Gerar reports regulamentares'
    ],
    painPoints: [
      'Sistemas legacy com UI desatualizada',
      'Falta de automacao em tarefas repetitivas',
      'Informacao dispersa em multiplos sistemas'
    ],
    technicalProfile: 'Desktop, Formacao interna',
    usageFrequency: 'Continua (8h/dia)',
    tags: ['Internal', 'Operations', 'Compliance'],
    usedIn: 5
  },
  {
    id: 4,
    name: 'Cliente Senior',
    description: 'Cliente bancario acima dos 65 anos, baixa/media literacia digital, prefere simplicidade e suporte humano',
    goals: [
      'Consultar saldos de forma simples',
      'Pagar servicos essenciais (agua, luz)',
      'Contactar banco facilmente em caso de duvida'
    ],
    painPoints: [
      'Interfaces complexas com muitas opcoes',
      'Medo de errar em operacoes financeiras',
      'Textos pequenos e contraste insuficiente'
    ],
    technicalProfile: 'Smartphone basico, Preferencia por ATM',
    usageFrequency: 'Semanal',
    tags: ['Accessibility', 'Senior', 'Support'],
    usedIn: 3
  },
  {
    id: 5,
    name: 'Cliente Premium Private Banking',
    description: 'Cliente high-net-worth com patrimonio > \u20AC1M, espera atendimento personalizado e produtos exclusivos',
    goals: [
      'Acesso a produtos de investimento exclusivos',
      'Gestor de conta dedicado disponivel 24/7',
      'Relatorios fiscais e patrimoniais customizados'
    ],
    painPoints: [
      'Falta de personalizacao nos dashboards',
      'Dificuldade em consolidar investimentos globais',
      'Produtos standard nao atendem necessidades especificas'
    ],
    technicalProfile: 'Multi-dispositivo, Espera concierge digital',
    usageFrequency: 'Diaria',
    tags: ['Premium', 'Wealth', 'Investments'],
    usedIn: 6
  },
  {
    id: 6,
    name: 'Developer Third-Party Provider',
    description: 'Desenvolvedor de FinTech TPP que consome APIs Open Banking PSD2',
    goals: [
      'Integracao simples e bem documentada',
      'Sandbox para testes sem risco',
      'Monitorizacao de rate limits e quotas'
    ],
    painPoints: [
      'Documentacao de APIs desatualizada',
      'Processos de onboarding demorados',
      'Ausencia de webhooks para eventos'
    ],
    technicalProfile: 'REST/GraphQL, OAuth2, Postman',
    usageFrequency: 'Diaria (desenvolvimento)',
    tags: ['Developer', 'API', 'OpenBanking'],
    usedIn: 4
  },
  {
    id: 7,
    name: 'Compliance Officer',
    description: 'Responsavel por garantir conformidade regulamentar, auditorias e reports para Banco de Portugal',
    goals: [
      'Acesso a logs imutaveis de todas as transacoes',
      'Geracao automatica de reports regulamentares',
      'Alertas em tempo real de atividades suspeitas'
    ],
    painPoints: [
      'Dados espalhados em multiplos sistemas',
      'Dificuldade em provar compliance em auditorias',
      'Reports manuais consumem muito tempo'
    ],
    technicalProfile: 'Desktop, Excel, BI Tools',
    usageFrequency: 'Diaria',
    tags: ['Compliance', 'Audit', 'Regulatory'],
    usedIn: 7
  },
  {
    id: 8,
    name: 'Cliente Jovem Universitario',
    description: 'Estudante universitario 18-24 anos, primeira conta bancaria, prefere app mobile e cashback',
    goals: [
      'Conta sem comissoes de manutencao',
      'Notificacoes de gastos em tempo real',
      'Cashback e descontos em marcas jovens'
    ],
    painPoints: [
      'Comissoes elevadas para saldo baixo',
      'Apps bancarias tradicionais pouco intuitivas',
      'Falta de educacao financeira integrada'
    ],
    technicalProfile: 'Smartphone iOS/Android, Redes sociais',
    usageFrequency: 'Diaria',
    tags: ['Youth', 'Student', 'Mobile'],
    usedIn: 5
  },
  {
    id: 9,
    name: 'Tesoureiro Corporate',
    description: 'CFO de grande empresa, gere milhoes de euros diariamente, necessita de cash management avancado',
    goals: [
      'Visao consolidada de todas as contas e subsidiarias',
      'Previsao de cash flow automatica',
      'Integracao com Swift para pagamentos internacionais'
    ],
    painPoints: [
      'Impossivel consolidar dados de multiplos bancos',
      'Falta de previsao de liquidez',
      'Processos manuais para reconciliacao'
    ],
    technicalProfile: 'Desktop, SAP/ERP, Excel avancado',
    usageFrequency: 'Continua',
    tags: ['Treasury', 'Corporate', 'Enterprise'],
    usedIn: 3
  },
  {
    id: 10,
    name: 'Branch Manager',
    description: 'Gerente de balcao responsavel por atendimento presencial e vendas de produtos',
    goals: [
      'Acesso rapido a dados do cliente durante atendimento',
      'Aprovar operacoes excepcionais',
      'Dashboard de performance da agencia'
    ],
    painPoints: [
      'Sistemas lentos durante atendimento',
      'Impossivel ver historico completo do cliente',
      'Falta de sugestoes de cross-sell'
    ],
    technicalProfile: 'Desktop, Tablet, CRM',
    usageFrequency: 'Continua',
    tags: ['Branch', 'Sales', 'Internal'],
    usedIn: 4
  }
] as const satisfies Persona[];

export const initialBusinessRules: BusinessRule[] = [
  {
    id: 1,
    category: 'Transferencias',
    name: 'Limite diario de transferencias MB Way',
    rule: 'Transferencias via MB Way limitadas a \u20AC1000/dia para particulares e \u20AC5000/dia para empresas',
    validation: 'SUM(transferencias_dia) <= limite_perfil',
    exceptions: 'Limites podem ser aumentados mediante pedido e aprovacao de compliance',
    compliance: ['PSD2', 'AML'],
    usedIn: 8
  },
  {
    id: 2,
    category: 'Autenticacao',
    name: 'SCA Obrigatoria PSD2',
    rule: 'Strong Customer Authentication obrigatoria para transacoes > \u20AC30 ou operacoes sensiveis',
    validation: 'IF valor > 30 EUR OR operacao_sensivel THEN require_sca()',
    exceptions: 'Isencoes: Pagamentos recorrentes trusted, Low-value < 30\u20AC (max 5 consecutivas)',
    compliance: ['PSD2', 'SCA'],
    usedIn: 15
  },
  {
    id: 3,
    category: 'Cartoes',
    name: 'Bloqueio apos tentativas falhadas',
    rule: 'Cartao bloqueado automaticamente apos 3 tentativas de PIN incorretas',
    validation: 'IF tentativas_pin_falhadas >= 3 THEN bloquear_cartao()',
    exceptions: 'Desbloqueio em balcao com identificacao ou via app com biometria',
    compliance: ['Security', 'Fraud Prevention'],
    usedIn: 6
  },
  {
    id: 4,
    category: 'Onboarding',
    name: 'KYC Digital - Verificacao de Identidade',
    rule: 'Abertura de conta digital requer validacao de CC/Passaporte + Liveness detection + Prova de morada',
    validation: 'documento_valido AND face_match > 95% AND morada_confirmada',
    exceptions: 'Documentos expirados ha menos de 6 meses aceites temporariamente',
    compliance: ['KYC', 'AML', 'eIDAS'],
    usedIn: 4
  },
  {
    id: 5,
    category: 'Transferencias',
    name: 'Validacao IBAN SEPA',
    rule: 'IBAN deve ser validado com algoritmo modulo 97 antes de processamento',
    validation: 'validar_iban_mod97(iban) AND iban.length IN (21,25) AND iban[0:2] IN paises_sepa',
    exceptions: 'IBANs de paises fora SEPA requerem SWIFT/BIC obrigatorio',
    compliance: ['SEPA', 'ISO 13616'],
    usedIn: 11
  },
  {
    id: 6,
    category: 'Compliance',
    name: 'Retencao de Logs Transacionais',
    rule: 'Todos os logs de transacoes devem ser mantidos por 10 anos em formato imutavel',
    validation: 'log_retention_period >= 3650 days AND log_immutable = true',
    exceptions: 'Logs anonimizados para analytics podem ter retencao de 5 anos',
    compliance: ['Banco de Portugal', 'GDPR', 'Audit'],
    usedIn: 9
  },
  {
    id: 7,
    category: 'Pagamentos',
    name: 'Timeout de Sessao Pagamento',
    rule: 'Sessao de pagamento expira apos 5 minutos de inatividade por seguranca',
    validation: 'IF last_activity > 300 seconds THEN invalidar_sessao()',
    exceptions: 'Operacoes em curso tem timeout estendido para 10 minutos',
    compliance: ['PSD2', 'Security'],
    usedIn: 7
  },
  {
    id: 8,
    category: 'Credito',
    name: 'Credit Scoring Minimo',
    rule: 'Aprovacao automatica de credito requer score >= 650 e debt-to-income < 40%',
    validation: 'credit_score >= 650 AND (dividas_mensais / rendimento) < 0.40',
    exceptions: 'Clientes Premium podem ter score >= 600 com analise manual',
    compliance: ['Banco de Portugal', 'Responsible Lending'],
    usedIn: 3
  },
  {
    id: 9,
    category: 'AML',
    name: 'Monitorizacao de Transacoes Suspeitas',
    rule: 'Transacoes >= \u20AC10.000 ou padroes anomalos devem ser sinalizadas para analise AML',
    validation: 'IF valor >= 10000 OR anomalia_detectada THEN criar_alerta_aml()',
    exceptions: 'Transferencias empresariais recorrentes whitelist apos aprovacao',
    compliance: ['AML', 'FATF', 'Banco de Portugal'],
    usedIn: 10
  },
  {
    id: 10,
    category: 'Privacidade',
    name: 'Consentimento GDPR Explicito',
    rule: 'Processamento de dados sensiveis requer consentimento explicito e granular do cliente',
    validation: 'consentimento_explicito = true AND data_consentimento NOT NULL',
    exceptions: 'Processamento para compliance legal nao requer consentimento',
    compliance: ['GDPR', 'Privacy'],
    usedIn: 12
  },
  {
    id: 11,
    category: 'Investimentos',
    name: 'MiFID II - Adequacao de Produto',
    rule: 'Produtos de investimento so podem ser comercializados apos teste de adequacao do cliente',
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
    exceptions: 'TPPs certificados Tier-1 tem limite de 200 req/min',
    compliance: ['PSD2', 'API Security'],
    usedIn: 6
  }
] as const satisfies BusinessRule[];

export const initialAcceptanceCriteria: AcceptanceCriteriaSet[] = [
  {
    id: 1,
    category: 'Autenticacao',
    feature: 'Login Biometrico',
    criteria: [
      'Sistema reconhece Face ID ou Touch ID do dispositivo',
      'Fallback para PIN em caso de falha biometrica',
      'Maximo 3 tentativas falhadas antes de bloqueio',
      'Tempo de autenticacao < 2 segundos (P95)',
      'Biometria nao armazenada em servidor (local device only)',
      'Log de auditoria criado para cada tentativa'
    ],
    usedIn: 10
  },
  {
    id: 2,
    category: 'Transferencias',
    feature: 'Transferencia SEPA',
    criteria: [
      'Campo IBAN validado com algoritmo modulo 97',
      'BIC preenchido automaticamente se IBAN PT',
      'Limite diario validado antes de submeter',
      'Descricao limitada a 140 caracteres',
      'Confirmacao exibida antes de executar',
      'Notificacao push enviada apos conclusao'
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
      'SCA obrigatoria se valor > \u20AC30',
      'Recibo digital gerado automaticamente',
      'Pagamento reversivel em 15 minutos',
      'Merchant validado contra lista SIBS'
    ],
    usedIn: 9
  }
] as const satisfies AcceptanceCriteriaSet[];

export const initialTestCases: LibraryTestCase[] = [
  {
    id: 1,
    category: 'Security',
    name: 'Validar protecao anti-spoofing biometrico',
    priority: 'Critical',
    type: 'Security',
    steps: [
      'Preparar foto impressa do utilizador',
      'Tentar autenticacao com foto',
      'Preparar video gravado do utilizador',
      'Tentar autenticacao com video',
      'Validar que ambos sao rejeitados'
    ],
    expectedResult: 'Sistema rejeita foto e video, exige liveness real, cria log de tentativa de spoofing',
    usedIn: 8
  },
  {
    id: 2,
    category: 'Compliance',
    name: 'Validar conformidade PSD2 em transacao',
    priority: 'High',
    type: 'Compliance',
    steps: [
      'Iniciar transferencia de \u20AC50',
      'Validar que SCA e solicitada',
      'Completar SCA com 2 fatores',
      'Verificar log de auditoria',
      'Validar retencao de logs (10 anos)'
    ],
    expectedResult: 'SCA executada, logs completos armazenados com encriptacao AES-256, retencao configurada',
    usedIn: 12
  },
  {
    id: 3,
    category: 'Performance',
    name: 'Teste de carga - 1000 utilizadores simultaneos',
    priority: 'Medium',
    type: 'Performance',
    steps: [
      'Configurar JMeter com 1000 threads',
      'Simular login simultaneo',
      'Executar transferencias concorrentes',
      'Medir tempos de resposta (P95, P99)',
      'Validar ausencia de deadlocks'
    ],
    expectedResult: 'P95 < 2s, P99 < 3s, 0 erros, CPU < 70%, memoria estavel',
    usedIn: 5
  }
] as const satisfies LibraryTestCase[];
