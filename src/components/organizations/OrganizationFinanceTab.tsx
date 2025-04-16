
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, ClockIcon } from 'lucide-react';
import type { OrganizationWithDeletionInfo } from '@/services/organizations';

interface OrganizationFinanceTabProps {
  organization: OrganizationWithDeletionInfo;
  onUpdate: (data: Partial<OrganizationWithDeletionInfo>) => Promise<void>;
}

export function OrganizationFinanceTab({
  organization,
  onUpdate
}: OrganizationFinanceTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    invoiceName: organization.invoiceName || '',
    invoiceAddress: organization.invoiceAddress || '',
    invoiceCity: organization.invoiceCity || '',
    invoicePostalCode: organization.invoicePostalCode || '',
    iban: organization.iban || '',
    bic: organization.bic || '',
    vatNumber: organization.vatNumber || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onUpdate(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating financial information:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      invoiceName: organization.invoiceName || '',
      invoiceAddress: organization.invoiceAddress || '',
      invoiceCity: organization.invoiceCity || '',
      invoicePostalCode: organization.invoicePostalCode || '',
      iban: organization.iban || '',
      bic: organization.bic || '',
      vatNumber: organization.vatNumber || '',
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Facturatie Gegevens</CardTitle>
          <div className="space-x-2">
            {isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancelEdit}
                  disabled={isSubmitting}
                >
                  Annuleren
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <ClockIcon className="mr-2 h-4 w-4 animate-spin" />
                      Opslaan...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Opslaan
                    </>
                  )}
                </Button>
              </>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
              >
                Bewerken
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="invoiceName">Factuurnaam</Label>
                  <Input
                    id="invoiceName"
                    name="invoiceName"
                    value={formData.invoiceName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vatNumber">BTW Nummer</Label>
                  <Input
                    id="vatNumber"
                    name="vatNumber"
                    value={formData.vatNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="invoiceAddress">Facturatieadres</Label>
                  <Input
                    id="invoiceAddress"
                    name="invoiceAddress"
                    value={formData.invoiceAddress}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="invoiceCity">Plaats</Label>
                  <Input
                    id="invoiceCity"
                    name="invoiceCity"
                    value={formData.invoiceCity}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="invoicePostalCode">Postcode</Label>
                  <Input
                    id="invoicePostalCode"
                    name="invoicePostalCode"
                    value={formData.invoicePostalCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="iban">IBAN</Label>
                  <Input
                    id="iban"
                    name="iban"
                    value={formData.iban}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bic">BIC</Label>
                  <Input
                    id="bic"
                    name="bic"
                    value={formData.bic}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Factuurnaam</h3>
                  <p>{organization.invoiceName || 'Niet ingesteld'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">BTW Nummer</h3>
                  <p>{organization.vatNumber || 'Niet ingesteld'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Facturatieadres</h3>
                  <p>{organization.invoiceAddress || 'Niet ingesteld'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Plaats</h3>
                  <p>{organization.invoiceCity || 'Niet ingesteld'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Postcode</h3>
                  <p>{organization.invoicePostalCode || 'Niet ingesteld'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">IBAN</h3>
                  <p>{organization.iban || 'Niet ingesteld'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">BIC</h3>
                  <p>{organization.bic || 'Niet ingesteld'}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
