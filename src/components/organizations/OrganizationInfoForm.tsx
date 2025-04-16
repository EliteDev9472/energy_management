import { Building, FileText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type OrganizationWithDeletionInfo } from '@/services/organizations';

interface OrganizationInfoFormProps {
  organization: OrganizationWithDeletionInfo;
  onUpdate: (updatedData: Partial<OrganizationWithDeletionInfo>) => Promise<void>;
}

export function OrganizationInfoForm({ organization, onUpdate }: OrganizationInfoFormProps) {
  const [formData, setFormData] = useState({
    name: organization.name || '',
    kvkNumber: organization.kvkNumber || '',
    address: organization.address || '',
    city: organization.city || '',
    description: organization.description || ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onUpdate({
        name: formData.name,
        kvkNumber: formData.kvkNumber,
        address: formData.address,
        city: formData.city,
        description: formData.description
      });
      setHasChanges(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5 text-cedrus-accent" />
          Organisatie gegevens
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Naam</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Organisatie naam"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="kvkNumber">KVK Nummer</Label>
            <Input
              id="kvkNumber"
              name="kvkNumber"
              value={formData.kvkNumber || ''}
              onChange={handleChange}
              placeholder="Voer KVK nummer in"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Adres</Label>
            <Input
              id="address"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              placeholder="Straat en huisnummer"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="city">Plaats</Label>
            <Input
              id="city"
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              placeholder="Plaats"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Beschrijving</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="Organisatie beschrijving"
              rows={4}
            />
          </div>
          
          {hasChanges && (
            <Button 
              type="submit" 
              className="bg-cedrus-accent hover:bg-cedrus-accent/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Opslaan..." : "Opslaan"}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
