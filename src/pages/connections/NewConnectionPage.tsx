import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { CapacitySelector } from '@/components/connections/forms/CapacitySelector';
import { ConnectionTypeSelector } from '@/components/connections/forms/ConnectionTypeSelector';
import { MeterTypeSelector } from '@/components/connections/forms/MeterTypeSelector';
import { ConnectionStatusSelector } from '@/components/connections/forms/ConnectionStatusSelector';
import { HierarchyBreadcrumb } from '@/components/connections/forms/HierarchyBreadcrumb';
import { ArrowLeft, Plus, Download, Upload, X, Eye, Copy, Home, MapPin, Gauge, Zap, Building, BadgeCheck, Tag } from 'lucide-react';
import { Connection } from '@/types/connection';
import { ConnectionsImportModal } from '@/components/connections/forms/ConnectionsImportModal';
import { hierarchicalConnectionService } from '@/services/connections/hierarchicalConnectionService';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { EanCodeLookup } from '@/components/connections/forms/EanCodeLookup';
import { EanCodeInfo } from '@/utils/eanUtils';

interface ConnectionFormData {
  organizationId: string;
  organizationName: string;
  entityId: string;
  entityName: string;
  projectId: string;
  projectName: string;
  objectId: string;
  objectName: string;
  address: string;
  city: string;
  postalCode: string;
  type: string;
  capacity: string;
  ean: string;
  supplier: string;
  meterType: string;
  meterReading: string;
  status: string;
  gridOperator: string;
  meteringCompany: string;
  id?: string;
}

const emptyFormData = (): ConnectionFormData => ({
  organizationId: '',
  organizationName: '',
  entityId: '',
  entityName: '',
  projectId: '',
  projectName: '',
  objectId: '',
  objectName: '',
  address: '',
  city: '',
  postalCode: '',
  type: 'electricity',
  capacity: '3x25A',
  ean: '',
  supplier: '',
  meterType: 'smart',
  meterReading: '',
  status: 'Actief',
  gridOperator: 'Liander',
  meteringCompany: ''
});

export default function NewConnectionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const preSelectedObjectId = queryParams.get('objectId') || '';
  const preSelectedObjectName = queryParams.get('objectName') || '';
  const preSelectedProjectId = queryParams.get('projectId') || '';
  const preSelectedProjectName = queryParams.get('projectName') || '';
  const preSelectedOrganizationId = queryParams.get('organizationId') || '';
  const preSelectedOrganizationName = queryParams.get('organizationName') || '';
  const preSelectedEntityId = queryParams.get('entityId') || '';
  const preSelectedEntityName = queryParams.get('entityName') || '';
  const preSelectedType = queryParams.get('connectionType') || 'electricity';

  const [connectionForms, setConnectionForms] = useState<ConnectionFormData[]>([{
    ...emptyFormData(),
    organizationId: preSelectedOrganizationId,
    organizationName: preSelectedOrganizationName,
    entityId: preSelectedEntityId,
    entityName: preSelectedEntityName,
    projectId: preSelectedProjectId,
    projectName: preSelectedProjectName,
    objectId: preSelectedObjectId,
    objectName: preSelectedObjectName,
    type: preSelectedType,
    id: '1'
  }]);

  const [activeFormIndex, setActiveFormIndex] = useState(0);

  const handleChange = (field: string, value: string, index: number = activeFormIndex) => {
    setConnectionForms(prev => {
      const newForms = [...prev];

      const updatedForm = { ...newForms[index], [field]: value };

      if (field === 'type') {
        if (value === 'electricity') {
          updatedForm.capacity = '3x25A';
        } else if (value === 'gas') {
          updatedForm.capacity = 'G4';
        } else if (value === 'water') {
          updatedForm.capacity = 'Q3-2.5';
        } else if (value === 'heat') {
          updatedForm.capacity = 'klein';
        }
      }

      newForms[index] = updatedForm;
      return newForms;
    });
  };

  const handleHierarchyChange = (level: string, id: string, name: string, index: number = activeFormIndex) => {
    setConnectionForms(prev => {
      const newForms = [...prev];

      switch (level) {
        case 'organization':
          newForms[index] = {
            ...newForms[index],
            organizationId: id,
            organizationName: name,
            entityId: '',
            entityName: '',
            projectId: '',
            projectName: '',
            objectId: '',
            objectName: ''
          };
          break;
        case 'entity':
          newForms[index] = {
            ...newForms[index],
            entityId: id,
            entityName: name,
            projectId: '',
            projectName: '',
            objectId: '',
            objectName: ''
          };
          break;
        case 'project':
          newForms[index] = {
            ...newForms[index],
            projectId: id,
            projectName: name,
            objectId: '',
            objectName: ''
          };
          break;
        case 'object':
          newForms[index] = {
            ...newForms[index],
            objectId: id,
            objectName: name
          };
          break;
      }

      return newForms;
    });
  };

  const handleEanCodeFound = (info: EanCodeInfo, index: number = activeFormIndex) => {
    setConnectionForms(prev => {
      const newForms = [...prev];
      const currentForm = { ...newForms[index] };

      const currentType = currentForm.type;

      currentForm.address = info.address;
      currentForm.city = info.city;
      currentForm.postalCode = info.postalCode;
      currentForm.gridOperator = info.gridOperator;

      if (info.connectionType.toLowerCase() === currentType) {
        currentForm.capacity = info.capacity;
      }

      newForms[index] = currentForm;
      return newForms;
    });

    toast({
      title: "EAN code gevonden",
      description: "Adresgegevens zijn automatisch ingevuld.",
    });
  };

  const addNewConnection = () => {
    const currentForm = connectionForms[activeFormIndex];

    const newForm: ConnectionFormData = {
      ...emptyFormData(),
      organizationId: currentForm.organizationId,
      organizationName: currentForm.organizationName,
      entityId: currentForm.entityId,
      entityName: currentForm.entityName,
      projectId: currentForm.projectId,
      projectName: currentForm.projectName,
      objectId: currentForm.objectId,
      objectName: currentForm.objectName,
      id: Date.now().toString()
    };

    setConnectionForms(prev => [...prev, newForm]);

    setTimeout(() => {
      setActiveFormIndex(connectionForms.length);
      document.getElementById('new-connection-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const removeConnection = (index: number) => {
    if (connectionForms.length === 1) {
      toast({
        title: "Kan niet verwijderen",
        description: "Er moet minimaal één aansluiting zijn",
        variant: "destructive"
      });
      return;
    }

    setConnectionForms(prev => prev.filter((_, i) => i !== index));

    if (activeFormIndex >= index && activeFormIndex > 0) {
      setActiveFormIndex(activeFormIndex - 1);
    }
  };

  const duplicateConnection = (index: number) => {
    const formToDuplicate = connectionForms[index];

    const duplicatedForm: ConnectionFormData = {
      ...formToDuplicate,
      id: Date.now().toString(),
      ean: ''
    };

    setConnectionForms(prev => [...prev, duplicatedForm]);

    setTimeout(() => {
      setActiveFormIndex(connectionForms.length);
      document.getElementById('new-connection-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const switchToForm = (index: number) => {
    setActiveFormIndex(index);
    document.getElementById('new-connection-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleImportedConnections = (importedData: ConnectionFormData[]) => {
    const hierarchyInfo = connectionForms[0];

    const processedImports = importedData.map(form => ({
      ...form,
      organizationId: form.organizationId || hierarchyInfo.organizationId,
      organizationName: form.organizationName || hierarchyInfo.organizationName,
      entityId: form.entityId || hierarchyInfo.entityId,
      entityName: form.entityName || hierarchyInfo.entityName,
      projectId: form.projectId || hierarchyInfo.projectId,
      projectName: form.projectName || hierarchyInfo.projectName,
      objectId: form.objectId || hierarchyInfo.objectId,
      objectName: form.objectName || hierarchyInfo.objectName,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 11)
    }));

    setConnectionForms(prev => [...prev, ...processedImports]);

    setTimeout(() => {
      setActiveFormIndex(connectionForms.length);
      document.getElementById('new-connection-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    toast({
      title: "Import succesvol",
      description: `${processedImports.length} aansluitingen geïmporteerd`
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validationErrors = connectionForms.map((form, index) => {
        if (!form.objectId) {
          return {
            index,
            message: "Een aansluiting moet aan een object gekoppeld zijn"
          };
        }

        if (!form.address || !form.city || !form.postalCode) {
          return {
            index,
            message: "Adresgegevens ontbreken"
          };
        }

        if (!form.ean || form.ean.trim() === '') {
          return {
            index,
            message: "EAN code is verplicht en mag niet leeg zijn"
          };
        }

        return null;
      }).filter(error => error !== null);

      if (validationErrors.length > 0) {
        const firstError = validationErrors[0]!;
        setActiveFormIndex(firstError.index);

        toast({
          title: `Fout in aansluiting ${firstError.index + 1}`,
          description: firstError.message,
          variant: "destructive",
        });

        setIsSubmitting(false);
        return;
      }

      let successCount = 0;

      for (let i = 0; i < connectionForms.length; i++) {
        const form = connectionForms[i];

        const connectionData: Partial<Connection> = {
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          ean: form.ean,
          type: form.type as any,
          status: form.status as any,
          supplier: form.supplier,
          gridOperator: form.gridOperator,
          meteringCompany: form.meteringCompany || '',
          capacity: form.capacity,
          meteringType: form.meterType,
          contract: {
            endDate: '',
            price: '',
            startDate: '',
            type: '',
            conditions: ''
          }
        };

        const hierarchyInfo = {
          organization: form.organizationId,
          entity: form.entityId,
          project: form.projectId,
          complex: form.complexId,
          object: form.objectId
        };

        try {
          const result = await fetch('/api/connections/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              connection: connectionData,
              hierarchy: hierarchyInfo
            }),
          });

          if (result.ok) {
            successCount++;
          }
        } catch (error) {
          console.error(`Error saving connection ${i + 1}:`, error);
        }
      }

      if (successCount > 0) {
        toast({
          title: `${successCount} aansluitingen toegevoegd`,
          description: `${successCount} van de ${connectionForms.length} aansluitingen zijn succesvol toegevoegd.`
        });
        navigate('/connections');
      } else {
        throw new Error("Geen aansluitingen konden worden toegevoegd");
      }
    } catch (error) {
      console.error("Error saving connections:", error);
      toast({
        title: "Fout",
        description: "Er is een fout opgetreden bij het toevoegen van de aansluitingen.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/connections')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Terug
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">Nieuwe aansluiting</h1>
            <p className="text-muted-foreground mt-1">Voeg aansluitingen toe</p>
          </div>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium">Aansluitingen ({connectionForms.length})</h2>
            <p className="text-sm text-muted-foreground">Vul de gegevens in voor alle aansluitingen</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsImportModalOpen(true)}>
              <Upload className="h-4 w-4 mr-2" /> Importeren
            </Button>
            <Button onClick={addNewConnection}>
              <Plus className="h-4 w-4 mr-2" /> Nieuwe aansluiting
            </Button>
          </div>
        </div>

        <ScrollArea className="w-full mb-4" orientation="horizontal">
          <div className="flex space-x-2 min-w-max">
            {connectionForms.map((form, index) => (
              <div
                key={form.id}
                className={`flex items-center ${index === activeFormIndex
                  ? 'bg-cedrus-green text-white'
                  : 'bg-muted hover:bg-muted/80'
                  } rounded-md px-3 py-2 cursor-pointer transition-colors`}
                onClick={() => switchToForm(index)}
              >
                <span className="text-sm mr-1">#{index + 1}</span>
                <span className="text-sm max-w-40 truncate">
                  {form.address || `Aansluiting ${index + 1}`}
                </span>
                <Badge
                  variant="outline"
                  className="ml-2 bg-background/20 text-foreground"
                >
                  {form.type === 'electricity' ? 'Elektra' :
                    form.type === 'gas' ? 'Gas' :
                      form.type === 'water' ? 'Water' : 'Warmte'}
                </Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 ml-1 hover:bg-background/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeConnection(index);
                  }}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Card className="mb-8" id="new-connection-form">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Aansluiting {activeFormIndex + 1}</CardTitle>
              <CardDescription>
                {connectionForms[activeFormIndex].type === 'electricity'
                  ? 'Elektriciteitsaansluiting'
                  : connectionForms[activeFormIndex].type === 'gas'
                    ? 'Gasaansluiting'
                    : connectionForms[activeFormIndex].type === 'water'
                      ? 'Wateraansluiting'
                      : 'Warmteaansluiting'}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => duplicateConnection(activeFormIndex)}
              >
                <Copy className="h-4 w-4 mr-2" /> Dupliceren
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeConnection(activeFormIndex)}
                disabled={connectionForms.length === 1}
              >
                <X className="h-4 w-4 mr-2" /> Verwijderen
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-base font-medium flex items-center gap-2">
                  <Home className="h-5 w-5 text-muted-foreground" /> Hiërarchie
                </h3>
                <HierarchyBreadcrumb
                  selectedOrganization={connectionForms[activeFormIndex].organizationId}
                  selectedEntity={connectionForms[activeFormIndex].entityId}
                  selectedProject={connectionForms[activeFormIndex].projectId}
                  selectedComplex={connectionForms[activeFormIndex].complexId || ""}
                  selectedObject={connectionForms[activeFormIndex].objectId}
                  onOrganizationChange={(id, name) => handleHierarchyChange('organization', id, name)}
                  onEntityChange={(id, name) => handleHierarchyChange('entity', id, name)}
                  onProjectChange={(id, name) => handleHierarchyChange('project', id, name)}
                  onComplexChange={(id, name) => handleHierarchyChange('complex', id, name)}
                  onObjectChange={(id, name) => handleHierarchyChange('object', id, name)}
                />
              </div>

              <div>
                <EanCodeLookup
                  value={connectionForms[activeFormIndex].ean}
                  onChange={(value) => handleChange('ean', value)}
                  onCodeFound={(info) => handleEanCodeFound(info, activeFormIndex)}
                />
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-medium flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" /> Adresgegevens
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor={`address-${activeFormIndex}`}>Adres</Label>
                    <Input
                      id={`address-${activeFormIndex}`}
                      value={connectionForms[activeFormIndex].address}
                      onChange={(e) => handleChange('address', e.target.value)}
                      placeholder="Straatnaam en huisnummer"
                      className="mt-1"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`city-${activeFormIndex}`}>Plaats</Label>
                      <Input
                        id={`city-${activeFormIndex}`}
                        value={connectionForms[activeFormIndex].city}
                        onChange={(e) => handleChange('city', e.target.value)}
                        placeholder="Plaatsnaam"
                        className="mt-1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor={`postalCode-${activeFormIndex}`}>Postcode</Label>
                      <Input
                        id={`postalCode-${activeFormIndex}`}
                        value={connectionForms[activeFormIndex].postalCode}
                        onChange={(e) => handleChange('postalCode', e.target.value)}
                        placeholder="1234 AB"
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-medium flex items-center gap-2">
                  <Zap className="h-5 w-5 text-muted-foreground" /> Type & Capaciteit
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ConnectionTypeSelector
                    value={connectionForms[activeFormIndex].type}
                    onChange={(value) => handleChange('type', value)}
                  />

                  <CapacitySelector
                    connectionType={connectionForms[activeFormIndex].type}
                    value={connectionForms[activeFormIndex].capacity}
                    onChange={(value) => handleChange('capacity', value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-medium flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-muted-foreground" /> Metergegevens
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <MeterTypeSelector
                    value={connectionForms[activeFormIndex].meterType}
                    onChange={(value) => handleChange('meterType', value)}
                  />

                  <div>
                    <Label htmlFor={`meterReading-${activeFormIndex}`}>Meterstand</Label>
                    <Input
                      id={`meterReading-${activeFormIndex}`}
                      value={connectionForms[activeFormIndex].meterReading}
                      onChange={(e) => handleChange('meterReading', e.target.value)}
                      placeholder="Huidige meterstand"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-medium flex items-center gap-2">
                  <Building className="h-5 w-5 text-muted-foreground" /> Netbeheerder & Leverancier
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor={`gridOperator-${activeFormIndex}`}>Netbeheerder</Label>
                    <Select
                      value={connectionForms[activeFormIndex].gridOperator}
                      onValueChange={(value) => handleChange('gridOperator', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecteer netbeheerder" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Liander">Liander</SelectItem>
                        <SelectItem value="Stedin">Stedin</SelectItem>
                        <SelectItem value="Enexis">Enexis</SelectItem>
                        <SelectItem value="Westland">Westland</SelectItem>
                        <SelectItem value="Coteq">Coteq</SelectItem>
                        <SelectItem value="Rendo">Rendo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`supplier-${activeFormIndex}`}>Leverancier</Label>
                    <Input
                      id={`supplier-${activeFormIndex}`}
                      value={connectionForms[activeFormIndex].supplier}
                      onChange={(e) => handleChange('supplier', e.target.value)}
                      placeholder="Leverancier"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`meteringCompany-${activeFormIndex}`}>Meetbedrijf</Label>
                    <Input
                      id={`meteringCompany-${activeFormIndex}`}
                      value={connectionForms[activeFormIndex].meteringCompany}
                      onChange={(e) => handleChange('meteringCompany', e.target.value)}
                      placeholder="Meetbedrijf"
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-base font-medium flex items-center gap-2">
                  <BadgeCheck className="h-5 w-5 text-muted-foreground" /> Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ConnectionStatusSelector
                    value={connectionForms[activeFormIndex].status}
                    onChange={(value) => handleChange('status', value)}
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="flex justify-center mb-6">
          <Button
            variant="outline"
            onClick={addNewConnection}
            className="w-full max-w-md"
          >
            <Plus className="h-4 w-4 mr-2" /> Nog een aansluiting toevoegen
          </Button>
        </div>

        <div className="sticky bottom-0 w-full bg-background border-t p-4 mt-8">
          <div className="max-w-3xl mx-auto flex justify-between items-center">
            <div>
              <p className="font-medium">Totaal: {connectionForms.length} aansluitingen</p>
              <p className="text-sm text-muted-foreground">
                {connectionForms.filter(f => f.type === 'electricity').length} elektra,
                {' '}{connectionForms.filter(f => f.type === 'gas').length} gas,
                {' '}{connectionForms.filter(f => f.type === 'water').length} water,
                {' '}{connectionForms.filter(f => f.type === 'heat').length} warmte
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/connections')}>
                Annuleren
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                onClick={handleSubmit}
                className="min-w-[180px]"
              >
                {isSubmitting
                  ? 'Bezig met toevoegen...'
                  : `${connectionForms.length} aansluitingen toevoegen`}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <ConnectionsImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportedConnections}
      />
    </PageLayout>
  );
}
