import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { objectService } from '@/services/hierarchy/objectService';
import { toast } from '@/hooks/use-toast';
import { ObjectType, BuildPhase } from '@/types/hierarchy';

interface NewObjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onObjectAdded: () => void;
  complexId?: string; // Add optional complexId
}

export const NewObjectDialog = ({ 
  isOpen, 
  onClose, 
  projectId, 
  projectName, 
  onObjectAdded,
  complexId = 'default' // Provide a default value
}: NewObjectDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    objectType: 'woning' as ObjectType,
    address: '',
    city: '',
    postalCode: '',
    capacity: '',
    buildPhase: 'voorbereiding' as BuildPhase
  });
  
  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.address || !formData.city || !formData.postalCode) {
      toast({
        title: "Vul alle vereiste velden in",
        description: "Vul minimaal naam, adres, plaats en postcode in",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await objectService.addObject({
        name: formData.name,
        objectType: formData.objectType,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        projectId: projectId,
        complexId: complexId,
        buildPhase: formData.buildPhase
        // Removed the capacity field as it's not part of the HierarchyObject interface
      });
      
      toast({
        title: "Object toegevoegd",
        description: `${formData.name} is succesvol toegevoegd aan ${projectName}`
      });
      
      onObjectAdded();
      
      // Reset form data
      setFormData({
        name: '',
        objectType: 'woning',
        address: '',
        city: '',
        postalCode: '',
        capacity: '',
        buildPhase: 'voorbereiding'
      });
    } catch (error) {
      console.error('Error adding object:', error);
      toast({
        title: "Fout bij toevoegen",
        description: "Er is een fout opgetreden bij het toevoegen van het object.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Nieuw Object Toevoegen</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Naam object *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Bijv. Woning 01 of Techniekruimte"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="objectType">Type object *</Label>
              <Select 
                value={formData.objectType} 
                onValueChange={(value) => handleChange('objectType', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="woning">Woning</SelectItem>
                  <SelectItem value="utiliteit">Utiliteit</SelectItem>
                  <SelectItem value="installatie">Installatie</SelectItem>
                  <SelectItem value="techniek">Techniek</SelectItem>
                  <SelectItem value="bouwvoorziening">Bouwvoorziening</SelectItem>
                  <SelectItem value="overig">Overig</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Adres *</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Straatnaam en huisnummer"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postcode *</Label>
              <Input
                id="postalCode"
                value={formData.postalCode}
                onChange={(e) => handleChange('postalCode', e.target.value)}
                placeholder="1234 AB"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">Plaats *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => handleChange('city', e.target.value)}
                placeholder="Plaatsnaam"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="capacity">Capaciteitsindicatie</Label>
            <Input
              id="capacity"
              value={formData.capacity}
              onChange={(e) => handleChange('capacity', e.target.value)}
              placeholder="Bijv. 3x25A of G4"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="buildPhase">Fase binnen bouw</Label>
            <Select 
              value={formData.buildPhase} 
              onValueChange={(value) => handleChange('buildPhase', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecteer fase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="voorbereiding">Voorbereiding</SelectItem>
                <SelectItem value="ontwikkeling">Ontwikkeling</SelectItem>
                <SelectItem value="uitvoering">Uitvoering</SelectItem>
                <SelectItem value="oplevering">Oplevering</SelectItem>
                <SelectItem value="beheer">Beheer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Annuleren</Button>
            <Button type="submit" disabled={isSubmitting} className="bg-cedrus-accent hover:bg-cedrus-accent/90">
              {isSubmitting ? 'Bezig met opslaan...' : 'Object Toevoegen'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
