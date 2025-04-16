
import { useEffect, useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Organization } from '@/types/hierarchy';
import { hierarchyService } from '@/services/hierarchyService';
import { toast } from '@/hooks/use-toast';

export default function OrganizationsPage() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load organizations with their entities
    const loadOrganizations = async () => {
      try {
        setLoading(true);
        // Get organizations with their entities
        const orgs = await hierarchyService.getOrganizations();
        
        // Load entities for each organization
        const orgsWithEntities = await Promise.all(
          orgs.map(async (org) => {
            try {
              const entities = await hierarchyService.getEntitiesByOrganization(org.id);
              return {
                ...org,
                entities: entities
              };
            } catch (error) {
              console.error(`Error loading entities for org ${org.id}:`, error);
              return {
                ...org,
                entities: []
              };
            }
          })
        );
        
        setOrganizations(orgsWithEntities);
      } catch (error) {
        console.error('Failed to load organizations:', error);
        toast({
          title: "Error loading organizations",
          description: "There was a problem loading the organizations. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadOrganizations();
  }, []);

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">Organisaties</h1>
            <p className="text-muted-foreground mt-1">
              Beheer uw organisatiestructuur
            </p>
          </div>
          <Button className="bg-cedrus-accent hover:bg-cedrus-accent/90" onClick={() => navigate('/organizations/new')}>
            <Plus className="mr-2 h-4 w-4" /> Nieuwe Organisatie
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <p>Laden...</p>
          </div>
        ) : organizations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Geen organisaties gevonden</p>
            <Button 
              variant="outline" 
              className="mt-4" 
              onClick={() => navigate('/organizations/new')}
            >
              Eerste organisatie toevoegen
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {organizations.map((org) => (
              <Card key={org.id} className="cursor-pointer hover:shadow-md" onClick={() => navigate(`/organizations/${org.id}`)}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-cedrus-accent" />
                    {org.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {org.entities?.length || 0} entiteiten
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
