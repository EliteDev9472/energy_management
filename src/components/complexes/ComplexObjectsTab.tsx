
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { hierarchyService } from '@/services/hierarchy';
import { HierarchyObject } from '@/types/hierarchy';
import { NewObjectDialog } from '@/components/objects/NewObjectDialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { useObjectsByComplex } from '@/hooks/use-objects';

interface ComplexObjectsTabProps {
  complexId: string;
  complexName: string;
}

export default function ComplexObjectsTab({ complexId, complexName }: ComplexObjectsTabProps) {
  const navigate = useNavigate();
  const { objects, loading, error } = useObjectsByComplex(complexId);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [objectToDelete, setObjectToDelete] = useState<HierarchyObject | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isNewObjectDialogOpen, setIsNewObjectDialogOpen] = useState(false);

  const handleDeleteObject = async () => {
    if (!objectToDelete) return;
    
    setIsDeleting(true);
    try {
      await hierarchyService.deleteObject(objectToDelete.id);
      toast({
        title: "Object verwijderd",
        description: "Het object is succesvol verwijderd.",
      });
      // Refresh the objects list
      window.location.reload();
    } catch (error) {
      console.error('Error deleting object:', error);
      toast({
        title: "Fout bij verwijderen",
        description: "Er is een fout opgetreden bij het verwijderen van het object.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setObjectToDelete(null);
    }
  };

  const openDeleteDialog = (object: HierarchyObject, event: React.MouseEvent) => {
    event.stopPropagation();
    setObjectToDelete(object);
    setIsDeleteDialogOpen(true);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState />;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Objecten</h2>
        <Button 
          onClick={() => setIsNewObjectDialogOpen(true)} 
          variant="outline" 
          className="flex items-center"
        >
          <Plus className="mr-2 h-4 w-4" /> Nieuw Object
        </Button>
      </div>

      {objects.length === 0 ? (
        <EmptyState 
          title="Geen objecten gevonden" 
          description="Er zijn nog geen objecten toegevoegd aan dit complex." 
          actionLabel="Object toevoegen"
          onAction={() => setIsNewObjectDialogOpen(true)}
          icon={<Home className="h-12 w-12 text-muted-foreground/50" />}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {objects.map((object) => (
            <Card 
              key={object.id} 
              className="hover:shadow-md cursor-pointer relative"
              onClick={() => navigate(`/objects/${object.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <Home className="h-5 w-5 text-cedrus-accent mr-2" />
                    <div>
                      <h3 className="font-medium">{object.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {object.address}{object.city && `, ${object.city}`}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8" 
                    onClick={(e) => openDeleteDialog(object, e)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  <div>Type: {object.objectType || 'Niet gespecificeerd'}</div>
                  <div>Fase: {object.buildPhase || 'Niet gespecificeerd'}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* New Object Dialog */}
      <NewObjectDialog 
        isOpen={isNewObjectDialogOpen} 
        onClose={() => setIsNewObjectDialogOpen(false)} 
        complexId={complexId}
        complexName={complexName}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Weet je zeker dat je dit object wilt verwijderen?</AlertDialogTitle>
            <AlertDialogDescription>
              Deze actie kan niet ongedaan worden gemaakt. Alle gerelateerde data, zoals aansluitingen, 
              zullen ook worden verwijderd.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuleren</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteObject} 
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? 'Bezig met verwijderen...' : 'Verwijderen'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
