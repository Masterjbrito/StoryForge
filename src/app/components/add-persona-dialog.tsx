import { useState } from 'react';
import { Plus, X } from 'lucide-react';
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

interface AddPersonaDialogProps {
  onAddPersona: (persona: any) => void;
}

export function AddPersonaDialog({ onAddPersona }: AddPersonaDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    goals: ['', '', ''],
    painPoints: ['', '', ''],
    technicalProfile: '',
    usageFrequency: '',
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!formData.name || !formData.description) {
      alert('Nome e descrição são obrigatórios');
      return;
    }

    // Filter empty goals and pain points
    const filteredGoals = formData.goals.filter(g => g.trim() !== '');
    const filteredPainPoints = formData.painPoints.filter(p => p.trim() !== '');

    if (filteredGoals.length === 0) {
      alert('Adicione pelo menos um objetivo');
      return;
    }

    // Create persona object
    const newPersona = {
      id: Date.now(), // Simple ID generation
      name: formData.name,
      description: formData.description,
      goals: filteredGoals,
      painPoints: filteredPainPoints,
      technicalProfile: formData.technicalProfile || 'Não especificado',
      usageFrequency: formData.usageFrequency || 'Não especificado',
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t !== '') : [],
      usedIn: 0
    };

    onAddPersona(newPersona);
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      goals: ['', '', ''],
      painPoints: ['', '', ''],
      technicalProfile: '',
      usageFrequency: '',
      tags: ''
    });
    
    setIsOpen(false);
  };

  const updateGoal = (index: number, value: string) => {
    const newGoals = [...formData.goals];
    newGoals[index] = value;
    setFormData({ ...formData, goals: newGoals });
  };

  const addGoal = () => {
    setFormData({ ...formData, goals: [...formData.goals, ''] });
  };

  const removeGoal = (index: number) => {
    const newGoals = formData.goals.filter((_, i) => i !== index);
    setFormData({ ...formData, goals: newGoals });
  };

  const updatePainPoint = (index: number, value: string) => {
    const newPainPoints = [...formData.painPoints];
    newPainPoints[index] = value;
    setFormData({ ...formData, painPoints: newPainPoints });
  };

  const addPainPoint = () => {
    setFormData({ ...formData, painPoints: [...formData.painPoints, ''] });
  };

  const removePainPoint = (index: number) => {
    const newPainPoints = formData.painPoints.filter((_, i) => i !== index);
    setFormData({ ...formData, painPoints: newPainPoints });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Adicionar Persona
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Nova Persona</DialogTitle>
          <DialogDescription>
            Adicione uma nova persona bancária à biblioteca para reutilizar em projetos futuros
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Nome */}
          <div>
            <Label htmlFor="name" className="text-sm font-medium text-slate-900">
              Nome da Persona <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Cliente Particular Digital"
              className="mt-1.5"
              required
            />
          </div>

          {/* Descrição */}
          <div>
            <Label htmlFor="description" className="text-sm font-medium text-slate-900">
              Descrição <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Ex: Cliente bancário entre 25-45 anos, alta literacia digital, utiliza principalmente canais digitais..."
              className="mt-1.5 min-h-[80px]"
              required
            />
          </div>

          {/* Objetivos */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-slate-900">
                🎯 Objetivos <span className="text-red-500">*</span>
              </Label>
              <Button 
                type="button" 
                size="sm" 
                variant="outline" 
                onClick={addGoal}
                className="h-7 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {formData.goals.map((goal, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={goal}
                    onChange={(e) => updateGoal(index, e.target.value)}
                    placeholder={`Objetivo ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.goals.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removeGoal(index)}
                      className="h-9 w-9 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pain Points */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-sm font-medium text-slate-900">
                ⚠️ Pain Points
              </Label>
              <Button 
                type="button" 
                size="sm" 
                variant="outline" 
                onClick={addPainPoint}
                className="h-7 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Adicionar
              </Button>
            </div>
            <div className="space-y-2">
              {formData.painPoints.map((pain, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={pain}
                    onChange={(e) => updatePainPoint(index, e.target.value)}
                    placeholder={`Pain Point ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.painPoints.length > 1 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => removePainPoint(index)}
                      className="h-9 w-9 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Technical Profile & Usage Frequency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="technicalProfile" className="text-sm font-medium text-slate-900">
                💻 Perfil Técnico
              </Label>
              <Input
                id="technicalProfile"
                value={formData.technicalProfile}
                onChange={(e) => setFormData({ ...formData, technicalProfile: e.target.value })}
                placeholder="Ex: Smartphone iOS/Android"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="usageFrequency" className="text-sm font-medium text-slate-900">
                📊 Frequência de Uso
              </Label>
              <Input
                id="usageFrequency"
                value={formData.usageFrequency}
                onChange={(e) => setFormData({ ...formData, usageFrequency: e.target.value })}
                placeholder="Ex: Diária, Semanal, Mensal"
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags" className="text-sm font-medium text-slate-900">
              🏷️ Tags (separadas por vírgula)
            </Label>
            <Input
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Ex: Mobile, Digital-First, Retail"
              className="mt-1.5"
            />
            {formData.tags && (
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                {formData.tags.split(',').map((tag, index) => {
                  const trimmedTag = tag.trim();
                  return trimmedTag ? (
                    <Badge key={index} variant="outline" className="text-xs">
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
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Criar Persona
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
