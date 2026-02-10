import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Check,
  ChevronRight,
  Building2,
  Shield,
  Zap,
  FileText,
  Upload,
  Settings,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { useAgent } from '@/contexts/AgentContext';
import { useAudit } from '@/contexts/AuditContext';

type View = 
  | 'dashboard' 
  | 'new-project'
  | 'project-builder'
  | 'project-view'
  | 'templates'
  | 'library'
  | 'integrations'
  | 'audit';

interface NewProjectProps {
  onNavigate?: (view: View) => void;
  onCreate?: (data: any) => void;
}

export function NewProject({ onNavigate, onCreate }: NewProjectProps = {}) {
  const navigate = useNavigate();
  const { agentService } = useAgent();
  const { logAction } = useAudit();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<any>({});

  const navigateByView = (view: View) => {
    if (onNavigate) {
      onNavigate(view);
      return;
    }
    const map: Record<View, string> = {
      dashboard: '/dashboard',
      'new-project': '/new-project',
      'project-builder': '/project-builder',
      'project-view': '/project/1',
      templates: '/templates',
      library: '/library',
      integrations: '/integrations',
      audit: '/audit',
    };
    navigate(map[view]);
  };

  const createProject = (data: any) => {
    if (onCreate) {
      onCreate(data);
      return;
    }
    navigate('/project-builder', { state: { projectData: data } });
  };

  const steps = [
    { number: 1, title: 'Identidade', icon: Building2 },
    { number: 2, title: 'Contexto Bancário', icon: FileText },
    { number: 3, title: 'Compliance & Segurança', icon: Shield },
    { number: 4, title: 'Sistemas & Integrações', icon: Zap },
    { number: 5, title: 'Input Documental', icon: Upload },
    { number: 6, title: 'Configuração IA', icon: Settings },
  ];

  const handleNext = async () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        await agentService.analyzeContext({
          name: formData.name || 'Novo Projeto',
          code: formData.code || 'PROJ-NEW',
          department: formData.department || 'Digital',
          type: formData.types?.[0] || 'Mobile Banking',
          description: formData.objective || '',
          businessContext: formData.objective || '',
          targetAudience: formData.channel || 'Particulares',
          channels: formData.types || [],
          existingSystems: formData.systems || '',
          complianceFrameworks: formData.compliance || [],
          securityRequirements: [],
          dataClassification: 'Confidencial',
          coreSystemIntegrations: formData.core ? [formData.core] : [],
          externalAPIs: formData.apis ? [formData.apis] : [],
          targetPlatform: formData.platform || 'Jira Cloud',
          uploadedDocuments: [],
          referenceLinks: formData.links ? [formData.links] : [],
          aiMode: 'rigorous',
          questionDepth: 'deep',
          autoCompliance: true,
        });
        logAction({
          action: 'Contexto analisado no Novo Projeto',
          actionType: 'ai',
          user: 'Susana Gamito',
          userInitials: 'SG',
          project: formData.code || null,
          projectName: formData.name || null,
          details: 'Context Ingestor executado antes de iniciar IA Assistant',
          status: 'success',
        });
      } catch (error) {
        logAction({
          action: 'Falha no Context Ingestor',
          actionType: 'ai',
          user: 'Susana Gamito',
          userInitials: 'SG',
          project: formData.code || null,
          projectName: formData.name || null,
          details: error instanceof Error ? error.message : 'Erro desconhecido',
          status: 'warning',
        });
      }
      createProject(formData);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <Button 
          variant="ghost" 
          onClick={() => navigateByView('dashboard')}
          className="mb-4 gap-2 -ml-3"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Dashboard
        </Button>
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Novo Projeto
        </h1>
        <p className="text-slate-600">
          Preencha as informações para criar um projeto enterprise-ready
        </p>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b border-slate-200 px-8 py-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                    currentStep === step.number
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : currentStep > step.number
                      ? 'border-green-600 bg-green-600 text-white'
                      : 'border-slate-300 bg-white text-slate-400'
                  }`}>
                    {currentStep > step.number ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="hidden lg:block">
                    <p className={`text-sm font-medium ${
                      currentStep >= step.number ? 'text-slate-900' : 'text-slate-400'
                    }`}>
                      Etapa {step.number}
                    </p>
                    <p className={`text-xs ${
                      currentStep >= step.number ? 'text-slate-600' : 'text-slate-400'
                    }`}>
                      {step.title}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-green-600' : 'bg-slate-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto bg-slate-50 px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="p-8 border-slate-200">
            {currentStep === 1 && <Step1 formData={formData} setFormData={setFormData} />}
            {currentStep === 2 && <Step2 formData={formData} setFormData={setFormData} />}
            {currentStep === 3 && <Step3 formData={formData} setFormData={setFormData} />}
            {currentStep === 4 && <Step4 formData={formData} setFormData={setFormData} />}
            {currentStep === 5 && <Step5 formData={formData} setFormData={setFormData} />}
            {currentStep === 6 && <Step6 formData={formData} setFormData={setFormData} />}
          </Card>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="bg-white border-t border-slate-200 px-8 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            className="bg-slate-900 hover:bg-slate-800 text-white gap-2"
          >
            {currentStep === 6 ? 'Iniciar IA Assistant' : 'Próximo'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Step Components
function Step1({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-1">
          Identidade do Projeto
        </h2>
        <p className="text-sm text-slate-600">
          Informações básicas que identificam o projeto
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="mb-2">Nome do Projeto *</Label>
          <Input
            id="name"
            placeholder="Ex: Sistema de Pagamentos MB Way"
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="code" className="mb-2">Código Interno *</Label>
          <Input
            id="code"
            placeholder="Ex: MBWAY-2024"
            className="font-mono"
            value={formData.code || ''}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="department" className="mb-2">Departamento / Área *</Label>
        <Input
          id="department"
          placeholder="Ex: Digital Payments, Retail Banking, Corporate Banking..."
          value={formData.department || ''}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
        />
        <p className="text-xs text-slate-500 mt-1">Área responsável pelo projeto dentro do banco</p>
      </div>

      <div>
        <Label className="mb-3">Tipo de Projeto * <span className="text-xs text-slate-500 font-normal">(pode selecionar múltiplos)</span></Label>
        <div className="grid grid-cols-2 gap-3">
          {['Mobile Banking', 'Web Banking', 'Backoffice', 'APIs / Open Banking'].map((type) => (
            <button
              key={type}
              onClick={() => setFormData({ 
                ...formData, 
                types: formData.types?.includes(type) 
                  ? formData.types.filter((t: string) => t !== type)
                  : [...(formData.types || []), type]
              })}
              className={`p-4 rounded-md border-2 text-sm font-medium transition-all relative ${
                formData.types?.includes(type)
                  ? 'border-slate-900 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {type}
              {formData.types?.includes(type) && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3">Canal *</Label>
        <div className="grid grid-cols-2 gap-3">
          {['Particulares', 'Empresas', 'Corporate', 'Interno'].map((channel) => (
            <button
              key={channel}
              onClick={() => setFormData({ ...formData, channel })}
              className={`p-3 rounded-md border-2 text-sm font-medium transition-all ${
                formData.channel === channel
                  ? 'border-slate-900 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {channel}
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3">Plataforma Alvo *</Label>
        <div className="grid grid-cols-3 gap-3">
          {['Jira Cloud', 'Azure DevOps', 'Ambos'].map((platform) => (
            <button
              key={platform}
              onClick={() => setFormData({ ...formData, platform })}
              className={`p-3 rounded-md border-2 text-sm font-medium transition-all ${
                formData.platform === platform
                  ? 'border-slate-900 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step2({ formData, setFormData }: any) {
  const handleImproveWithAI = (field: string) => {
    const currentValue = formData[field] || '';
    alert(`✨ Melhorando "${field}" com IA...\\n\\nTexto atual:\\n"${currentValue}"\\n\\nSugestão da IA:\\n"${currentValue} [Versão melhorada com contexto bancário, requisitos de compliance e estrutura profissional]"`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-1">
          Contexto Bancário
        </h2>
        <p className="text-sm text-slate-600">
          Informações de negócio e produto
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="objective">Objetivo de Negócio *</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 h-7 text-xs"
            onClick={() => handleImproveWithAI('objective')}
          >
            <Sparkles className="w-3 h-3" />
            Melhorar com IA
          </Button>
        </div>
        <Textarea
          id="objective"
          placeholder="Descreva os objetivos principais do projeto..."
          className="min-h-24"
          value={formData.objective || ''}
          onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
        />
      </div>

      <div>
        <Label className="mb-3">Produto Bancário *</Label>
        <div className="grid grid-cols-3 gap-3">
          {['Contas', 'Cartões', 'Pagamentos', 'Crédito', 'Investimentos', 'Onboarding'].map((product) => (
            <button
              key={product}
              onClick={() => setFormData({ 
                ...formData, 
                products: formData.products?.includes(product) 
                  ? formData.products.filter((p: string) => p !== product)
                  : [...(formData.products || []), product]
              })}
              className={`p-3 rounded-md border-2 text-sm font-medium transition-all ${
                formData.products?.includes(product)
                  ? 'border-slate-900 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {product}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="journey">Jornada Principal</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 h-7 text-xs"
            onClick={() => handleImproveWithAI('journey')}
          >
            <Sparkles className="w-3 h-3" />
            Melhorar com IA
          </Button>
        </div>
        <Textarea
          id="journey"
          placeholder="Descreva a jornada principal do utilizador..."
          className="min-h-24"
          value={formData.journey || ''}
          onChange={(e) => setFormData({ ...formData, journey: e.target.value })}
        />
      </div>
    </div>
  );
}

function Step3({ formData, setFormData }: any) {
  const complianceItems = [
    { id: 'psd2', label: 'PSD2', description: 'Payment Services Directive 2' },
    { id: 'sca', label: 'SCA', description: 'Strong Customer Authentication' },
    { id: 'gdpr', label: 'GDPR', description: 'Proteção de dados pessoais' },
    { id: 'bp', label: 'Banco de Portugal', description: 'Regulamentação nacional' },
    { id: 'sibs', label: 'SIBS / MB Way', description: 'Integração rede nacional' },
    { id: 'aml', label: 'AML / KYC', description: 'Anti-lavagem e conhecimento cliente' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-1">
          Compliance & Segurança
        </h2>
        <p className="text-sm text-slate-600">
          Requisitos regulamentares e de segurança
        </p>
      </div>

      <div className="space-y-3">
        {complianceItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setFormData({ 
              ...formData, 
              compliance: formData.compliance?.includes(item.id) 
                ? formData.compliance.filter((c: string) => c !== item.id)
                : [...(formData.compliance || []), item.id]
            })}
            className={`w-full p-4 rounded-md border-2 text-left transition-all ${
              formData.compliance?.includes(item.id)
                ? 'border-green-600 bg-green-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {formData.compliance?.includes(item.id) && (
                    <Shield className="w-4 h-4 text-green-600" />
                  )}
                  <p className="font-medium text-slate-900">{item.label}</p>
                </div>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                formData.compliance?.includes(item.id)
                  ? 'border-green-600 bg-green-600'
                  : 'border-slate-300'
              }`}>
                {formData.compliance?.includes(item.id) && (
                  <Check className="w-3 h-3 text-white" />
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step4({ formData, setFormData }: any) {
  const handleImproveWithAI = (field: string) => {
    const currentValue = formData[field] || '';
    alert(`✨ Melhorando "${field}" com IA...\\n\\nTexto atual:\\n"${currentValue}"\\n\\nSugestão da IA:\\n"${currentValue} [Versão melhorada com integração detalhada, endpoints, protocolos e requisitos técnicos]"`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-1">
          Sistemas & Integrações
        </h2>
        <p className="text-sm text-slate-600">
          Sistemas e integrações necessárias
        </p>
      </div>

      <div>
        <Label htmlFor="core" className="mb-2">Core Banking</Label>
        <Input
          id="core"
          placeholder="Ex: Temenos T24, Oracle FLEXCUBE..."
          value={formData.core || ''}
          onChange={(e) => setFormData({ ...formData, core: e.target.value })}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="systems">Sistemas Internos</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 h-7 text-xs"
            onClick={() => handleImproveWithAI('systems')}
          >
            <Sparkles className="w-3 h-3" />
            Melhorar com IA
          </Button>
        </div>
        <Textarea
          id="systems"
          placeholder="Liste os sistemas internos que serão integrados..."
          className="min-h-20"
          value={formData.systems || ''}
          onChange={(e) => setFormData({ ...formData, systems: e.target.value })}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="apis">APIs Externas</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 h-7 text-xs"
            onClick={() => handleImproveWithAI('apis')}
          >
            <Sparkles className="w-3 h-3" />
            Melhorar com IA
          </Button>
        </div>
        <Textarea
          id="apis"
          placeholder="Liste APIs de terceiros (SIBS, Vinte, etc)..."
          className="min-h-20"
          value={formData.apis || ''}
          onChange={(e) => setFormData({ ...formData, apis: e.target.value })}
        />
      </div>
    </div>
  );
}

function Step5({ formData, setFormData }: any) {
  const handleImproveWithAI = (field: string) => {
    const currentValue = formData[field] || '';
    alert(`✨ Melhorando "${field}" com IA...\\n\\nTexto atual:\\n"${currentValue}"\\n\\nSugestão da IA:\\n"${currentValue} [Versão melhorada com estrutura, formatação e contexto adicional]"`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-1">
          Input Documental
        </h2>
        <p className="text-sm text-slate-600">
          Documentos e materiais de apoio
        </p>
      </div>

      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-slate-400 transition-colors cursor-pointer">
        <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="font-medium text-slate-900 mb-1">
          Arraste ficheiros ou clique para carregar
        </p>
        <p className="text-sm text-slate-600">
          PDFs, imagens, documentos de requisitos
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="links">Links Externos</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 h-7 text-xs"
            onClick={() => handleImproveWithAI('links')}
          >
            <Sparkles className="w-3 h-3" />
            Melhorar com IA
          </Button>
        </div>
        <Textarea
          id="links"
          placeholder="Links para Figma, Confluence, Miro... (um por linha)"
          className="min-h-20 font-mono text-sm"
          value={formData.links || ''}
          onChange={(e) => setFormData({ ...formData, links: e.target.value })}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label htmlFor="notes">Notas Adicionais</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 h-7 text-xs"
            onClick={() => handleImproveWithAI('notes')}
          >
            <Sparkles className="w-3 h-3" />
            Melhorar com IA
          </Button>
        </div>
        <Textarea
          id="notes"
          placeholder="Informações adicionais relevantes..."
          className="min-h-24"
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
        />
      </div>
    </div>
  );
}

function Step6({ formData, setFormData }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 mb-1">
          Configuração IA
        </h2>
        <p className="text-sm text-slate-600">
          Configure o comportamento do assistente de IA
        </p>
      </div>

      <div>
        <Label className="mb-3">Modo de Operação *</Label>
        <div className="space-y-3">
          {[
            { value: 'standard', label: 'Standard', desc: 'Análise equilibrada para projetos gerais' },
            { value: 'banking', label: 'Rigor Bancário', desc: 'Foco em compliance e regulamentação (recomendado)', recommended: true },
            { value: 'audit', label: 'Auditoria-Ready', desc: 'Máximo rigor, documentação completa para auditoria' },
          ].map((mode) => (
            <button
              key={mode.value}
              onClick={() => setFormData({ ...formData, mode: mode.value })}
              className={`w-full p-4 rounded-md border-2 text-left transition-all ${
                formData.mode === mode.value
                  ? 'border-slate-900 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between mb-1">
                <p className="font-medium text-slate-900">{mode.label}</p>
                {mode.recommended && (
                  <Badge className="bg-slate-900 text-white hover:bg-slate-900">
                    Recomendado
                  </Badge>
                )}
              </div>
              <p className="text-sm text-slate-600">{mode.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3">Profundidade de Análise</Label>
        <div className="grid grid-cols-3 gap-3">
          {['Normal', 'Alta', 'Máxima'].map((depth) => (
            <button
              key={depth}
              onClick={() => setFormData({ ...formData, depth })}
              className={`p-3 rounded-md border-2 text-sm font-medium transition-all ${
                formData.depth === depth
                  ? 'border-slate-900 bg-slate-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {depth}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
        <p className="text-sm text-slate-700">
          <strong>Próximo passo:</strong> O IA Assistant irá guiá-lo através de 6 categorias de perguntas para criar a estrutura completa do projeto.
        </p>
      </div>
    </div>
  );
}
