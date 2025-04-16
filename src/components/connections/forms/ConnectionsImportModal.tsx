
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { Upload, File, AlertCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ConnectionImportData {
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

interface ConnectionsImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (connections: ConnectionImportData[]) => void;
}

export function ConnectionsImportModal({ isOpen, onClose, onImport }: ConnectionsImportModalProps) {
  const [importMethod, setImportMethod] = useState<'excel' | 'csv' | 'json'>('excel');
  const [isUploading, setIsUploading] = useState(false);
  const [fileData, setFileData] = useState<ConnectionImportData[]>([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    setIsUploading(true);
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        const result = event.target?.result;
        
        if (typeof result === 'string') {
          if (importMethod === 'json') {
            const parsedData = JSON.parse(result);
            validateAndProcessImport(parsedData);
          } else if (importMethod === 'csv') {
            const workbook = XLSX.read(result, { type: 'string' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const parsedData = XLSX.utils.sheet_to_json(worksheet);
            validateAndProcessImport(parsedData);
          }
        } else if (result instanceof ArrayBuffer) {
          const workbook = XLSX.read(result, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const parsedData = XLSX.utils.sheet_to_json(worksheet);
          validateAndProcessImport(parsedData);
        }
      } catch (error) {
        console.error("Error parsing file:", error);
        setError('Kon het bestand niet verwerken. Controleer of het bestand het juiste formaat heeft.');
      } finally {
        setIsUploading(false);
      }
    };
    
    reader.onerror = () => {
      setError('Fout bij het lezen van het bestand.');
      setIsUploading(false);
    };
    
    if (importMethod === 'json' || importMethod === 'csv') {
      reader.readAsText(file);
    } else {
      reader.readAsArrayBuffer(file);
    }
  };
  
  const validateAndProcessImport = (data: any) => {
    if (!Array.isArray(data)) {
      setError('De gegevens moeten in een array staan.');
      return;
    }
    
    if (data.length === 0) {
      setError('Geen gegevens gevonden in het bestand.');
      return;
    }
    
    // Map the data to our expected format
    const mappedData: ConnectionImportData[] = data.map((item, index) => {
      const connection: ConnectionImportData = {
        organizationId: item.organizationId || item.organization_id || '',
        organizationName: item.organizationName || item.organization_name || '',
        entityId: item.entityId || item.entity_id || '',
        entityName: item.entityName || item.entity_name || '',
        projectId: item.projectId || item.project_id || '',
        projectName: item.projectName || item.project_name || '',
        objectId: item.objectId || item.object_id || '',
        objectName: item.objectName || item.object_name || '',
        address: item.address || '',
        city: item.city || '',
        postalCode: item.postalCode || item.postal_code || '',
        type: item.type || 'electricity',
        capacity: item.capacity || '3x25A',
        ean: item.ean || '',
        supplier: item.supplier || '',
        meterType: item.meterType || item.meter_type || 'smart',
        meterReading: item.meterReading || item.meter_reading || '',
        status: item.status || 'Actief',
        gridOperator: item.gridOperator || item.grid_operator || 'Liander',
        meteringCompany: item.meteringCompany || item.metering_company || ''
      };
      
      return connection;
    });
    
    // Validate required fields (address, city, postalCode)
    const invalidEntries = mappedData.filter(
      conn => !conn.address || !conn.city || !conn.postalCode
    );
    
    if (invalidEntries.length > 0) {
      setError(`${invalidEntries.length} aansluitingen missen verplichte gegevens (adres, plaats, postcode).`);
    } else {
      setFileData(mappedData);
    }
  };
  
  const handleImport = () => {
    if (fileData.length === 0) {
      setError('Geen geldige gegevens om te importeren.');
      return;
    }
    
    onImport(fileData);
    onClose();
    
    // Reset state for next time
    setFileData([]);
    setFileName('');
    setError('');
  };
  
  const getAcceptFileTypes = () => {
    switch (importMethod) {
      case 'excel':
        return '.xlsx,.xls';
      case 'csv':
        return '.csv';
      case 'json':
        return '.json';
      default:
        return '.xlsx,.xls,.csv,.json';
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Aansluitingen importeren</DialogTitle>
          <DialogDescription>
            Upload een bestand met aansluitingsgegevens om meerdere aansluitingen tegelijk toe te voegen.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="excel" value={importMethod} onValueChange={(v) => setImportMethod(v as any)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="excel">Excel bestand</TabsTrigger>
            <TabsTrigger value="csv">CSV bestand</TabsTrigger>
            <TabsTrigger value="json">JSON bestand</TabsTrigger>
          </TabsList>
          
          <TabsContent value="excel" className="space-y-4">
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm mb-2">
                Upload een Excel bestand (.xlsx, .xls) met aansluitingsgegevens
              </p>
              <Input 
                type="file" 
                accept=".xlsx,.xls" 
                className="hidden" 
                id="excel-upload"
                onChange={handleFileUpload}
              />
              <Button asChild variant="outline">
                <label htmlFor="excel-upload" className="cursor-pointer">
                  Bestand kiezen
                </label>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="csv" className="space-y-4">
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm mb-2">
                Upload een CSV bestand met aansluitingsgegevens
              </p>
              <Input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                id="csv-upload"
                onChange={handleFileUpload}
              />
              <Button asChild variant="outline">
                <label htmlFor="csv-upload" className="cursor-pointer">
                  Bestand kiezen
                </label>
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="json" className="space-y-4">
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm mb-2">
                Upload een JSON bestand met aansluitingsgegevens
              </p>
              <Input 
                type="file" 
                accept=".json" 
                className="hidden" 
                id="json-upload"
                onChange={handleFileUpload}
              />
              <Button asChild variant="outline">
                <label htmlFor="json-upload" className="cursor-pointer">
                  Bestand kiezen
                </label>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        
        {fileName && (
          <div className="flex items-center mt-2 p-2 bg-muted rounded">
            <File className="h-4 w-4 mr-2" />
            <span className="text-sm">{fileName}</span>
            {fileData.length > 0 && (
              <span className="ml-auto text-sm text-muted-foreground">
                {fileData.length} aansluitingen
              </span>
            )}
          </div>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {fileData.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Voorbeeld van gegevens:</p>
            <div className="rounded border p-2 max-h-[120px] overflow-y-auto text-xs">
              <pre className="whitespace-pre-wrap">
                {JSON.stringify(fileData[0], null, 2)}
              </pre>
            </div>
          </div>
        )}
        
        <DialogFooter className="flex justify-between items-center">
          <Button variant="outline" onClick={onClose}>Annuleren</Button>
          <Button 
            onClick={handleImport}
            disabled={isUploading || fileData.length === 0}
          >
            {isUploading ? 'Bezig met uploaden...' : `${fileData.length} aansluitingen importeren`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
