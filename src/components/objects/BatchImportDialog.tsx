
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { hierarchyService } from '@/services/hierarchy';
import { Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export interface BatchImportDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectName: string;
  onObjectsAdded: () => Promise<void>;
}

export function BatchImportDialog({ 
  isOpen, 
  onClose, 
  projectId, 
  projectName, 
  onObjectsAdded 
}: BatchImportDialogProps) {
  const [batchData, setBatchData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImport = async () => {
    if (!batchData.trim()) {
      setError('Voer objectgegevens in om te importeren');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      // Parse the CSV/text data (simple comma or newline separated)
      const lines = batchData.split('\n').filter(line => line.trim());
      
      if (lines.length === 0) {
        setError('Geen geldige objectgegevens gevonden');
        return;
      }
      
      let addedCount = 0;
      
      // Create a default complex for these objects
      const complex = await hierarchyService.addComplex({
        name: `Batch Import ${new Date().toLocaleDateString()}`,
        projectId: projectId,
        address: '',
        city: '',
        postalCode: '',
      });
      
      if (!complex) {
        throw new Error('Kon geen complex aanmaken voor batch import');
      }

      // Process each line
      for (const line of lines) {
        const parts = line.split(',').map(part => part.trim());
        const name = parts[0];
        
        if (!name) continue;
        
        const objectData = {
          name,
          complexId: complex.id,
          objectType: parts[1] || 'woning',
          address: parts[2] || '',
          city: parts[3] || '',
          postalCode: parts[4] || '',
          buildPhase: 'voorbereiding',
          projectId
        };

        const newObject = await hierarchyService.addObject(objectData);
        if (newObject) {
          addedCount++;
        }
      }

      if (addedCount > 0) {
        toast({
          title: "Objecten geïmporteerd",
          description: `${addedCount} objecten succesvol toegevoegd aan ${projectName}.`,
        });
        
        setBatchData('');
        onClose();
        
        if (onObjectsAdded) {
          await onObjectsAdded();
        }
      } else {
        setError('Geen objecten konden worden geïmporteerd');
      }
    } catch (err) {
      console.error('Error importing objects:', err);
      setError((err as Error).message || 'Er is een fout opgetreden bij het importeren');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Objecten Importeren</DialogTitle>
          <DialogDescription>
            Importeer meerdere objecten tegelijk naar {projectName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div>
            <p className="text-sm text-muted-foreground mb-2">
              Voer elk object op een nieuwe regel in. Format: Naam, Type, Adres, Plaats, Postcode
            </p>
            <Textarea
              value={batchData}
              onChange={(e) => setBatchData(e.target.value)}
              placeholder="Woning 1, woning, Hoofdstraat 1, Amsterdam, 1234AB
Woning 2, woning, Hoofdstraat 2, Amsterdam, 1234AB
Technische ruimte, techniek, Hoofdstraat 3, Amsterdam, 1234AB"
              className="h-64 font-mono"
            />
          </div>

          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuleren
            </Button>
            <Button 
              onClick={handleImport}
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? 'Importeren...' : (
                <>
                  <Upload className="h-4 w-4" />
                  Importeren
                </>
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
