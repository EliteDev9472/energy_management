
import { CreditCard, Building } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { type OrganizationWithDeletionInfo } from '@/services/organizations';

interface OrganizationBillingFormProps {
  organization: OrganizationWithDeletionInfo;
  onUpdate: (updatedData: Partial<OrganizationWithDeletionInfo>) => Promise<void>;
}

export function OrganizationBillingForm({ organization, onUpdate }: OrganizationBillingFormProps) {
  const [formData, setFormData] = useState({
    invoiceName: organization.invoiceName || '',
    invoiceAddress: organization.invoiceAddress || '',
    invoiceCity: organization.invoiceCity || '',
    invoicePostalCode: organization.invoicePostalCode || '',
    iban: organization.iban || '',
    bic: organization.bic || '',
    vatNumber: organization.vatNumber || ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  // Update local state when organization prop changes
  useEffect(() => {
    setFormData({
      invoiceName: organization.invoiceName || '',
      invoiceAddress: organization.invoiceAddress || '',
      invoiceCity: organization.invoiceCity || '',
      invoicePostalCode: organization.invoicePostalCode || '',
      iban: organization.iban || '',
      bic: organization.bic || '',
      vatNumber: organization.vatNumber || ''
    });
  }, [organization]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setHasChanges(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log("Submitting billing data:", formData);
    
    try {
      await onUpdate({
        invoiceName: formData.invoiceName,
        invoiceAddress: formData.invoiceAddress,
        invoiceCity: formData.invoiceCity,
        invoicePostalCode: formData.invoicePostalCode,
        iban: formData.iban,
        bic: formData.bic,
        vatNumber: formData.vatNumber
      });
      setHasChanges(false);
    } catch (error) {
      console.error("Error saving billing information:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-cedrus-accent" />
          Facturatie gegevens
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceName">Facturatie naam</Label>
            <Input
              id="invoiceName"
              name="invoiceName"
              value={formData.invoiceName}
              onChange={handleChange}
              placeholder="Naam voor facturen"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="invoiceAddress">Facturatie adres</Label>
            <Input
              id="invoiceAddress"
              name="invoiceAddress"
              value={formData.invoiceAddress}
              onChange={handleChange}
              placeholder="Straat en huisnummer"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="invoicePostalCode">Postcode</Label>
              <Input
                id="invoicePostalCode"
                name="invoicePostalCode"
                value={formData.invoicePostalCode}
                onChange={handleChange}
                placeholder="Postcode"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="invoiceCity">Plaats</Label>
              <Input
                id="invoiceCity"
                name="invoiceCity"
                value={formData.invoiceCity}
                onChange={handleChange}
                placeholder="Plaats"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vatNumber">BTW nummer</Label>
            <Input
              id="vatNumber"
              name="vatNumber"
              value={formData.vatNumber}
              onChange={handleChange}
              placeholder="BTW nummer"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="iban">IBAN</Label>
            <Input
              id="iban"
              name="iban"
              value={formData.iban}
              onChange={handleChange}
              placeholder="IBAN rekeningnummer"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bic">BIC</Label>
            <Input
              id="bic"
              name="bic"
              value={formData.bic}
              onChange={handleChange}
              placeholder="BIC/SWIFT code"
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
