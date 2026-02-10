import { useState } from 'react';
import { Plus, X, BookOpen } from 'lucide-react';
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

interface AddBusinessRuleDialogProps {
  onAddRule: (rule: any) => void;
}

export function AddBusinessRuleDialog({ onAddRule }: AddBusinessRuleDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    name: '',
    rule: '',
    validation: '',
    exceptions: '',
    compliance: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.rule || !formData.category) {
      alert('Categoria, nome e descrição da regra são obrigatórios');
      return;
    }

    const complianceTags = formData.compliance 
      ? formData.compliance.split(',').map(t => t.trim()).filter(t => t !== '')
      : [];

    const newRule = {
      id: Date.now(),
      category: formData.category,
      name: formData.name,
      rule: formData.rule,
      validation: formData.validation || 'Não especificada',
      exceptions: formData.exceptions || 'Sem exceções definidas',
      compliance: complianceTags.length > 0 ? complianceTags : ['General'],
      usedIn: 0
    };

    onAddRule(newRule);
    
    setFormData({
      category: '',
      name: '',
      rule: '',
      validation: '',
      exceptions: '',
      compliance: ''
    });
    
    setIsOpen(false);
  };

  const categoryPresets = [
    'Transferências',
    'Autenticação',
    'Cartões',
    'Onboarding',
    'Pagamentos',
    'Crédito',
    'Investimentos',
    'Compliance',
    'Segurança',
    'Privacidade'
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
          <Plus className="w-4 h-4" />
          Adicionar Regra de Negócio
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Regra de Negócio</DialogTitle>
          <DialogDescription>
            Adicione uma nova regra de negócio bancária validada para reutilizar em projetos futuros
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
              placeholder="Ex: Transferências, Autenticação, Cartões..."
              className="mt-1.5"
              required
            />
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {categoryPresets.map((cat) => (
                <Badge
                  key={cat}
                  variant="outline"
                  className="cursor-pointer hover:bg-purple-50 text-xs"
                  onClick={() => setFormData({ ...formData, category: cat })}
                >
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          {/* Nome */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-slate-900">
              Nome da Regra <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: SCA Obrigatória PSD2"
              className="mt-1.5"
              required
            />
          </div>

          {/* Descrição da Regra */}
          <div>
            <Label htmlFor="rule" className="text-sm font-medium text-slate-900">
              📋 Descrição da Regra <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="rule"
              value={formData.rule}
              onChange={(e) => setFormData({ ...formData, rule: e.target.value })}
              placeholder="Ex: Strong Customer Authentication obrigatória para transações > €30 ou operações sensíveis"
              className="mt-1.5 min-h-[80px]"
              required
            />
          </div>

          {/* Validação */}
          <div>
            <Label htmlFor="validation" className="text-sm font-medium text-slate-900">
              ✅ Lógica de Validação (pseudo-código ou SQL)
            </Label>
            <Textarea
              id="validation"
              value={formData.validation}
              onChange={(e) => setFormData({ ...formData, validation: e.target.value })}
              placeholder="Ex: IF valor > 30 EUR OR operacao_sensivel THEN require_sca()"
              className="mt-1.5 font-mono text-xs min-h-[60px]"
            />
          </div>

          {/* Exceções */}
          <div>
            <Label htmlFor="exceptions" className="text-sm font-medium text-slate-900">
              ⚠️ Exceções e Casos Especiais
            </Label>
            <Textarea
              id="exceptions"
              value={formData.exceptions}
              onChange={(e) => setFormData({ ...formData, exceptions: e.target.value })}
              placeholder="Ex: Isenções: Pagamentos recorrentes trusted, Low-value < 30€ (máx 5 consecutivas)"
              className="mt-1.5 min-h-[60px]"
            />
          </div>

          {/* Compliance Tags */}
          <div>
            <Label htmlFor="compliance" className="text-sm font-medium text-slate-900">
              🛡️ Tags de Compliance (separadas por vírgula)
            </Label>
            <Input
              id="compliance"
              value={formData.compliance}
              onChange={(e) => setFormData({ ...formData, compliance: e.target.value })}
              placeholder="Ex: PSD2, SCA, AML, KYC, GDPR"
              className="mt-1.5"
            />
            {formData.compliance && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {formData.compliance.split(',').map((tag, index) => {
                  const trimmedTag = tag.trim();
                  return trimmedTag ? (
                    <Badge key={index} className="bg-green-50 text-green-700 border-green-200 text-xs">
                      {trimmedTag}
                    </Badge>
                  ) : null;
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Criar Regra
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
