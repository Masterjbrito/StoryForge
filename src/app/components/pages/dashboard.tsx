import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ExternalLink,
  MoreVertical,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Download,
  Search,
  TrendingUp,
  TrendingDown,
  BarChart3,
  FileText,
  Users,
  Shield,
  Activity,
  Target,
  AlertTriangle,
  Bell,
  Check,
  X
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';

type View = 
  | 'dashboard' 
  | 'new-project'
  | 'project-builder'
  | 'project-view'
  | 'templates'
  | 'library'
  | 'integrations'
  | 'audit';

interface DashboardProps {
  onNavigate?: (view: View) => void;
  onViewProject?: (projectId: number) => void;
}

export function Dashboard({ onViewProject }: DashboardProps = {}) {
  const navigate = useNavigate();
  const handleViewProject = (projectId: number) => {
    if (onViewProject) {
      onViewProject(projectId);
      return;
    }
    navigate(`/project/${projectId}`);
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Exportação Concluída',
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
      title: 'Atualização Disponível',
      message: 'Nova versão do template PSD2 disponível na biblioteca',
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
      title: 'Revisão Necessária',
      message: 'OPENAPI-2024: Artefactos pendentes de aprovação',
      timestamp: new Date('2026-01-08T11:30:00'),
      read: true,
      project: 'OPENAPI-2024'
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'info': return <Bell className="w-4 h-4 text-blue-600" />;
      default: return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch(type) {
      case 'success': return 'bg-green-50';
      case 'warning': return 'bg-amber-50';
      case 'info': return 'bg-blue-50';
      default: return 'bg-slate-50';
    }
  };

  const projects = [
    {
      id: 1,
      name: 'Sistema de Pagamentos MB Way',
      code: 'MBWAY-2024',
      department: 'Digital Payments',
      type: 'Mobile Banking',
      platform: 'Jira Cloud',
      version: 'v2.1.0',
      createdAt: new Date('2025-12-15'),
      lastExport: new Date('2026-01-08T14:30:00'),
      status: 'published',
      artifacts: {
        epics: 5,
        features: 12,
        userStories: 45,
        tasks: 156,
        testCases: 89
      },
      compliance: ['PSD2', 'GDPR', 'SIBS', 'SCA'],
      url: 'https://company.atlassian.net/browse/MBWAY',
      qualityScore: 98,
      exportCount: 12,
      lastModifiedBy: 'Susana Gamito'
    },
    {
      id: 2,
      name: 'Portal Homebanking Empresas',
      code: 'HBEMP-2024',
      department: 'Corporate Banking',
      type: 'Web Banking',
      platform: 'Azure DevOps',
      version: 'v1.5.2',
      createdAt: new Date('2025-11-20'),
      lastExport: new Date('2026-01-06T09:15:00'),
      status: 'published',
      artifacts: {
        epics: 4,
        features: 10,
        userStories: 32,
        tasks: 128,
        testCases: 67
      },
      compliance: ['PSD2', 'GDPR', 'Banco de Portugal', 'AML'],
      url: 'https://dev.azure.com/company/HBEMP',
      qualityScore: 95,
      exportCount: 8,
      lastModifiedBy: 'João Santos'
    },
    {
      id: 3,
      name: 'App Mobile Banking Particulares',
      code: 'MOBPART-2024',
      department: 'Retail Banking',
      type: 'Mobile Banking',
      platform: 'Jira Cloud',
      version: 'v3.0.1',
      createdAt: new Date('2025-10-05'),
      lastExport: new Date('2026-01-05T16:45:00'),
      status: 'published',
      artifacts: {
        epics: 6,
        features: 15,
        userStories: 58,
        tasks: 203,
        testCases: 112
      },
      compliance: ['PSD2', 'GDPR', 'SIBS', 'AML', 'KYC'],
      url: 'https://company.atlassian.net/browse/MOBPART',
      qualityScore: 97,
      exportCount: 15,
      lastModifiedBy: 'Maria Costa'
    },
    {
      id: 4,
      name: 'Plataforma Multibanco ATM',
      code: 'MBATM-2024',
      department: 'Channels & Payments',
      type: 'Core Banking',
      platform: 'Jira Cloud',
      version: 'v1.2.0',
      createdAt: new Date('2025-09-10'),
      lastExport: new Date('2026-01-02T11:20:00'),
      status: 'published',
      artifacts: {
        epics: 3,
        features: 8,
        userStories: 28,
        tasks: 94,
        testCases: 56
      },
      compliance: ['PSD2', 'SIBS', 'Banco de Portugal', 'EMV'],
      url: 'https://company.atlassian.net/browse/MBATM',
      qualityScore: 100,
      exportCount: 6,
      lastModifiedBy: 'Pedro Oliveira'
    },
    {
      id: 5,
      name: 'API Open Banking PSD2',
      code: 'OPENAPI-2024',
      department: 'Open Banking',
      type: 'APIs / Open Banking',
      platform: 'Azure DevOps',
      version: 'v2.0.3',
      createdAt: new Date('2025-08-25'),
      lastExport: new Date('2025-12-28T10:00:00'),
      status: 'published',
      artifacts: {
        epics: 4,
        features: 11,
        userStories: 38,
        tasks: 142,
        testCases: 95
      },
      compliance: ['PSD2', 'GDPR', 'SCA', 'OAuth2'],
      url: 'https://dev.azure.com/company/OPENAPI',
      qualityScore: 96,
      exportCount: 9,
      lastModifiedBy: 'Susana Gamito'
    },
    {
      id: 6,
      name: 'Portal Backoffice Operações',
      code: 'BACKOPS-2024',
      department: 'Operations',
      type: 'Backoffice',
      platform: 'Jira Cloud',
      version: 'v1.8.1',
      createdAt: new Date('2025-07-15'),
      lastExport: new Date('2025-12-20T15:30:00'),
      status: 'published',
      artifacts: {
        epics: 5,
        features: 13,
        userStories: 42,
        tasks: 167,
        testCases: 78
      },
      compliance: ['GDPR', 'Banco de Portugal', 'AML', 'Audit Trail'],
      url: 'https://company.atlassian.net/browse/BACKOPS',
      qualityScore: 94,
      exportCount: 11,
      lastModifiedBy: 'Carlos Mendes'
    },
  ];

  const totalArtifacts = projects.reduce((acc, p) => 
    acc + p.artifacts.epics + p.artifacts.features + p.artifacts.userStories + 
    p.artifacts.tasks + p.artifacts.testCases, 0
  );

  const avgQualityScore = Math.round(
    projects.reduce((acc, p) => acc + p.qualityScore, 0) / projects.length
  );

  const complianceStats = projects.reduce((acc, p) => {
    p.compliance.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const topCompliance = Object.entries(complianceStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const recentActivity = [
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
      user: 'João Santos',
      timestamp: new Date('2026-01-06T09:15:00'),
      details: 'Atualização de compliance tags'
    },
    {
      type: 'export',
      project: 'MOBPART-2024',
      user: 'Maria Costa',
      timestamp: new Date('2026-01-05T16:45:00'),
      details: '58 User Stories exportadas'
    },
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || project.type === filterType;
    const matchesPlatform = filterPlatform === 'all' || project.platform === filterPlatform;
    const matchesDepartment = filterDepartment === 'all' || project.department === filterDepartment;
    
    return matchesSearch && matchesType && matchesPlatform && matchesDepartment;
  });

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'published':
        return (
          <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-50">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Publicado
          </Badge>
        );
      case 'draft':
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Rascunho
          </Badge>
        );
      default:
        return null;
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 95) return 'text-green-700';
    if (score >= 85) return 'text-amber-700';
    return 'text-red-700';
  };

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Dashboard
        </h1>
        <p className="text-slate-600">
          Visão geral e análise de projetos publicados
        </p>
      </div>

      {/* Enhanced KPIs Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="p-6 border-slate-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
              <TrendingUp className="w-3 h-3" />
              +2
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">Projetos Publicados</p>
          <p className="text-3xl font-semibold text-slate-900">{projects.length}</p>
          <p className="text-xs text-slate-500 mt-2">Total acumulado</p>
        </Card>

        <Card className="p-6 border-slate-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
              <TrendingUp className="w-3 h-3" />
              +124
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">Artefactos Criados</p>
          <p className="text-3xl font-semibold text-slate-900">{totalArtifacts}</p>
          <p className="text-xs text-slate-500 mt-2">Epics, Features, US, Tasks, Tests</p>
        </Card>

        <Card className="p-6 border-slate-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-slate-600" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
              {avgQualityScore}%
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">Qualidade Média</p>
          <p className="text-3xl font-semibold text-slate-900">{avgQualityScore}%</p>
          <p className="text-xs text-slate-500 mt-2">Score de qualidade médio</p>
        </Card>

        <Card className="p-6 border-slate-200">
          <div className="flex items-start justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded">
              <CheckCircle2 className="w-3 h-3" />
              100%
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-1">Compliance</p>
          <p className="text-3xl font-semibold text-slate-900">{projects.length}</p>
          <p className="text-xs text-slate-500 mt-2">Projetos conformes</p>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <Card className="p-6 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-900">Top Compliance Tags</h3>
            <Shield className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-3">
            {topCompliance.map(([tag, count]) => (
              <div key={tag}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-slate-700">{tag}</span>
                  <span className="text-xs font-medium text-slate-600">{count} projetos</span>
                </div>
                <Progress value={(count / projects.length) * 100} className="h-1.5" />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-900">Distribuição por Tipo</h3>
            <BarChart3 className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-3">
            {['Mobile Banking', 'Web Banking', 'Core Banking', 'APIs / Open Banking', 'Backoffice'].map(type => {
              const count = projects.filter(p => p.type === type).length;
              if (count === 0) return null;
              return (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-700">{type}</span>
                    <span className="text-xs font-medium text-slate-600">{count}</span>
                  </div>
                  <Progress value={(count / projects.length) * 100} className="h-1.5" />
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6 border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-slate-900">Atividade Recente</h3>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 ${
                  activity.type === 'export' ? 'bg-green-500' : 'bg-blue-500'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-900 font-medium truncate">
                    {activity.project}
                  </p>
                  <p className="text-xs text-slate-600 truncate">{activity.details}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatDateTime(activity.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Projects Table with Advanced Filters */}
      <Card className="border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Projetos Publicados
            </h2>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="w-4 h-4" />
                Exportar CSV
              </Button>
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="grid grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Pesquisar por nome ou código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de Projeto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="Mobile Banking">Mobile Banking</SelectItem>
                <SelectItem value="Web Banking">Web Banking</SelectItem>
                <SelectItem value="Core Banking">Core Banking</SelectItem>
                <SelectItem value="APIs / Open Banking">APIs / Open Banking</SelectItem>
                <SelectItem value="Backoffice">Backoffice</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPlatform} onValueChange={setFilterPlatform}>
              <SelectTrigger>
                <SelectValue placeholder="Plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Plataformas</SelectItem>
                <SelectItem value="Jira Cloud">Jira Cloud</SelectItem>
                <SelectItem value="Azure DevOps">Azure DevOps</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Departamentos</SelectItem>
                {Array.from(new Set(projects.map(p => p.department))).map(department => (
                  <SelectItem key={department} value={department}>{department}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="font-medium">Projeto</TableHead>
              <TableHead className="font-medium">Departamento</TableHead>
              <TableHead className="font-medium">Tipo</TableHead>
              <TableHead className="font-medium">Plataforma</TableHead>
              <TableHead className="font-medium">Artefactos</TableHead>
              <TableHead className="font-medium">Qualidade</TableHead>
              <TableHead className="font-medium">Compliance</TableHead>
              <TableHead className="font-medium">Última Exportação</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-12">
                  <p className="text-slate-500">Nenhum projeto encontrado</p>
                </TableCell>
              </TableRow>
            ) : (
              filteredProjects.map((project) => (
                <TableRow 
                  key={project.id}
                  className="cursor-pointer hover:bg-slate-50"
                  onClick={() => handleViewProject(project.id)}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">{project.name}</p>
                      <p className="text-sm text-slate-500 font-mono">{project.code}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-slate-700">{project.department}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{project.type}</Badge>
                  </TableCell>
                  <TableCell className="text-slate-700">{project.platform}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="outline" className="text-xs font-mono">
                        {project.artifacts.epics} EP
                      </Badge>
                      <Badge variant="outline" className="text-xs font-mono">
                        {project.artifacts.features} FT
                      </Badge>
                      <Badge variant="outline" className="text-xs font-mono">
                        {project.artifacts.userStories} US
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5 w-16">
                        <div 
                          className={`h-full rounded-full ${
                            project.qualityScore >= 95 ? 'bg-green-600' :
                            project.qualityScore >= 85 ? 'bg-amber-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${project.qualityScore}%` }}
                        />
                      </div>
                      <span className={`text-xs font-medium ${getQualityColor(project.qualityScore)}`}>
                        {project.qualityScore}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {project.compliance.slice(0, 2).map((tag) => (
                        <Badge 
                          key={tag} 
                          className="bg-green-50 text-green-700 border-green-200 text-xs hover:bg-green-50"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {project.compliance.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.compliance.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="text-slate-900">{formatDate(project.lastExport)}</p>
                      <p className="text-xs text-slate-500">
                        por {project.lastModifiedBy}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(project.status)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleViewProject(project.id);
                        }}>
                          Ver Estrutura Completa
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          Histórico de Versões
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(project.url, '_blank');
                          }}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Abrir em {project.platform}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          Exportar Novamente
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                          Duplicar Projeto
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-600">
            A mostrar <span className="font-medium">{filteredProjects.length}</span> de <span className="font-medium">{projects.length}</span> projetos
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="outline" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm" disabled>
              Próximo
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
