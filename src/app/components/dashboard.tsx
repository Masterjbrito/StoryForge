import { 
  Plus, 
  FolderKanban, 
  Calendar,
  ExternalLink,
  Search,
  Filter,
  Download,
  FileText
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

type View = 'dashboard' | 'analysis' | 'questionnaire' | 'structure' | 'integrations';

interface DashboardProps {
  onNavigate: (view: View) => void;
  onViewProject: (projectId: number) => void;
}

export function Dashboard({ onNavigate, onViewProject }: DashboardProps) {
  const exportedProjects = [
    { 
      id: 1, 
      name: 'Sistema de Pagamentos MB Way', 
      createdAt: new Date('2026-01-05'),
      exportedAt: new Date('2026-01-06'),
      platform: 'Jira',
      jiraProject: 'MBWAY',
      items: { epics: 5, features: 12, userStories: 45, tasks: 156, testCases: 89 },
      color: 'from-blue-500 to-cyan-500',
      url: 'https://company.atlassian.net/browse/MBWAY'
    },
    { 
      id: 2, 
      name: 'Portal Homebanking Empresas', 
      createdAt: new Date('2026-01-03'),
      exportedAt: new Date('2026-01-04'),
      platform: 'Azure DevOps',
      jiraProject: 'HBEMP',
      items: { epics: 4, features: 10, userStories: 32, tasks: 128, testCases: 67 },
      color: 'from-purple-500 to-pink-500',
      url: 'https://dev.azure.com/company/HBEMP'
    },
    { 
      id: 3, 
      name: 'App Mobile Banking Particulares', 
      createdAt: new Date('2025-12-28'),
      exportedAt: new Date('2026-01-02'),
      platform: 'Jira',
      jiraProject: 'MOBPART',
      items: { epics: 6, features: 15, userStories: 58, tasks: 203, testCases: 112 },
      color: 'from-green-500 to-emerald-500',
      url: 'https://company.atlassian.net/browse/MOBPART'
    },
    { 
      id: 4, 
      name: 'Plataforma Multibanco ATM',
      createdAt: new Date('2025-12-20'),
      exportedAt: new Date('2025-12-22'),
      platform: 'Jira',
      jiraProject: 'MBATM',
      items: { epics: 3, features: 8, userStories: 28, tasks: 94, testCases: 56 },
      color: 'from-orange-500 to-red-500',
      url: 'https://company.atlassian.net/browse/MBATM'
    },
  ];

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-PT', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const totalStats = exportedProjects.reduce((acc, proj) => ({
    epics: acc.epics + proj.items.epics,
    features: acc.features + proj.items.features,
    userStories: acc.userStories + proj.items.userStories,
    tasks: acc.tasks + proj.items.tasks,
    testCases: acc.testCases + proj.items.testCases,
  }), { epics: 0, features: 0, userStories: 0, tasks: 0, testCases: 0 });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Análise Funcional Inteligente
        </h1>
        <p className="text-slate-600">
          Gestão de projetos exportados para Jira e Azure DevOps
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-slate-200/50">
          <p className="text-sm text-slate-600 mb-1">Total Projetos</p>
          <p className="text-3xl font-bold text-blue-600">{exportedProjects.length}</p>
        </Card>
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-slate-200/50">
          <p className="text-sm text-slate-600 mb-1">Epics</p>
          <p className="text-3xl font-bold text-purple-600">{totalStats.epics}</p>
        </Card>
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-slate-200/50">
          <p className="text-sm text-slate-600 mb-1">Features</p>
          <p className="text-3xl font-bold text-green-600">{totalStats.features}</p>
        </Card>
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-slate-200/50">
          <p className="text-sm text-slate-600 mb-1">User Stories</p>
          <p className="text-3xl font-bold text-orange-600">{totalStats.userStories}</p>
        </Card>
        <Card className="p-4 bg-white/80 backdrop-blur-sm border-slate-200/50">
          <p className="text-sm text-slate-600 mb-1">Tasks</p>
          <p className="text-3xl font-bold text-indigo-600">{totalStats.tasks}</p>
        </Card>
      </div>

      {/* Create New Project CTA */}
      <Card 
        onClick={() => onNavigate('analysis')}
        className="p-8 mb-8 bg-gradient-to-br from-blue-600 to-indigo-600 text-white hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group border-0"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-3xl mb-2">Criar Novo Projeto</h2>
              <p className="text-blue-100 text-lg">
                Preencha o formulário e deixe a IA criar toda a estrutura automaticamente
              </p>
            </div>
          </div>
          <div className="text-white/80 group-hover:translate-x-2 transition-transform">
            <Plus className="w-12 h-12" />
          </div>
        </div>
      </Card>

      {/* Projects List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl">Projetos Exportados</h2>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Pesquisar projetos..."
                className="pl-10 w-64"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {exportedProjects.map((project) => (
            <Card 
              key={project.id} 
              onClick={() => onViewProject(project.id)}
              className="p-6 bg-white/80 backdrop-blur-sm border-slate-200/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group cursor-pointer"
            >
              <div className="flex items-start gap-6">
                {/* Project Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${project.color} flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <FolderKanban className="w-8 h-8 text-white" />
                </div>

                {/* Project Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Badge variant="outline" className="font-mono">
                          {project.jiraProject}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Criado: {formatDate(project.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Download className="w-4 h-4" />
                          Exportado: {formatDate(project.exportedAt)}
                        </span>
                      </div>
                    </div>
                    
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm font-medium"
                    >
                      Abrir no {project.platform}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>

                  {/* Items Summary */}
                  <div className="grid grid-cols-5 gap-4 mt-4 pt-4 border-t border-slate-200">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Epics</p>
                      <p className="text-lg font-semibold text-purple-600">{project.items.epics}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Features</p>
                      <p className="text-lg font-semibold text-green-600">{project.items.features}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">User Stories</p>
                      <p className="text-lg font-semibold text-blue-600">{project.items.userStories}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Tasks</p>
                      <p className="text-lg font-semibold text-orange-600">{project.items.tasks}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">Test Cases</p>
                      <p className="text-lg font-semibold text-indigo-600">{project.items.testCases}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}