import type { Notification, RecentActivity } from '@/types/domain';

export const initialNotifications: Notification[] = [
  {
    id: 1,
    type: 'success',
    title: 'Exportacao Concluida',
    message: 'MBWAY-2024: 45 User Stories exportadas para Jira Cloud',
    timestamp: new Date('2026-01-09T10:30:00'),
    read: false,
    project: 'MBWAY-2024'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Alerta de Compliance',
    message: 'HBEMP-2024: Faltam testes de SCA (Strong Customer Authentication)',
    timestamp: new Date('2026-01-09T09:15:00'),
    read: false,
    project: 'HBEMP-2024'
  },
  {
    id: 3,
    type: 'info',
    title: 'Atualizacao Disponivel',
    message: 'Nova versao do template PSD2 disponivel na biblioteca',
    timestamp: new Date('2026-01-08T16:45:00'),
    read: false,
    project: null
  },
  {
    id: 4,
    type: 'success',
    title: 'Qualidade Aprovada',
    message: 'MOBPART-2024: Score de qualidade atingiu 97% (target: 95%)',
    timestamp: new Date('2026-01-08T14:20:00'),
    read: true,
    project: 'MOBPART-2024'
  },
  {
    id: 5,
    type: 'warning',
    title: 'Revisao Necessaria',
    message: 'OPENAPI-2024: Artefactos pendentes de aprovacao',
    timestamp: new Date('2026-01-08T11:30:00'),
    read: true,
    project: 'OPENAPI-2024'
  },
] as const satisfies Notification[];

export const initialRecentActivity: RecentActivity[] = [
  {
    type: 'export',
    project: 'MBWAY-2024',
    user: 'Susana Gamito',
    timestamp: new Date('2026-01-08T14:30:00'),
    details: '45 User Stories exportadas'
  },
  {
    type: 'update',
    project: 'HBEMP-2024',
    user: 'Joao Santos',
    timestamp: new Date('2026-01-06T09:15:00'),
    details: 'Atualizacao de compliance tags'
  },
  {
    type: 'export',
    project: 'MOBPART-2024',
    user: 'Maria Costa',
    timestamp: new Date('2026-01-05T16:45:00'),
    details: '58 User Stories exportadas'
  },
] as const satisfies RecentActivity[];
