
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FolderTree, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Entity, Category } from '@/types/hierarchy';
import { hierarchyService } from '@/services/hierarchy';
import { toast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/categories/PageHeader';

export default function EntityDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [entity, setEntity] = useState<Entity | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [organization, setOrganization] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!id) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch entity details
        const entityData = await hierarchyService.getEntityById(id);
        
        if (!entityData) {
          toast({
            title: "Entiteit niet gevonden",
            description: "De gevraagde entiteit kon niet worden gevonden.",
            variant: "destructive",
          });
          navigate('/entities');
          return;
        }
        
        setEntity(entityData);
        
        // Get organization info
        if (entityData.organization) {
          const orgId = typeof entityData.organization === 'string' ? entityData.organization : entityData.organization.id;
          try {
            const orgData = await hierarchyService.getOrganizationById(orgId);
            setOrganization(orgData);
          } catch (err) {
            console.error('Error fetching organization:', err);
          }
        }
        
        // Fetch categories for this entity
        try {
          console.log(`Fetching categories for entity ${id}`);
          const categoriesData = await hierarchyService.getCategoriesByEntity(id);
          console.log(`Found categories for entity ${id}:`, categoriesData);
          setCategories(categoriesData);
        } catch (err) {
          console.error('Error fetching categories:', err);
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching entity data:', error);
        toast({
          title: "Fout bij ophalen gegevens",
          description: "Er is een fout opgetreden bij het ophalen van de entiteitsgegevens.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id, navigate]);

  if (loading || !entity) {
    return (
      <PageLayout>
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/entities')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Terug
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">Laden...</h1>
          </div>
        </div>
      </PageLayout>
    );
  }

  const getOrganizationName = () => {
    if (organization) return organization.name;
    if (typeof entity.organization === 'string') return entity.organizationName || 'Onbekende organisatie';
    return entity.organization?.name || 'Onbekende organisatie';
  };

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <PageHeader
          title={entity.name}
          description={`Onderdeel van ${getOrganizationName()}`}
          backUrl="/entities"
          backLabel="Terug naar entiteiten"
        />

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Categorieën</h2>
          <Button 
            className="bg-cedrus-accent hover:bg-cedrus-accent/90" 
            onClick={() => navigate(`/categories/new?entityId=${entity.id}`)}
          >
            <Plus className="mr-2 h-4 w-4" /> Nieuwe Categorie
          </Button>
        </div>
        
        {categories.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-muted/10">
            <FolderTree className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">Geen categorieën</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Deze entiteit heeft nog geen categorieën.
            </p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => navigate(`/categories/new?entityId=${entity.id}`)}
            >
              <Plus className="mr-2 h-4 w-4" /> Categorie toevoegen
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card 
                key={category.id} 
                className="cursor-pointer hover:shadow-md transition-shadow" 
                onClick={() => navigate(`/categories/${category.id}`)}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FolderTree className="h-5 w-5 text-cedrus-accent" />
                    {category.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {category.projects?.length || 0} projecten
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getOrganizationName()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
