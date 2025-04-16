
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HierarchyObject } from '@/types/hierarchy';
import { hierarchyService } from '@/services/hierarchy';
import { toast } from '@/hooks/use-toast';
import { 
  Plus, 
  Building, 
  TableProperties, 
  Trash2, 
  FileUp,
  Upload
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { NewObjectDialog } from '@/components/objects/NewObjectDialog';
import { BatchImportDialog } from '@/components/objects/BatchImportDialog';

interface ProjectObjectsTabProps {
  projectId: string;
  projectName: string;
}

export const ProjectObjectsTab = ({ projectId, projectName }: ProjectObjectsTabProps) => {
  const [objects, setObjects] = useState<HierarchyObject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newObjectDialogOpen, setNewObjectDialogOpen] = useState(false);
  const [batchImportDialogOpen, setBatchImportDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [objectToDelete, setObjectToDelete] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const fetchObjects = async () => {
    setIsLoading(true);
    try {
      const data = await hierarchyService.getObjectsByProject(projectId);
      setObjects(data);
    } catch (error) {
      console.error('Error fetching objects:', error);
      toast({
        title: "Fout bij laden",
        description: "Kon objecten niet laden. Probeer het later opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchObjects();
  }, [projectId]);
  
  const handleDeleteObject = async (id: string) => {
    try {
      await hierarchyService.deleteObject(id);
      toast({
        title: "Object verwijderd",
        description: "Het object is succesvol verwijderd."
      });
      fetchObjects();
    } catch (error) {
      console.error('Error deleting object:', error);
      toast({
        title: "Fout bij verwijderen",
        description: "Er is een fout opgetreden bij het verwijderen van het object.",
        variant: "destructive",
      });
    }
    setObjectToDelete(null);
  };
  
  const confirmDelete = (id: string) => {
    setObjectToDelete(id);
    setDeleteDialogOpen(true);
  };
  
  const getConnectionStatusBadge = (status?: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-500">Aangesloten</Badge>;
      case 'requested':
        return <Badge className="bg-blue-500">Aangevraagd</Badge>;
      case 'mixed':
        return <Badge className="bg-purple-500">Gemengd</Badge>;
      default:
        return <Badge variant="outline">Geen aansluiting</Badge>;
    }
  };
  
  const getObjectTypeBadge = (type?: string) => {
    switch (type) {
      case 'woning':
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Woning</Badge>;
      case 'utiliteit':
        return <Badge variant="outline" className="border-purple-500 text-purple-700">Utiliteit</Badge>;
      case 'installatie':
        return <Badge variant="outline" className="border-orange-500 text-orange-700">Installatie</Badge>;
      case 'techniek':
        return <Badge variant="outline" className="border-teal-500 text-teal-700">Techniek</Badge>;
      case 'bouwvoorziening':
        return <Badge variant="outline" className="border-amber-500 text-amber-700">Bouwvoorziening</Badge>;
      default:
        return <Badge variant="outline">Overig</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Objecten in {projectName}</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setBatchImportDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <FileUp className="h-4 w-4" />
            Batch Import
          </Button>
          <Button 
            onClick={() => setNewObjectDialogOpen(true)}
            className="bg-cedrus-accent hover:bg-cedrus-accent/90 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nieuw Object
          </Button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cedrus-blue mt-8 mb-8"></div>
        </div>
      ) : objects.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <Building className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">Geen objecten gevonden</h3>
              <p className="text-muted-foreground mb-4">
                Er zijn nog geen objecten toegevoegd aan dit project.
              </p>
              <Button 
                onClick={() => setNewObjectDialogOpen(true)}
                className="bg-cedrus-accent hover:bg-cedrus-accent/90"
              >
                <Plus className="mr-2 h-4 w-4" />
                Object Toevoegen
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TableProperties className="h-5 w-5 text-cedrus-accent" />
              Alle Objecten
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Objectnaam</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Adres</TableHead>
                  <TableHead>Aansluitingen</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Acties</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {objects.map((object) => (
                  <TableRow key={object.id}>
                    <TableCell className="font-medium">{object.name}</TableCell>
                    <TableCell>{getObjectTypeBadge(object.objectType)}</TableCell>
                    <TableCell>{object.address || '-'}</TableCell>
                    <TableCell>{object.connectionCount || 0}</TableCell>
                    <TableCell>{getConnectionStatusBadge(object.connectionStatus)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/connections/new?object=${object.id}`)}
                        >
                          Aansluiting toevoegen
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/objects/${object.id}`)}
                        >
                          Details
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => confirmDelete(object.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
      
      <NewObjectDialog
        isOpen={newObjectDialogOpen}
        onClose={() => setNewObjectDialogOpen(false)}
        projectId={projectId}
        projectName={projectName}
        onObjectAdded={fetchObjects}
        complexId="default" // Providing a default complexId
      />
      
      <BatchImportDialog
        isOpen={batchImportDialogOpen}
        onClose={() => setBatchImportDialogOpen(false)}
        projectId={projectId}
        projectName={projectName}
        onObjectsAdded={fetchObjects}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Object verwijderen?</AlertDialogTitle>
            <AlertDialogDescription>
              Weet je zeker dat je dit object wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.
              Alle aansluitingen die gekoppeld zijn aan dit object zullen ontkoppeld worden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setObjectToDelete(null)}>Annuleren</AlertDialogCancel>
            <AlertDialogAction 
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => objectToDelete && handleDeleteObject(objectToDelete)}
            >
              Verwijderen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
