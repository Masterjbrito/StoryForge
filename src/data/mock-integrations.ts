import type { Integration } from '@/types/domain';

export const initialIntegrations: Integration[] = [
  {
    name: 'Jira Cloud',
    status: 'connected',
    projects: 12,
    description: 'Atlassian Jira Cloud - Gestao de projetos e tracking de issues',
    url: 'https://millennium-bcp.atlassian.net',
    lastSync: new Date('2026-01-09T08:30:00'),
    syncFrequency: 'A cada exportacao',
    apiVersion: 'REST API v3',
    features: [
      'Criacao automatica de Epics, Stories, Tasks',
      'Sincronizacao de status e assignees',
      'Exportacao de Test Cases para Xray',
      'Labels de compliance automaticos'
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
    description: 'Microsoft Azure DevOps - Gestao de work items e pipelines',
    url: 'https://dev.azure.com/millenniumbcp',
    lastSync: new Date('2026-01-08T16:45:00'),
    syncFrequency: 'A cada exportacao',
    apiVersion: 'REST API 7.0',
    features: [
      'Criacao de Epics, Features, User Stories',
      'Integracao com Azure Boards',
      'Test Plans automaticos',
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
    description: 'Jira Data Center on-premise - Para ambientes com requisitos de compliance especificos',
    url: null,
    lastSync: null,
    syncFrequency: null,
    apiVersion: 'REST API v2/v3',
    features: [
      'Instalacao on-premise para compliance',
      'Controlo total de dados',
      'Customizacao avancada de workflows',
      'Integracao com AD/LDAP corporativo'
    ],
    credentials: null,
    stats: null
  },
] as const satisfies Integration[];
