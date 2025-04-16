import { User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { type OrganizationWithDeletionInfo } from '@/services/organizations';

interface OrganizationContactFormProps {
  organization: OrganizationWithDeletionInfo;
  onUpdate: (updatedData: Partial<OrganizationWithDeletionInfo>) => Promise<void>;
}

export function OrganizationContactForm({ organization, onUpdate }: OrganizationContactFormProps) {
  const [formData, setFormData] = useState({
    ownerName: organization.ownerName || '',
    ownerEmail: organization.ownerEmail || '',
    ownerPhone: organization.ownerPhone || ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await onUpdate({
        ownerName: formData.ownerName,
        ownerEmail: formData.ownerEmail,
        ownerPhone: formData.ownerPhone
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
          <User className="h-5 w-5 text-cedrus-accent" />
          Contact gegevens
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ownerName">Contactpersoon</Label>
            <Input
              id="ownerName"
              name="ownerName"
              value={formData.ownerName || ''}
              onChange={handleChange}
              placeholder="Naam contactpersoon"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ownerEmail">Email</Label>
            <Input
              id="ownerEmail"
              name="ownerEmail"
              type="email"
              value={formData.ownerEmail || ''}
              onChange={handleChange}
              placeholder="Email adres"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ownerPhone">Telefoon</Label>
            <Input
              id="ownerPhone"
              name="ownerPhone"
              value={formData.ownerPhone || ''}
              onChange={handleChange}
              placeholder="Telefoonnummer"
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
