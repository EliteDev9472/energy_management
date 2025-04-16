
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Category, Project } from '@/types/hierarchy';
import { hierarchyService } from '@/services/hierarchy';
import { mapDbToCategory, mapDbToProject } from '@/services/hierarchy/helpers';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Package, Pencil, Save, Trash2 } from 'lucide-react';
import { PageHeader } from '@/components/categories/PageHeader';

export default function CategoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [entity, setEntity] = useState<any>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    description: ''
  });
  const [deleteInfo, setDeleteInfo] = useState<{ 
    complexCount: number, 
    objectCount: number 
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Get category
        const categoryData = await hierarchyService.getCategoryById(id);
        if (!categoryData) {
          toast({
            title: "Categorie niet gevonden",
            description: "De opgevraagde categorie bestaat niet.",
            variant: "destructive"
          });
          navigate('/categories');
          return;
        }
        
        // Map the DB category to the expected TypeScript Category type
        const mappedCategory = mapDbToCategory(categoryData);
        setCategory(mappedCategory);
        setFormState({
          name: mappedCategory.name,
          description: mappedCategory.description || ''
        });
        
        // Get entity info if needed
        if (mappedCategory.entity_id) {
          const entityData = await hierarchyService.getEntityById(mappedCategory.entity_id);
          setEntity(entityData);
        }
        
        // Get projects
        try {
          const projectsData = await hierarchyService.getProjectsByCategory(id);
          // Map DB projects to TypeScript projects
          const mappedProjects = projectsData.map(project => mapDbToProject(project));
          setProjects(mappedProjects);
        } catch (error) {
          console.error(`Error fetching projects for category ${id}:`, error);
          setProjects([]);
        }
        
      } catch (error) {
        console.error('Error fetching category details:', error);
        toast({
          title: "Fout bij laden",
          description: "Er is een fout opgetreden bij het laden van de categorie details.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!category) return;
    
    try {
      await hierarchyService.updateCategory(id!, {
        name: formState.name,
        description: formState.description
      });
      
      // Update local state
      setCategory(prev => {
        if (!prev) return null;
        return {
          ...prev,
          name: formState.name,
          description: formState.description
        };
      });
      
      setEditing(false);
      
      toast({
        title: "Categorie bijgewerkt",
        description: "De categorie is succesvol bijgewerkt."
      });
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: "Fout bij bijwerken",
        description: "Er is een fout opgetreden bij het bijwerken van de categorie.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteClick = async () => {
    if (!id) return;
    
    try {
      setDeleting(true);
      
      // Bereken het aantal onderliggende complexen en objecten
      let complexCount = 0;
      let objectCount = 0;
      
      for (const project of projects) {
        const complexes = await hierarchyService.getComplexesByProject(project.id);
        complexCount += complexes.length;
        
        for (const complex of complexes) {
          const objects = await hierarchyService.getObjectsByComplex(complex.id);
          objectCount += objects.length;
        }
      }
      
      setDeleteInfo({
        complexCount,
        objectCount
      });
    } catch (error) {
      console.error('Error calculating hierarchy items:', error);
      toast({
        title: "Fout bij controleren",
        description: "Er is een fout opgetreden bij het controleren van gerelateerde items.",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await hierarchyService.deleteCategory(id);
      
      toast({
        title: "Categorie verwijderd",
        description: "De categorie is succesvol verwijderd."
      });
      
      navigate('/categories');
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Fout bij verwijderen",
        description: "Er is een fout opgetreden bij het verwijderen van de categorie.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" onClick={() => navigate('/categories')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug
          </Button>
          <h1 className="text-3xl font-bold">Categorie laden...</h1>
        </div>
      </PageLayout>
    );
  }

  if (!category) {
    return (
      <PageLayout>
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" onClick={() => navigate('/categories')}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Terug
          </Button>
          <h1 className="text-3xl font-bold">Categorie niet gevonden</h1>
        </div>
      </PageLayout>
    );
  }

  // Get entity name in a safe way
  const getEntityName = () => {
    if (!entity) return 'Onbekende entiteit';
    
    return entity.name || 'Onbekende entiteit';
  };

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <PageHeader 
            title={category.name} 
            description={`Categorie in ${getEntityName()}`}
            backUrl={entity ? `/entities/${entity.id}` : '/categories'} 
            backLabel="Terug naar entiteit"
          />
          
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" disabled={deleting || projects.length > 0} onClick={handleDeleteClick}>
                  <Trash2 className="mr-2 h-4 w-4" /> Verwijderen
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Categorie verwijderen?</AlertDialogTitle>
                  <AlertDialogDescription>
                    <p className="mb-4">
                      Weet je zeker dat je de categorie "{category.name}" wilt verwijderen? 
                      Deze actie kan niet ongedaan worden gemaakt.
                    </p>
                    
                    {projects.length > 0 && (
                      <div className="bg-amber-50 border border-amber-200 p-4 rounded-md text-amber-800 mb-4">
                        <p className="font-medium">Verwijderen niet mogelijk</p>
                        <p>
                          Deze categorie bevat nog {projects.length} 
                          {projects.length === 1 ? ' project' : ' projecten'}.
                          Je moet eerst alle projecten verwijderen of verplaatsen naar een andere categorie.
                        </p>
                      </div>
                    )}
                    
                    {deleteInfo && projects.length === 0 && (
                      <>
                        <div className="font-medium text-sm mb-2">De onderliggende items worden ook verwijderd:</div>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {deleteInfo.complexCount > 0 && (
                            <li>Complexen: {deleteInfo.complexCount}</li>
                          )}
                          {deleteInfo.objectCount > 0 && (
                            <li>Objecten: {deleteInfo.objectCount}</li>
                          )}
                          {deleteInfo.complexCount === 0 && deleteInfo.objectCount === 0 && (
                            <li>Geen onderliggende items gevonden</li>
                          )}
                        </ul>
                        
                        {(deleteInfo.complexCount > 0 || deleteInfo.objectCount > 0) && (
                          <p className="text-xs mt-4 text-muted-foreground italic">
                            * Het kan even duren voordat de onderliggende items zijn verwijderd.
                          </p>
                        )}
                      </>
                    )}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuleren</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    disabled={projects.length > 0}
                  >
                    Verwijderen
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Categorie Details</CardTitle>
              </CardHeader>
              <CardContent>
                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Naam</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        value={formState.name} 
                        onChange={handleInputChange} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="entity">Entiteit</Label>
                      <Input 
                        id="entity" 
                        value={getEntityName()}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Beschrijving</Label>
                      <Textarea 
                        id="description" 
                        name="description" 
                        value={formState.description} 
                        onChange={handleInputChange} 
                        rows={4}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setEditing(false)}>Annuleren</Button>
                      <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" /> Opslaan
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <Label>Entiteit</Label>
                      <p className="text-sm">{getEntityName()}</p>
                    </div>
                    <div>
                      <Label>Beschrijving</Label>
                      <p className="text-sm">{category.description || 'Geen beschrijving'}</p>
                    </div>
                    <div className="flex justify-end">
                      <Button variant="outline" size="icon" onClick={() => setEditing(true)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Projecten</CardTitle>
                <CardDescription>
                  {projects.length === 0 
                    ? "Geen projecten in deze categorie" 
                    : `${projects.length} project${projects.length !== 1 ? 'en' : ''} in deze categorie`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {projects.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground mb-2">Geen projecten gevonden</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/projects/new?categoryId=${category.id}`)}
                    >
                      Project toevoegen
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {projects.map(project => (
                      <div 
                        key={project.id}
                        className="flex items-center p-2 border rounded hover:bg-muted cursor-pointer"
                        onClick={() => navigate(`/projects/${project.id}`)}
                      >
                        <Package className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{project.name}</span>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-4" 
                      onClick={() => navigate(`/projects/new?categoryId=${category.id}`)}
                    >
                      Project toevoegen
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {projects.length > 0 && (
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-amber-800 text-sm mb-2 font-medium">Let op!</p>
                <p className="text-amber-700 text-sm">
                  Deze categorie kan niet worden verwijderd omdat er nog projecten aan gekoppeld zijn. 
                  Verwijder eerst alle projecten of verplaats ze naar een andere categorie.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
