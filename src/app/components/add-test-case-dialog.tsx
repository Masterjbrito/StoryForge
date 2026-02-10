import { useState } from 'react';
import { Plus, X, TestTube } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

interface AddTestCaseDialogProps {
  onAddTestCase: (testCase: any) => void;
}

export function AddTestCaseDialog({ onAddTestCase }: AddTestCaseDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    priority: 'Medium' as 'Critical' | 'High' | 'Medium' | 'Low',
    type: 'Functional' as 'Security' | 'Compliance' | 'Performance' | 'Functional' | 'Integration' | 'E2E',
    steps: ['', '', ''],
    expectedResult: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.expectedResult) {
      alert('Nome, categoria e resultado esperado são obrigatórios');
      return;
    }

    const filteredSteps = formData.steps.filter(s => s.trim() !== '');

    if (filteredSteps.length === 0) {
      alert('Adicione pelo menos um passo do teste');
      return;
    }

    const newTestCase = {
      id: Date.now(),
      category: formData.category,
      name: formData.name,
      priority: formData.priority,
      type: formData.type,
      steps: filteredSteps,
      expectedResult: formData.expectedResult,
      usedIn: 0
    };

    onAddTestCase(newTestCase);
    
    setFormData({
      category: '',
      name: '',
      priority: 'Medium',
      type: 'Functional',
      steps: ['', '', ''],
      expectedResult: ''
    });
    
    setIsOpen(false);
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData({ ...formData, steps: newSteps });
  };

  const addStep = () => {
    setFormData({ ...formData, steps: [...formData.steps, ''] });
  };

  const removeStep = (index: number) => {
    const newSteps = formData.steps.filter((_, i) => i !== index);
    setFormData({ ...formData, steps: newSteps });
  };

  const categoryPresets = [
    'Security',
    'Compliance',
    'Performance',
    'Autenticação',
    'Transferências',
    'Pagamentos',
    'Onboarding',
    'API',
    'Mobile',
    'Web'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-orange-600 hover:bg-orange-700">
          <Plus className="w-4 h-4" />
          Adicionar Test Case
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Test Case</DialogTitle>
          <DialogDescription>
            Defina um caso de teste detalhado com passos e resultado esperado
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Categoria */}
          <div>
            <Label htmlFor="category" className="text-sm font-medium text-slate-900">
              Categoria <span className="text-red-500">*</span>
            </Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Ex: Security, Compliance, Performance..."
              className="mt-1.5"
              required
            />
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {categoryPresets.map((cat) => (
                <Badge
                  key={cat}
                  variant="outline"
                  className="cursor-pointer hover:bg-orange-50 text-xs"
                  onClick={() => setFormData({ ...formData, category: cat })}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          {/* Nome do Test Case */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-slate-900">
              Nome do Test Case <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Validar proteção anti-spoofing biométrico"
              className="mt-1.5"
              required
            />
          </div>

          {/* Prioridade e Tipo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority" className="text-sm font-medium text-slate-900">
                Prioridade <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.priority} 
                onValueChange={(value: any) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">🔴 Critical</SelectItem>
                  <SelectItem value="High">🟠 High</SelectItem>
                  <SelectItem value="Medium">🟡 Medium</SelectItem>
                  <SelectItem value="Low">🟢 Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="type" className="text-sm font-medium text-slate-900">
                Tipo de Teste <span className="text-red-500">*</span>
              </Label>
              <Select 
                value={formData.type} 
                onValueChange={(value: any) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Security">🔒 Security</SelectItem>
                  <SelectItem value="Compliance">📋 Compliance</SelectItem>
                  <SelectItem value="Performance">⚡ Performance</SelectItem>
                  <SelectItem value="Functional">⚙️ Functional</SelectItem>
                  <SelectItem value="Integration">🔗 Integration</SelectItem>
                  <SelectItem value="E2E">🎯 E2E</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Passos do Teste */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-slate-900">
                📝 Passos do Teste <span className="text-red-500">*</span>
              </Label>
              <Button 
                type="button" 
                size="sm" 
                variant="outline" 
                onClick={addStep}
                className="h-7 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Adicionar Passo
              </Button>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Descreva cada passo do teste de forma clara e sequencial.
            </p>
            <div className="space-y-2">
              {formData.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex items-center justify-center w-6 h-9 text-xs text-slate-500 font-medium flex-shrink-0">
                    {index + 1}.
                  </div>
                  <Input
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    placeholder={`Passo ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.steps.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeStep(index)}
                      className="h-9 w-9 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Resultado Esperado */}
          <div>
            <Label htmlFor="expectedResult" className="text-sm font-medium text-slate-900">
              ✅ Resultado Esperado <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="expectedResult"
              value={formData.expectedResult}
              onChange={(e) => setFormData({ ...formData, expectedResult: e.target.value })}
              placeholder="Ex: Sistema rejeita foto e vídeo, exige liveness real, cria log de tentativa de spoofing"
              className="mt-1.5 min-h-[80px]"
              required
            />
          </div>

          {/* Preview */}
          {formData.steps.some(s => s.trim() !== '') && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <p className="text-xs font-medium text-orange-900 mb-2">📋 Preview do Test Case</p>
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-orange-900 mb-1">Passos:</p>
                  <ol className="space-y-1">
                    {formData.steps
                      .filter(s => s.trim() !== '')
                      .map((step, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-orange-700">
                          <span className="font-medium min-w-[1.5rem]">{idx + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                  </ol>
                </div>
                {formData.expectedResult && (
                  <div className="pt-2 border-t border-orange-200">
                    <p className="text-xs font-medium text-orange-900 mb-1">Resultado Esperado:</p>
                    <p className="text-sm text-orange-700">{formData.expectedResult}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700">
              Criar Test Case
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
