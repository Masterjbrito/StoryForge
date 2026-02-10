import { FileSearch, User, Calendar, Clock, Download, Filter, Search, ChevronDown, Shield, Activity, FileText, Plus, Upload, Settings } from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useState } from 'react';

type View = 
  | 'dashboard' 
  | 'new-project'
  | 'project-builder'
  | 'project-view'
  | 'templates'
  | 'library'
  | 'integrations'
  | 'audit';

interface AuditProps {
  onNavigate?: (view: View) => void;
}

export function Audit({ onNavigate }: AuditProps = {}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAction, setFilterAction] = useState('all');
  const [filterUser, setFilterUser] = useState('all');

  const auditLogs = [
    {
      id: 1,
      action: 'Projeto Exportado',
      actionType: 'export',
      user: 'Susana Gamito',
      userInitials: 'AS',
      project: 'MBWAY-2024',
      projectName: 'Sistema de Pagamentos MB Way',
      timestamp: new Date('2026-01-09T14:30:00'),
      details: 'Exportação para Jira Cloud - 45 user stories, 12 epics, 156 tasks criadas',
      ipAddress: '10.24.156.78',
      duration: '12s',
      status: 'success'
    },
    {
      id: 2,
      action: 'Projeto Criado',
      actionType: 'create',
      user: 'João Santos',
      userInitials: 'JS',
      project: 'HBEMP-2024',
      projectName: 'Portal Homebanking Empresas',
      timestamp: new Date('2026-01-09T09:15:00'),
      details: 'Novo projeto criado via wizard com modo "Rigor Bancário"',
      ipAddress: '10.24.156.92',
      duration: '3s',
      status: 'success'
    },
    {
      id: 3,
      action: 'Template Aplicado',
      actionType: 'template',
      user: 'Maria Costa',
      userInitials: 'MC',
      project: 'MOBPART-2024',
      projectName: 'App Mobile Banking Particulares',
      timestamp: new Date('2026-01-09T08:45:00'),
      details: 'Template "Mobile Banking PT" aplicado - 38 user stories geradas',
      ipAddress: '10.24.156.65',
      duration: '8s',
      status: 'success'
    },
    {
      id: 4,
      action: 'Estrutura Editada',
      actionType: 'edit',
      user: 'Susana Gamito',
      userInitials: 'AS',
      project: 'MBWAY-2024',
      projectName: 'Sistema de Pagamentos MB Way',
      timestamp: new Date('2026-01-08T16:20:00'),
      details: 'User Story US-023 editada - Acceptance Criteria atualizados',
      ipAddress: '10.24.156.78',
      duration: '2s',
      status: 'success'
    },
    {
      id: 5,
      action: 'Integração Configurada',
      actionType: 'integration',
      user: 'Pedro Oliveira',
      userInitials: 'PO',
      project: null,
      projectName: null,
      timestamp: new Date('2026-01-08T11:30:00'),
      details: 'Integração Azure DevOps configurada - Token atualizado',
      ipAddress: '10.24.156.43',
      duration: '5s',
      status: 'success'
    },
    {
      id: 6,
      action: 'Exportação Falhada',
      actionType: 'export',
      user: 'João Santos',
      userInitials: 'JS',
      project: 'HBEMP-2024',
      projectName: 'Portal Homebanking Empresas',
      timestamp: new Date('2026-01-08T10:15:00'),
      details: 'Erro ao conectar ao Jira Cloud - Timeout após 30s',
      ipAddress: '10.24.156.92',
      duration: '30s',
      status: 'error'
    },
    {
      id: 7,
      action: 'IA Assistant Iniciado',
      actionType: 'ai',
      user: 'Maria Costa',
      userInitials: 'MC',
      project: 'OPENAPI-2024',
      projectName: 'API Open Banking PSD2',
      timestamp: new Date('2026-01-07T15:45:00'),
      details: 'Sessão de IA iniciada - 24 perguntas planejadas',
      ipAddress: '10.24.156.65',
      duration: '1s',
      status: 'success'
    },
    {
      id: 8,
      action: 'Compliance Validado',
      actionType: 'compliance',
      user: 'Susana Gamito',
      userInitials: 'AS',
      project: 'MBWAY-2024',
      projectName: 'Sistema de Pagamentos MB Way',
      timestamp: new Date('2026-01-07T14:10:00'),
      details: 'Validação de compliance PSD2 executada - 100% conformidade',
      ipAddress: '10.24.156.78',
      duration: '4s',
      status: 'success'
    },
    {
      id: 9,
      action: 'Projeto Duplicado',
      actionType: 'create',
      user: 'Pedro Oliveira',
      userInitials: 'PO',
      project: 'BACKOPS-2024',
      projectName: 'Portal Backoffice Operações',
      timestamp: new Date('2026-01-06T16:30:00'),
      details: 'Projeto duplicado a partir de BACKOPS-2023 - 42 artefactos copiados',
      ipAddress: '10.24.156.43',
      duration: '7s',
      status: 'success'
    },
    {
      id: 10,
      action: 'Biblioteca Atualizada',
      actionType: 'library',
      user: 'João Santos',
      userInitials: 'JS',
      project: null,
      projectName: null,
      timestamp: new Date('2026-01-05T10:00:00'),
      details: 'Nova persona "Cliente Senior" adicionada à biblioteca',
      ipAddress: '10.24.156.92',
      duration: '2s',
      status: 'success'
    }
  ];

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getActionIcon = (actionType: string) => {
    switch(actionType) {
      case 'export': return <Upload className="w-4 h-4" />;
      case 'create': return <Plus className="w-4 h-4" />;
      case 'edit': return <FileText className="w-4 h-4" />;
      case 'template': return <FileSearch className="w-4 h-4" />;
      case 'integration': return <Settings className="w-4 h-4" />;
      case 'ai': return <Activity className="w-4 h-4" />;
      case 'compliance': return <Shield className="w-4 h-4" />;
      case 'library': return <FileText className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (actionType: string) => {
    switch(actionType) {
      case 'export': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'create': return 'bg-green-50 text-green-700 border-green-200';
      case 'edit': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'template': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'integration': return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'ai': return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'compliance': return 'bg-green-50 text-green-700 border-green-200';
      case 'library': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = searchTerm === '' || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.project?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesAction = filterAction === 'all' || log.actionType === filterAction;
    const matchesUser = filterUser === 'all' || log.user === filterUser;

    return matchesSearch && matchesAction && matchesUser;
  });

  const uniqueUsers = Array.from(new Set(auditLogs.map(log => log.user)));

  const totalActions = auditLogs.length;
  const actionsToday = auditLogs.filter(log => {
    const today = new Date();
    return log.timestamp.toDateString() === today.toDateString();
  }).length;
  const successRate = Math.round((auditLogs.filter(log => log.status === 'success').length / totalActions) * 100);

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Auditoria & Logs
        </h1>
        <p className="text-slate-600">
          Rastreabilidade completa de todas as ações - Retenção de 10 anos conforme Banco de Portugal
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="p-4 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{totalActions}</p>
              <p className="text-xs text-slate-600">Total de Ações</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{actionsToday}</p>
              <p className="text-xs text-slate-600">Ações Hoje</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{uniqueUsers.length}</p>
              <p className="text-xs text-slate-600">Utilizadores Ativos</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{successRate}%</p>
              <p className="text-xs text-slate-600">Taxa de Sucesso</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Histórico de Ações
            </h2>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="w-4 h-4" />
              Exportar CSV
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Pesquisar ações, utilizadores, projetos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tipo de Ação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Ações</SelectItem>
                <SelectItem value="export">Exportações</SelectItem>
                <SelectItem value="create">Criações</SelectItem>
                <SelectItem value="edit">Edições</SelectItem>
                <SelectItem value="template">Templates</SelectItem>
                <SelectItem value="integration">Integrações</SelectItem>
                <SelectItem value="ai">IA Assistant</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="library">Biblioteca</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterUser} onValueChange={setFilterUser}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Utilizador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Utilizadores</SelectItem>
                {uniqueUsers.map(user => (
                  <SelectItem key={user} value={user}>{user}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {(searchTerm || filterAction !== 'all' || filterUser !== 'all') && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setFilterAction('all');
                  setFilterUser('all');
                }}
              >
                Limpar
              </Button>
            )}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium">Ação</TableHead>
              <TableHead className="font-medium">Utilizador</TableHead>
              <TableHead className="font-medium">Projeto</TableHead>
              <TableHead className="font-medium">Data/Hora</TableHead>
              <TableHead className="font-medium">Detalhes</TableHead>
              <TableHead className="font-medium">Duração</TableHead>
              <TableHead className="font-medium">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                  Nenhum registo encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getActionColor(log.actionType)}`}>
                        {getActionIcon(log.actionType)}
                      </div>
                      <span className="font-medium text-slate-900">{log.action}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-medium">
                          {log.userInitials}
                        </span>
                      </div>
                      <span className="text-slate-700">{log.user}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {log.project ? (
                      <div>
                        <Badge variant="outline" className="font-mono mb-1">{log.project}</Badge>
                        <p className="text-xs text-slate-500">{log.projectName}</p>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {formatDateTime(log.timestamp)}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600 max-w-xs">
                    {log.details}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-mono text-xs">
                      {log.duration}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {log.status === 'success' ? (
                      <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
                        Sucesso
                      </Badge>
                    ) : (
                      <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-50">
                        Erro
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Footer with pagination info */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <p>
              A mostrar <span className="font-medium text-slate-900">{filteredLogs.length}</span> de{' '}
              <span className="font-medium text-slate-900">{totalActions}</span> registos
            </p>
            <p className="text-xs">
              <Shield className="w-3 h-3 inline mr-1" />
              Retenção: 10 anos • Encriptação: AES-256 • Compliance: Banco de Portugal
            </p>
          </div>
        </div>
      </Card>

      {/* Compliance Info */}
      <Card className="mt-6 p-6 border-green-200 bg-green-50">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-green-900 mb-2">Auditoria Compliant</h3>
            <p className="text-sm text-green-700 mb-3">
              Todos os logs são armazenados de forma imutável (append-only) com retenção de 10 anos, conforme exigido pelo Banco de Portugal. 
              Incluem timestamp, IP, utilizador e detalhes da ação para rastreabilidade total em auditorias regulamentares.
            </p>
            <div className="flex items-center gap-4 text-xs text-green-600">
              <span>✓ Logs imutáveis</span>
              <span>✓ Encriptação AES-256</span>
              <span>✓ Retenção 10 anos</span>
              <span>✓ Rastreabilidade IP</span>
              <span>✓ Conformidade GDPR</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
