import { useState } from 'react';
import { Plus, X, CheckCircle2 } from 'lucide-react';
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

interface AddAcceptanceCriteriaDialogProps {
  onAddCriteria: (criteria: any) => void;
}

export function AddAcceptanceCriteriaDialog({ onAddCriteria }: AddAcceptanceCriteriaDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    feature: '',
    criteria: ['', '', '']
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.category || !formData.feature) {
      alert('Categoria e nome da feature são obrigatórios');
      return;
    }

    const filteredCriteria = formData.criteria.filter(c => c.trim() !== '');

    if (filteredCriteria.length === 0) {
      alert('Adicione pelo menos um critério de aceitação');
      return;
    }

    const newCriteria = {
      id: Date.now(),
      category: formData.category,
      feature: formData.feature,
      criteria: filteredCriteria,
      usedIn: 0
    };

    onAddCriteria(newCriteria);
    
    setFormData({
      category: '',
      feature: '',
      criteria: ['', '', '']
    });
    
    setIsOpen(false);
  };

  const updateCriterion = (index: number, value: string) => {
    const newCriteria = [...formData.criteria];
    newCriteria[index] = value;
    setFormData({ ...formData, criteria: newCriteria });
  };

  const addCriterion = () => {
    setFormData({ ...formData, criteria: [...formData.criteria, ''] });
  };

  const removeCriterion = (index: number) => {
    const newCriteria = formData.criteria.filter((_, i) => i !== index);
    setFormData({ ...formData, criteria: newCriteria });
  };

  const categoryPresets = [
    'Autenticação',
    'Transferências',
    'Pagamentos',
    'Cartões',
    'Investimentos',
    'Crédito',
    'Onboarding',
    'Notificações',
    'Relatórios'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4" />
          Adicionar Acceptance Criteria
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Acceptance Criteria</DialogTitle>
          <DialogDescription>
            Defina critérios de aceitação claros e testáveis para features bancárias
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
              placeholder="Ex: Autenticação, Transferências, Pagamentos..."
              className="mt-1.5"
              required
            />
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {categoryPresets.map((cat) => (
                <Badge
                  key={cat}
                  variant="outline"
                  className="cursor-pointer hover:bg-green-50 text-xs"
                  onClick={() => setFormData({ ...formData, category: cat })}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          {/* Feature Name */}
          <div>
            <Label htmlFor="feature" className="text-sm font-medium text-slate-900">
              Nome da Feature <span className="text-red-500">*</span>
            </Label>
            <Input
              id="feature"
              value={formData.feature}
              onChange={(e) => setFormData({ ...formData, feature: e.target.value })}
              placeholder="Ex: Login Biométrico, Transferência SEPA, Pagamento MB Way"
              className="mt-1.5"
              required
            />
          </div>

          {/* Acceptance Criteria */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-slate-900">
                ✅ Critérios de Aceitação <span className="text-red-500">*</span>
              </Label>
              <Button 
                type="button" 
                size="sm" 
                variant="outline" 
                onClick={addCriterion}
                className="h-7 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Adicionar Critério
              </Button>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Defina critérios mensuráveis, específicos e testáveis. Use formato "Given-When-Then" ou afirmações diretas.
            </p>
            <div className="space-y-2">
              {formData.criteria.map((criterion, index) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="flex items-center justify-center w-6 h-9 text-xs text-slate-500 font-medium flex-shrink-0">
                    {index + 1}.
                  </div>
                  <Textarea
                    value={criterion}
                    onChange={(e) => updateCriterion(index, e.target.value)}
                    placeholder={`Critério ${index + 1} - Ex: Sistema reconhece Face ID ou Touch ID do dispositivo`}
                    className="flex-1 min-h-[60px]"
                  />
                  {formData.criteria.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeCriterion(index)}
                      className="h-9 w-9 p-0 mt-1"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preview */}
          {formData.criteria.some(c => c.trim() !== '') && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-xs font-medium text-green-900 mb-2">📋 Preview dos Critérios</p>
              <ul className="space-y-1">
                {formData.criteria
                  .filter(c => c.trim() !== '')
                  .map((criterion, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-green-700">
                      <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{criterion}</span>
                    </li>
                  ))}
              </ul>
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
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              Criar Acceptance Criteria
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
