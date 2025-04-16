
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ClockIcon, AlertTriangle, Check, Trash2, Upload } from 'lucide-react';
import { formatDate, formatDateTime } from '@/utils/dateUtils';
import type { OrganizationWithDeletionInfo } from '@/services/organizations';

interface OrganizationInfoTabProps {
  organization: OrganizationWithDeletionInfo;
  onUpdate: (data: Partial<OrganizationWithDeletionInfo>) => Promise<void>;
  onDelete: () => void;
  onCancelDeletion: () => Promise<void>;
  onMandateUpload: (file: File) => Promise<void>;
}

export function OrganizationInfoTab({
  organization,
  onUpdate,
  onDelete,
  onCancelDeletion,
  onMandateUpload
}: OrganizationInfoTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: organization.name,
    description: organization.description || '',
    address: organization.address || '',
    city: organization.city || '',
    kvkNumber: organization.kvkNumber || '',
    ownerName: organization.ownerName || '',
    ownerEmail: organization.ownerEmail || '',
    ownerPhone: organization.ownerPhone || '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      console.error('Error updating organization:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      name: organization.name,
      description: organization.description || '',
      address: organization.address || '',
      city: organization.city || '',
      kvkNumber: organization.kvkNumber || '',
      ownerName: organization.ownerName || '',
      ownerEmail: organization.ownerEmail || '',
      ownerPhone: organization.ownerPhone || '',
    });
    setIsEditing(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onMandateUpload(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Deletion Warning */}
      {organization.pendingDeletion && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Verwijdering gepland</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>
              Deze organisatie is gemarkeerd voor verwijdering op{' '}
              {formatDateTime(organization.scheduledDeletionTime)}
            </span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onCancelDeletion}
            >
              Annuleren
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Basic Organization Information Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Organisatie Informatie</CardTitle>
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
                  <Label htmlFor="name">Naam</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kvkNumber">KvK Nummer</Label>
                  <Input
                    id="kvkNumber"
                    name="kvkNumber"
                    value={formData.kvkNumber}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Beschrijving</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Plaats</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Naam</h3>
                  <p>{organization.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">KvK Nummer</h3>
                  <p>{organization.kvkNumber || 'Niet ingesteld'}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Beschrijving</h3>
                <p className="whitespace-pre-wrap">{organization.description || 'Geen beschrijving'}</p>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Adres</h3>
                  <p>{organization.address || 'Niet ingesteld'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Plaats</h3>
                  <p>{organization.city || 'Niet ingesteld'}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contact Information Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Contact Informatie</CardTitle>
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
                  <Label htmlFor="ownerName">Contactpersoon</Label>
                  <Input
                    id="ownerName"
                    name="ownerName"
                    value={formData.ownerName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerEmail">E-mail</Label>
                  <Input
                    id="ownerEmail"
                    name="ownerEmail"
                    type="email"
                    value={formData.ownerEmail}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ownerPhone">Telefoon</Label>
                  <Input
                    id="ownerPhone"
                    name="ownerPhone"
                    value={formData.ownerPhone}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Contactpersoon</h3>
                  <p>{organization.ownerName || 'Niet ingesteld'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">E-mail</h3>
                  <p>{organization.ownerEmail || 'Niet ingesteld'}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Telefoon</h3>
                  <p>{organization.ownerPhone || 'Niet ingesteld'}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mandate Upload Card */}
      <Card>
        <CardHeader>
          <CardTitle>Machtiging</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Machtigingsstatus</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {organization.hasMandate 
                    ? 'Machtiging is aanwezig' 
                    : 'Geen machtiging aanwezig'}
                </p>
              </div>
              <div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => document.getElementById('mandateUpload')?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Machtiging
                </Button>
                <input
                  id="mandateUpload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileUpload}
                />
              </div>
            </div>
            
            {organization.mandateFilePath && (
              <div>
                <h3 className="text-sm font-medium">Huidige machtiging</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {organization.mandateFilePath.split('/').pop()}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone Card */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">Gevaarlijke acties</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Verwijder deze organisatie</h3>
              <p className="text-sm text-muted-foreground mt-1">
                De organisatie wordt na 30 dagen permanent verwijderd.
              </p>
            </div>
            <Button 
              variant="destructive" 
              onClick={onDelete}
              disabled={organization.pendingDeletion}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              {organization.pendingDeletion ? 'Gepland voor verwijdering' : 'Verwijderen'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
