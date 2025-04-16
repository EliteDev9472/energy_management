
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CategoryForm } from '@/components/categories/CategoryForm';
import { Entity } from '@/types/hierarchy';
import { hierarchyService } from '@/services/hierarchy';
import { toast } from '@/hooks/use-toast';

export default function NewCategoryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetEntityId = searchParams.get('entityId');
  
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEntities = async () => {
      try {
        setLoading(true);
        const entitiesData = await hierarchyService.getEntities();
        console.log('Loaded entities for category form:', entitiesData);
        setEntities(entitiesData);
        
        // If we have a preset entity ID, make sure it's valid
        if (presetEntityId) {
          const entityExists = entitiesData.some(entity => entity.id === presetEntityId);
          if (!entityExists) {
            console.log(`Preset entity ID ${presetEntityId} is not valid`);
            toast({
              title: "Ongeldige entiteit",
              description: "De opgegeven entiteit bestaat niet.",
              variant: "destructive"
            });
          } else {
            console.log(`Using preset entity ID: ${presetEntityId}`);
          }
        }
      } catch (error) {
        console.error('Error loading entities:', error);
        toast({
          title: "Fout bij laden entiteiten",
          description: "Er is een probleem opgetreden bij het laden van de entiteiten. Probeer het opnieuw.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadEntities();
  }, [presetEntityId]);

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Nieuwe Categorie Toevoegen</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Categorie Informatie</CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryForm
              entities={entities}
              isLoading={loading}
              onSuccess={() => {
                if (presetEntityId) {
                  navigate(`/entities/${presetEntityId}`);
                } else {
                  navigate('/categories');
                }
              }}
            />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
