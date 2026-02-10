import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileStack,
  Search,
  Filter,
  Star,
  Download,
  Eye,
  Copy,
  MoreVertical,
  Layers,
  Boxes,
  FileText,
  CheckSquare,
  Calendar,
  User,
  TrendingUp,
  X,
  Shield,
  ChevronRight
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
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
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';

type View = 
  | 'dashboard' 
  | 'new-project'
  | 'project-builder'
  | 'project-view'
  | 'templates'
  | 'library'
  | 'integrations'
  | 'audit';

interface TemplatesProps {
  onNavigate?: (view: View) => void;
}

export function Templates({ onNavigate }: TemplatesProps = {}) {
  const navigate = useNavigate();
  const navigateToBuilder = () => {
    if (onNavigate) {
      onNavigate('project-builder');
      return;
    }
    navigate('/project-builder');
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');

  const templates = [
    {
      id: 1,
      name: 'Mobile Banking Particulares PT',
      category: 'Mobile Banking',
      description: 'Template completo para apps de mobile banking para clientes particulares, incluindo autenticação PSD2, transferências, pagamentos e gestão de contas.',
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
      tags: ['iOS', 'Android', 'Biometria', 'Transferências', 'Cartões']
    },
    {
      id: 2,
      name: 'MB Way - Sistema Completo',
      category: 'Pagamentos',
      description: 'Implementação end-to-end de sistema MB Way com transferências P2P, pagamentos comerciantes, levantamentos ATM e integração SIBS.',
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
      description: 'Portal completo para gestão bancária empresarial com multi-utilizador, aprovações workflow, tesouraria e integração ERP.',
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
      description: 'Processo completo de abertura de conta digital com KYC automatizado, validação biométrica, assinatura digital e vídeo-identificação.',
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
      name: 'Cartões - Gestão e Operações',
      category: 'Cartões',
      description: 'Gestão completa de cartões de débito e crédito: emissão, ativação, bloqueio, limites, tokenização e Apple/Google Pay.',
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
      tags: ['Cartões', 'Tokenização', 'Apple Pay', 'Google Pay']
    },
    {
      id: 7,
      name: 'Backoffice Operações Bancárias',
      category: 'Backoffice',
      description: 'Aplicação backoffice para operadores bancários com gestão de clientes, transações, KYC, compliance e reporting.',
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
      description: 'Interface e lógica para terminais Multibanco ATM com levantamentos, depósitos, consultas e pagamentos de serviços.',
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
  ];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || template.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(templates.map(t => t.category)));
  const featuredTemplates = templates.filter(t => t.featured);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-PT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  // Get templates based on active tab
  const getDisplayedTemplates = () => {
    switch(activeTab) {
      case 'featured':
        return filteredTemplates.filter(t => t.featured);
      case 'popular':
        return [...filteredTemplates].sort((a, b) => b.usage - a.usage);
      case 'recent':
        return [...filteredTemplates].sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime());
      default:
        return filteredTemplates;
    }
  };

  const handleUseTemplate = (template: any) => {
    // Navigate to project builder to start AI-assisted configuration
    navigateToBuilder();
  };

  const handleExportTemplate = (template: any) => {
    alert(`📥 A exportar template "${template.name}"...\n\n` +
          `Formatos disponíveis:\n` +
          `• JSON (StoryForge format)\n` +
          `• Jira XML\n` +
          `• Azure DevOps Work Items\n` +
          `• Excel (análise completa)`);
  };

  return (
    <div className="p-8 max-w-[1800px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Templates de Projeto
        </h1>
        <p className="text-slate-600">
          Templates pré-configurados para acelerar a criação de projetos bancários
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="p-6 border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileStack className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{templates.length}</p>
              <p className="text-xs text-slate-600">Templates Disponíveis</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">{featuredTemplates.length}</p>
              <p className="text-xs text-slate-600">Destacados</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">
                {templates.reduce((acc, t) => acc + t.usage, 0)}
              </p>
              <p className="text-xs text-slate-600">Vezes Utilizados</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-slate-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold text-slate-900">4.8</p>
              <p className="text-xs text-slate-600">Rating Médio</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">Todos ({filteredTemplates.length})</TabsTrigger>
            <TabsTrigger value="featured">Destacados ({featuredTemplates.length})</TabsTrigger>
            <TabsTrigger value="popular">Mais Usados</TabsTrigger>
            <TabsTrigger value="recent">Recentes</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Pesquisar templates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Categorias</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="border-slate-200 hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileStack className="w-6 h-6 text-slate-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-slate-900">{template.name}</h3>
                          {template.featured && (
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          )}
                        </div>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">
                          {template.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-slate-600">
                          <Badge variant="secondary">{template.category}</Badge>
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            {template.rating}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="w-3 h-3" />
                            {template.usage}x usado
                          </span>
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="flex-shrink-0">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedTemplate(template)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Preview Completo
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleUseTemplate(template)}>
                          <Copy className="w-4 h-4 mr-2" />
                          Usar Template
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleExportTemplate(template)}>
                          <Download className="w-4 h-4 mr-2" />
                          Exportar Template
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-5 gap-3 mb-4 p-3 bg-slate-50 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Layers className="w-3 h-3 text-blue-600" />
                        <p className="text-xs font-medium text-blue-600">{template.stats.epics}</p>
                      </div>
                      <p className="text-xs text-slate-600">Epics</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Boxes className="w-3 h-3 text-purple-600" />
                        <p className="text-xs font-medium text-purple-600">{template.stats.features}</p>
                      </div>
                      <p className="text-xs text-slate-600">Features</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <FileText className="w-3 h-3 text-green-600" />
                        <p className="text-xs font-medium text-green-600">{template.stats.userStories}</p>
                      </div>
                      <p className="text-xs text-slate-600">US</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <CheckSquare className="w-3 h-3 text-orange-600" />
                        <p className="text-xs font-medium text-orange-600">{template.stats.tasks}</p>
                      </div>
                      <p className="text-xs text-slate-600">Tasks</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <CheckSquare className="w-3 h-3 text-indigo-600" />
                        <p className="text-xs font-medium text-indigo-600">{template.stats.testCases}</p>
                      </div>
                      <p className="text-xs text-slate-600">Tests</p>
                    </div>
                  </div>

                  {/* Compliance Tags */}
                  <div className="mb-4">
                    <p className="text-xs font-medium text-slate-700 mb-2">Compliance:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.compliance.map((tag) => (
                        <Badge key={tag} className="bg-green-50 text-green-700 border-green-200 text-xs hover:bg-green-50">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-3 text-xs text-slate-600">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {template.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(template.lastUpdated)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => setSelectedTemplate(template)}>
                        <Eye className="w-4 h-4" />
                        Preview
                      </Button>
                      <Button size="sm" className="gap-2 bg-slate-900 hover:bg-slate-800" onClick={() => handleUseTemplate(template)}>
                        <Copy className="w-4 h-4" />
                        Usar Template
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="featured" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            {getDisplayedTemplates().map((template) => (
              <Card key={template.id} className="border-slate-200 hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-semibold text-slate-900">{template.name}</h3>
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{template.category}</Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedTemplate(template)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" className="bg-slate-900 hover:bg-slate-800" onClick={() => handleUseTemplate(template)}>
                        <Copy className="w-4 h-4 mr-1" />
                        Usar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            {getDisplayedTemplates().map((template) => (
              <Card key={template.id} className="border-slate-200 hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-semibold text-slate-900">{template.name}</h3>
                    <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                      {template.usage}x usado
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{template.category}</Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedTemplate(template)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" className="bg-slate-900 hover:bg-slate-800" onClick={() => handleUseTemplate(template)}>
                        <Copy className="w-4 h-4 mr-1" />
                        Usar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid grid-cols-2 gap-6">
            {getDisplayedTemplates().map((template) => (
              <Card key={template.id} className="border-slate-200 hover:shadow-lg transition-shadow">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-semibold text-slate-900">{template.name}</h3>
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                      {formatDate(template.lastUpdated)}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{template.category}</Badge>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedTemplate(template)}>
                        <Eye className="w-4 h-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" className="bg-slate-900 hover:bg-slate-800" onClick={() => handleUseTemplate(template)}>
                        <Copy className="w-4 h-4 mr-1" />
                        Usar
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
