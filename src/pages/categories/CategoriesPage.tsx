
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { hierarchyService } from '@/services/hierarchy';
import { Plus, Search, ArrowUpDown, Folder, Trash2 } from 'lucide-react';
import { Category, Entity } from '@/types/hierarchy';
import { mapDbToEntity, mapDbToCategory } from '@/services/hierarchy/helpers';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/categories/PageHeader';
import { toast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState<string>('all');
  const [deleteInfo, setDeleteInfo] = useState<{ 
    categoryId: string, 
    projectCount: number, 
    complexCount: number, 
    objectCount: number 
  } | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const entityData = await hierarchyService.getEntities();
        const mappedEntities = entityData.map(entity => mapDbToEntity(entity));
        setEntities(mappedEntities);
        
        const categoryData = await hierarchyService.getCategories();
        const mappedCategories = categoryData.map(category => mapDbToCategory(category));
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEntity = selectedEntity === 'all' || category.entity_id === selectedEntity;
    return matchesSearch && matchesEntity;
  });
  
  const getEntityName = (entityId: string) => {
    const entity = entities.find(e => e.id === entityId);
    return entity ? entity.name : 'Onbekend';
  };
  
  const handleDeleteCategory = async (id: string) => {
    try {
      // Voer de daadwerkelijke verwijdering uit
      const result = await hierarchyService.deleteCategory(id);
      
      // Update de lijst
      setCategories(prev => prev.filter(cat => cat.id !== id));
      setDeleteInfo(null);
      
      toast({
        title: "Categorie verwijderd",
        description: "De categorie is succesvol verwijderd."
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Fout bij verwijderen",
        description: "Er is een fout opgetreden bij het verwijderen van de categorie.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteClick = async (categoryId: string) => {
    try {
      // Eerst ophalen van projecten om te zien of er items zijn
      const projects = await hierarchyService.getProjectsByCategory(categoryId);
      
      // Dan voor alle projecten de complexen tellen
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
        categoryId,
        projectCount: projects.length,
        complexCount,
        objectCount
      });
    } catch (error) {
      console.error('Error checking related items:', error);
      toast({
        title: "Fout bij controleren",
        description: "Er is een fout opgetreden bij het controleren van gerelateerde items.",
        variant: "destructive"
      });
    }
  };

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <PageHeader
          title="Categorieën"
          description="Beheer uw categorieën binnen entiteiten"
          backUrl="/dashboard"
          backLabel="Terug naar dashboard"
        />

        <div className="flex justify-end mb-4">
          <Button className="bg-cedrus-accent hover:bg-cedrus-accent/90" onClick={() => navigate('/categories/new')}>
            <Plus className="mr-2 h-4 w-4" /> Nieuwe Categorie
          </Button>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-4">
          <div className="w-full md:w-1/2 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Zoeken..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select
            value={selectedEntity}
            onValueChange={setSelectedEntity}
          >
            <SelectTrigger className="w-full md:w-auto">
              <SelectValue placeholder="Selecteer een entiteit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Alle entiteiten</SelectItem>
              {entities.map(entity => (
                <SelectItem key={entity.id} value={entity.id}>{entity.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <p>Laden...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Geen categorieën gevonden</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => navigate('/categories/new')}
            >
              Eerste categorie toevoegen
            </Button>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Geen categorieën gevonden met deze zoekcriteria</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => setSearchTerm('')}
            >
              Zoekresultaten wissen
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="cursor-pointer hover:shadow-md">
                <CardHeader className="pb-2" onClick={() => navigate(`/categories/${category.id}`)}>
                  <CardTitle className="flex items-center gap-2">
                    <Folder className="h-5 w-5 text-cedrus-accent" />
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-2" onClick={() => navigate(`/categories/${category.id}`)}>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="text-muted-foreground">
                      {getEntityName(category.entity_id)}
                    </Badge>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 justify-end">
                  <AlertDialog open={deleteInfo?.categoryId === category.id} onOpenChange={(open) => !open && setDeleteInfo(null)}>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(category.id);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Categorie verwijderen?</AlertDialogTitle>
                        <AlertDialogDescription>
                          <p className="mb-4">
                            Weet je zeker dat je de categorie "{category.name}" wilt verwijderen? 
                            Deze actie kan niet ongedaan worden gemaakt.
                          </p>
                          
                          {deleteInfo && (
                            <>
                              <div className="font-medium text-sm mb-2">De onderliggende items worden ook verwijderd:</div>
                              <ul className="list-disc pl-5 text-sm space-y-1">
                                {deleteInfo.projectCount > 0 && (
                                  <li>Projecten: {deleteInfo.projectCount}</li>
                                )}
                                {deleteInfo.complexCount > 0 && (
                                  <li>Complexen: {deleteInfo.complexCount}</li>
                                )}
                                {deleteInfo.objectCount > 0 && (
                                  <li>Objecten: {deleteInfo.objectCount}</li>
                                )}
                              </ul>
                              
                              <p className="text-xs mt-4 text-muted-foreground italic">
                                * Het kan even duren voordat de onderliggende items zijn verwijderd.
                              </p>
                            </>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuleren</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDeleteCategory(category.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Verwijderen
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
