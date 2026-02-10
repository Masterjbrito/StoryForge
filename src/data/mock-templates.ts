import type { Template } from '@/types/domain';

export const initialTemplates: Template[] = [
  {
    id: 1,
    name: 'Mobile Banking Particulares PT',
    category: 'Mobile Banking',
    description: 'Template completo para apps de mobile banking para clientes particulares, incluindo autenticacao PSD2, transferencias, pagamentos e gestao de contas.',
    author: 'StoryForge Team',
    version: 'v2.1.0',
    lastUpdated: new Date('2026-01-05'),
    usage: 24,
    rating: 4.9,
    featured: true,
    stats: {
      epics: 8,
      features: 22,
      userStories: 87,
      tasks: 245,
      testCases: 156
    },
    compliance: ['PSD2', 'GDPR', 'SCA', 'Banco de Portugal'],
    tags: ['iOS', 'Android', 'Biometria', 'Transferencias', 'Cartoes']
  },
  {
    id: 2,
    name: 'MB Way - Sistema Completo',
    category: 'Pagamentos',
    description: 'Implementacao end-to-end de sistema MB Way com transferencias P2P, pagamentos comerciantes, levantamentos ATM e integracao SIBS.',
    author: 'Banco de Portugal',
    version: 'v1.8.3',
    lastUpdated: new Date('2025-12-20'),
    usage: 18,
    rating: 5.0,
    featured: true,
    stats: {
      epics: 5,
      features: 12,
      userStories: 45,
      tasks: 156,
      testCases: 89
    },
    compliance: ['PSD2', 'SIBS', 'SCA', 'EMV'],
    tags: ['MB Way', 'SIBS', 'Pagamentos', 'QR Code']
  },
  {
    id: 3,
    name: 'Homebanking Web Empresas',
    category: 'Web Banking',
    description: 'Portal completo para gestao bancaria empresarial com multi-utilizador, aprovacoes workflow, tesouraria e integracao ERP.',
    author: 'CGD Digital',
    version: 'v3.2.1',
    lastUpdated: new Date('2025-12-15'),
    usage: 15,
    rating: 4.7,
    featured: false,
    stats: {
      epics: 10,
      features: 28,
      userStories: 102,
      tasks: 318,
      testCases: 187
    },
    compliance: ['PSD2', 'GDPR', 'AML', 'Audit Trail'],
    tags: ['B2B', 'Multi-user', 'Workflow', 'Tesouraria']
  },
  {
    id: 4,
    name: 'API Open Banking PSD2',
    category: 'APIs / Open Banking',
    description: 'APIs REST conformes com PSD2 para Account Information (AIS) e Payment Initiation (PIS) com OAuth2 e certificados qualificados.',
    author: 'StoryForge Team',
    version: 'v2.0.5',
    lastUpdated: new Date('2025-11-30'),
    usage: 31,
    rating: 4.8,
    featured: true,
    stats: {
      epics: 4,
      features: 11,
      userStories: 38,
      tasks: 142,
      testCases: 95
    },
    compliance: ['PSD2', 'OAuth2', 'GDPR', 'Berlin Group'],
    tags: ['REST API', 'OAuth2', 'AIS', 'PIS', 'TPP']
  },
  {
    id: 5,
    name: 'Onboarding Digital Completo',
    category: 'Onboarding',
    description: 'Processo completo de abertura de conta digital com KYC automatizado, validacao biometrica, assinatura digital e video-identificacao.',
    author: 'Ageas Portugal',
    version: 'v1.5.0',
    lastUpdated: new Date('2025-11-10'),
    usage: 12,
    rating: 4.6,
    featured: false,
    stats: {
      epics: 6,
      features: 15,
      userStories: 52,
      tasks: 187,
      testCases: 98
    },
    compliance: ['KYC', 'AML', 'GDPR', 'eIDAS'],
    tags: ['KYC', 'Biometria', 'Video-ID', 'eSignature']
  },
  {
    id: 6,
    name: 'Cartoes - Gestao e Operacoes',
    category: 'Cartoes',
    description: 'Gestao completa de cartoes de debito e credito: emissao, ativacao, bloqueio, limites, tokenizacao e Apple/Google Pay.',
    author: 'SIBS',
    version: 'v2.3.0',
    lastUpdated: new Date('2025-10-25'),
    usage: 20,
    rating: 4.9,
    featured: false,
    stats: {
      epics: 7,
      features: 18,
      userStories: 64,
      tasks: 201,
      testCases: 132
    },
    compliance: ['PCI-DSS', 'EMV', 'PSD2', '3D Secure'],
    tags: ['Cartoes', 'Tokenizacao', 'Apple Pay', 'Google Pay']
  },
  {
    id: 7,
    name: 'Backoffice Operacoes Bancarias',
    category: 'Backoffice',
    description: 'Aplicacao backoffice para operadores bancarios com gestao de clientes, transacoes, KYC, compliance e reporting.',
    author: 'Novo Banco',
    version: 'v4.1.2',
    lastUpdated: new Date('2025-10-15'),
    usage: 9,
    rating: 4.5,
    featured: false,
    stats: {
      epics: 9,
      features: 24,
      userStories: 89,
      tasks: 267,
      testCases: 145
    },
    compliance: ['AML', 'GDPR', 'Audit Trail', 'SOC2'],
    tags: ['Backoffice', 'Admin', 'Compliance', 'Reporting']
  },
  {
    id: 8,
    name: 'Multibanco ATM - Terminal',
    category: 'Core Banking',
    description: 'Interface e logica para terminais Multibanco ATM com levantamentos, depositos, consultas e pagamentos de servicos.',
    author: 'SIBS',
    version: 'v1.9.1',
    lastUpdated: new Date('2025-09-30'),
    usage: 6,
    rating: 5.0,
    featured: false,
    stats: {
      epics: 5,
      features: 13,
      userStories: 41,
      tasks: 156,
      testCases: 87
    },
    compliance: ['EMV', 'SIBS', 'PCI-DSS', 'ISO 8583'],
    tags: ['ATM', 'Terminal', 'Hardware', 'Cash']
  },
] as const satisfies Template[];
