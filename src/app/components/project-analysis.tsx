import { useState } from 'react';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  X,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Globe,
  Briefcase,
  Users,
  Target,
  Shield,
  Zap,
  Calendar,
  DollarSign,
  AlertCircle
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';

type View = 'dashboard' | 'analysis' | 'questionnaire' | 'structure' | 'integrations';

interface ProjectAnalysisProps {
  onNavigate: (view: View) => void;
  onDataChange: (data: any) => void;
}

export function ProjectAnalysis({ onNavigate, onDataChange }: ProjectAnalysisProps) {
  const [step, setStep] = useState(1);
  
  // Step 1 - Basic Info
  const [projectName, setProjectName] = useState('');
  const [projectCode, setProjectCode] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  
  // Step 2 - Business Context
  const [businessObjectives, setBusinessObjectives] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [successMetrics, setSuccessMetrics] = useState('');
  const [businessPriority, setBusinessPriority] = useState('high');
  
  // Step 3 - Technical Requirements
  const [technicalStack, setTechnicalStack] = useState('');
  const [integrations, setIntegrations] = useState('');
  const [securityRequirements, setSecurityRequirements] = useState('');
  const [performanceRequirements, setPerformanceRequirements] = useState('');
  const [complianceRequirements, setComplianceRequirements] = useState<string[]>([]);
  
  // Step 4 - Scope & Timeline
  const [mainFeatures, setMainFeatures] = useState('');
  const [outOfScope, setOutOfScope] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [teamSize, setTeamSize] = useState('');
  const [budget, setBudget] = useState('');
  
  // Step 5 - Documents & Assets
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [externalLinks, setExternalLinks] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const projectTypes = [
    { id: 'mobile', label: 'Mobile App', icon: Smartphone, color: 'from-blue-500 to-cyan-500' },
    { id: 'web', label: 'Website', icon: Globe, color: 'from-purple-500 to-pink-500' },
    { id: 'banking', label: 'Sistema Bancário', icon: Briefcase, color: 'from-green-500 to-emerald-500' },
  ];

  const complianceOptions = [
    'GDPR - Proteção de Dados',
    'PCI-DSS - Segurança de Pagamentos',
    'LGPD - Lei Geral de Proteção de Dados',
    'SOX - Sarbanes-Oxley',
    'ISO 27001 - Segurança da Informação',
    'HIPAA - Dados de Saúde'
  ];

  const handleTypeToggle = (typeId: string) => {
    setSelectedTypes(prev => 
      prev.includes(typeId) 
        ? prev.filter(t => t !== typeId)
        : [...prev, typeId]
    );
  };

  const handleComplianceToggle = (compliance: string) => {
    setComplianceRequirements(prev =>
      prev.includes(compliance)
        ? prev.filter(c => c !== compliance)
        : [...prev, compliance]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles(prev => [...prev, ...files.map(f => f.name)]);
  };

  const isStepValid = () => {
    switch(step) {
      case 1:
        return projectName && projectCode && description && selectedTypes.length > 0;
      case 2:
        return businessObjectives && targetAudience;
      case 3:
        return technicalStack;
      case 4:
        return mainFeatures && estimatedDuration;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleStartAnalysis = () => {
    const projectData = {
      // Basic Info
      projectName,
      projectCode,
      description,
      types: selectedTypes,
      // Business Context
      businessObjectives,
      targetAudience,
      successMetrics,
      businessPriority,
      // Technical Requirements
      technicalStack,
      integrations,
      securityRequirements,
      performanceRequirements,
      complianceRequirements,
      // Scope & Timeline
      mainFeatures,
      outOfScope,
      estimatedDuration,
      teamSize,
      budget,
      // Documents
      files: uploadedFiles,
      externalLinks,
      additionalNotes
    };
    
    onDataChange(projectData);
    onNavigate('questionnaire');
  };

  const steps = [
    { number: 1, label: 'Informação Básica', icon: FileText },
    { number: 2, label: 'Contexto de Negócio', icon: Target },
    { number: 3, label: 'Requisitos Técnicos', icon: Zap },
    { number: 4, label: 'Âmbito e Timeline', icon: Calendar },
    { number: 5, label: 'Documentos', icon: Upload }
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button 
          onClick={() => onNavigate('dashboard')}
          className="text-slate-600 hover:text-slate-900 mb-4 flex items-center gap-2 transition-colors"
        >
          ← Voltar ao Dashboard
        </button>
        <h1 className="text-4xl mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Novo Projeto - Formulário Detalhado
        </h1>
        <p className="text-slate-600">
          Preencha todas as informações para a IA criar a estrutura completa
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 flex items-center justify-between">
        {steps.map((s, index) => (
          <div key={s.number} className="flex items-center flex-1">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                step === s.number 
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg scale-110' 
                  : step > s.number
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-200 text-slate-400'
              }`}>
                {step > s.number ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <s.icon className="w-5 h-5" />
                )}
              </div>
              <span className={`text-sm font-medium ${
                step === s.number ? 'text-slate-900' : 'text-slate-400'
              }`}>
                {s.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-1 mx-4 rounded transition-all ${
                step > s.number ? 'bg-green-500' : 'bg-slate-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <Card className="p-8 bg-white/80 backdrop-blur-sm border-slate-200/50 mb-6">
        {/* Step 1 - Basic Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl mb-6 flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-600" />
                Informação Básica do Projeto
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label className="mb-2">Nome do Projeto *</Label>
                <Input
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Ex: Sistema de Pagamentos Mobile"
                  className="text-lg"
                />
              </div>

              <div>
                <Label className="mb-2">Código do Projeto *</Label>
                <Input
                  value={projectCode}
                  onChange={(e) => setProjectCode(e.target.value.toUpperCase())}
                  placeholder="Ex: PAYMOB"
                  className="text-lg font-mono"
                  maxLength={10}
                />
                <p className="text-xs text-slate-500 mt-1">
                  Será usado como chave no Jira/Azure DevOps
                </p>
              </div>
            </div>

            <div>
              <Label className="mb-2">Descrição Executiva *</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva de forma clara e concisa o objetivo principal do projeto..."
                className="min-h-32 resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Esta descrição aparecerá como resumo em todas as plataformas
              </p>
            </div>

            <div>
              <Label className="mb-3">Tipo de Projeto * (selecione um ou mais)</Label>
              <div className="grid grid-cols-3 gap-4">
                {projectTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => handleTypeToggle(type.id)}
                    className={`p-6 rounded-xl border-2 transition-all duration-300 ${
                      selectedTypes.includes(type.id)
                        ? 'border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/20'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-3 mx-auto`}>
                      <type.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-medium text-center">{type.label}</p>
                    {selectedTypes.includes(type.id) && (
                      <CheckCircle2 className="w-5 h-5 text-blue-600 mx-auto mt-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2 - Business Context */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-purple-600" />
                Contexto de Negócio
              </h2>
            </div>

            <div>
              <Label className="mb-2 flex items-center gap-2">
                Objetivos de Negócio *
                <Badge variant="secondary">Importante para IA</Badge>
              </Label>
              <Textarea
                value={businessObjectives}
                onChange={(e) => setBusinessObjectives(e.target.value)}
                placeholder="Ex: Aumentar conversão de vendas em 30%, reduzir tempo de processamento de pagamentos, melhorar experiência do utilizador..."
                className="min-h-32 resize-none"
              />
            </div>

            <div>
              <Label className="mb-2">Público-Alvo / Utilizadores *</Label>
              <Textarea
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="Descreva quem são os utilizadores finais: personas, comportamentos, necessidades..."
                className="min-h-32 resize-none"
              />
            </div>

            <div>
              <Label className="mb-2">Métricas de Sucesso</Label>
              <Textarea
                value={successMetrics}
                onChange={(e) => setSuccessMetrics(e.target.value)}
                placeholder="Como será medido o sucesso? KPIs, métricas, OKRs..."
                className="min-h-24 resize-none"
              />
            </div>

            <div>
              <Label className="mb-2">Prioridade de Negócio</Label>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'low', label: 'Baixa', color: 'from-slate-400 to-slate-500' },
                  { value: 'medium', label: 'Média', color: 'from-yellow-400 to-orange-500' },
                  { value: 'high', label: 'Alta', color: 'from-red-500 to-pink-600' }
                ].map((priority) => (
                  <button
                    key={priority.value}
                    onClick={() => setBusinessPriority(priority.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      businessPriority === priority.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${priority.color} mx-auto mb-2`} />
                    <p className="font-medium text-center">{priority.label}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 3 - Technical Requirements */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl mb-6 flex items-center gap-3">
                <Zap className="w-6 h-6 text-green-600" />
                Requisitos Técnicos
              </h2>
            </div>

            <div>
              <Label className="mb-2">Stack Tecnológica *</Label>
              <Textarea
                value={technicalStack}
                onChange={(e) => setTechnicalStack(e.target.value)}
                placeholder="Ex: React Native, Node.js, PostgreSQL, AWS, Docker..."
                className="min-h-24 resize-none"
              />
            </div>

            <div>
              <Label className="mb-2">Integrações Necessárias</Label>
              <Textarea
                value={integrations}
                onChange={(e) => setIntegrations(e.target.value)}
                placeholder="APIs externas, sistemas legados, serviços de terceiros..."
                className="min-h-24 resize-none"
              />
            </div>

            <div>
              <Label className="mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Requisitos de Segurança
              </Label>
              <Textarea
                value={securityRequirements}
                onChange={(e) => setSecurityRequirements(e.target.value)}
                placeholder="Autenticação, autorização, encriptação, gestão de sessões..."
                className="min-h-24 resize-none"
              />
            </div>

            <div>
              <Label className="mb-2">Requisitos de Performance</Label>
              <Textarea
                value={performanceRequirements}
                onChange={(e) => setPerformanceRequirements(e.target.value)}
                placeholder="Tempo de resposta, throughput, escalabilidade, disponibilidade..."
                className="min-h-24 resize-none"
              />
            </div>

            <div>
              <Label className="mb-3">Compliance e Regulamentações</Label>
              <div className="grid grid-cols-2 gap-3">
                {complianceOptions.map((compliance) => (
                  <button
                    key={compliance}
                    onClick={() => handleComplianceToggle(compliance)}
                    className={`p-3 rounded-lg border transition-all text-left ${
                      complianceRequirements.includes(compliance)
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        complianceRequirements.includes(compliance)
                          ? 'border-blue-600 bg-blue-600'
                          : 'border-slate-300'
                      }`}>
                        {complianceRequirements.includes(compliance) && (
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="text-sm font-medium">{compliance}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4 - Scope & Timeline */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl mb-6 flex items-center gap-3">
                <Calendar className="w-6 h-6 text-orange-600" />
                Âmbito e Timeline
              </h2>
            </div>

            <div>
              <Label className="mb-2 flex items-center gap-2">
                Funcionalidades Principais *
                <Badge variant="secondary">Crítico para estrutura</Badge>
              </Label>
              <Textarea
                value={mainFeatures}
                onChange={(e) => setMainFeatures(e.target.value)}
                placeholder="Liste as principais funcionalidades que devem ser implementadas. A IA usará isto para criar os Epics e Features."
                className="min-h-40 resize-none"
              />
              <p className="text-xs text-slate-500 mt-1">
                Ex: Login/Registo, Dashboard, Gestão de transações, Notificações push, etc.
              </p>
            </div>

            <div>
              <Label className="mb-2">Fora de Âmbito</Label>
              <Textarea
                value={outOfScope}
                onChange={(e) => setOutOfScope(e.target.value)}
                placeholder="O que NÃO deve ser incluído neste projeto..."
                className="min-h-24 resize-none"
              />
            </div>

            <div className="grid grid-cols-3 gap-6">
              <div>
                <Label className="mb-2">Duração Estimada *</Label>
                <Input
                  value={estimatedDuration}
                  onChange={(e) => setEstimatedDuration(e.target.value)}
                  placeholder="Ex: 6 meses"
                />
              </div>

              <div>
                <Label className="mb-2">Tamanho da Equipa</Label>
                <Input
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  placeholder="Ex: 8 pessoas"
                />
              </div>

              <div>
                <Label className="mb-2 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Orçamento
                </Label>
                <Input
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Ex: 500k €"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 5 - Documents */}
        {step === 5 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl mb-6 flex items-center gap-3">
                <Upload className="w-6 h-6 text-indigo-600" />
                Documentos e Assets
              </h2>
            </div>

            <div>
              <Label className="mb-3">Upload de Ficheiros</Label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer">
                <input
                  type="file"
                  id="file-upload"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.xd,.fig,.sketch"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <ImageIcon className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-lg font-medium mb-2">
                    Arraste ficheiros ou clique para carregar
                  </p>
                  <p className="text-sm text-slate-500">
                    Wireframes, mockups, documentos de requisitos, diagramas de arquitetura
                  </p>
                </label>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-slate-700">Ficheiros Carregados:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-sm">{file}</span>
                      </div>
                      <button 
                        onClick={() => setUploadedFiles(prev => prev.filter((_, i) => i !== index))}
                        className="text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <Label className="mb-2">Links Externos</Label>
              <Textarea
                value={externalLinks}
                onChange={(e) => setExternalLinks(e.target.value)}
                placeholder="Links para Figma, Miro, Google Drive, Confluence, etc. (um por linha)"
                className="min-h-24 resize-none"
              />
            </div>

            <div>
              <Label className="mb-2">Notas Adicionais</Label>
              <Textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder="Qualquer informação adicional que possa ajudar a IA a compreender melhor o projeto..."
                className="min-h-32 resize-none"
              />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Pronto para processar!</p>
                  <p>
                    Com todas estas informações, a IA irá criar uma estrutura detalhada com Epics, Features, User Stories, Tasks e Test Cases prontos para exportar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Navigation Buttons */}
      <div className="flex gap-4">
        {step > 1 && (
          <Button
            onClick={handleBack}
            variant="outline"
            className="flex-1"
          >
            ← Anterior
          </Button>
        )}
        
        {step < 5 ? (
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
          >
            Próximo
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button
            onClick={handleStartAnalysis}
            disabled={!isStepValid()}
            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
          >
            Iniciar Processamento com IA
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
