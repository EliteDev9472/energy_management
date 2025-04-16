
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';
import { ObjectType, BuildPhase } from '@/types/hierarchy';
import { objectService } from '@/services/hierarchy/objectService';

interface BatchImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onObjectsAdded: () => void;
}

interface ParsedObject {
  name: string;
  address: string;
  city: string;
  postalCode: string;
  projectId: string;
  objectType: string;
}

export const BatchImportDialog = ({ isOpen, onClose, projectId, projectName, onObjectsAdded }: BatchImportDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedObject[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
    setParsedData([]); // Clear previous data
  };

  const handleParse = () => {
    if (!file) {
      toast({
        title: "Selecteer een bestand",
        description: "Selecteer eerst een Excel-bestand om te verwerken.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (evt: any) => {
      const bstr: string = evt.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      
      // Fix: Use a more specific type to avoid the conversion error
      const jsonData = XLSX.utils.sheet_to_json(ws);
      
      // Assuming the first row contains the headers, extract them
      const headers = Object.keys(jsonData[0] || {});
      
      // Map the data to our expected format
      const parsedObjects = jsonData.map((row: any) => {
        return {
          name: row.name || '',
          address: row.address || '',
          city: row.city || '',
          postalCode: row.postalCode || row.postal_code || '',
          objectType: row.objectType || row.object_type || 'woning',
          projectId: projectId // Always use the current project ID
        } as ParsedObject;
      });

      setParsedData(parsedObjects);
    };
    reader.readAsBinaryString(file);
  };

  const handleSubmit = async () => {
    if (parsedData.length === 0) {
      toast({
        title: "Geen data om te importeren",
        description: "Verwerk eerst een Excel-bestand om objecten te importeren.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert each row to an object that can be added
      const objects = parsedData.map(row => ({
        name: row.name,
        address: row.address,
        city: row.city,
        postalCode: row.postalCode,
        projectId: projectId, // Use the projectId from props, not from the row
        objectType: row.objectType as ObjectType,
        buildPhase: 'voorbereiding' as BuildPhase,
        complexId: 'default', // Add required field (can be updated later)
      }));

      // Add all objects
      await Promise.all(objects.map(object => objectService.addObject(object)));

      toast({
        title: "Objecten toegevoegd",
        description: `${objects.length} objecten zijn succesvol toegevoegd aan ${projectName}.`,
      });

      onObjectsAdded();
      onClose();
    } catch (error) {
      console.error('Error adding objects:', error);
      toast({
        title: "Fout bij toevoegen",
        description: "Er is een fout opgetreden bij het toevoegen van de objecten.",
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
          <DialogTitle>Batch Import Objecten</DialogTitle>
          <DialogDescription>
            Importeer meerdere objecten tegelijkertijd via een Excel-bestand.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="file">Excel Bestand</Label>
            <Input
              id="file"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
            />
          </div>

          <Button type="button" onClick={handleParse} disabled={!file}>
            Verwerken
          </Button>

          {parsedData.length > 0 && (
            <div className="space-y-2">
              <Label>Preview Data</Label>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naam</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adres</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plaats</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Postcode</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {parsedData.map((row, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.address}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.city}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.postalCode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.objectType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Annuleren
          </Button>
          <Button type="submit" disabled={isSubmitting || parsedData.length === 0} className="bg-cedrus-accent hover:bg-cedrus-accent/90" onClick={handleSubmit}>
            {isSubmitting ? 'Bezig met opslaan...' : 'Objecten Toevoegen'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
