
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { hierarchyService } from '@/services/hierarchy';
import { Complex } from '@/types/hierarchy';
import { toast } from '@/hooks/use-toast';
import { Loading } from '@/components/ui/loading';
import { ComplexDetailsHeader } from '@/components/complexes/ComplexDetailsHeader';
import ComplexObjectsTab from '@/components/complexes/ComplexObjectsTab';
import { ComplexInfoTab } from '@/components/complexes/ComplexInfoTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ComplexConnectionsTab } from '@/components/complexes/ComplexConnectionsTab';

export default function ComplexDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [complex, setComplex] = useState<Complex | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTab, setCurrentTab] = useState('info');

  useEffect(() => {
    const fetchComplex = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const complexData = await hierarchyService.getComplexById(id);
        if (!complexData) {
          toast({
            title: "Complex niet gevonden",
            description: "Het opgevraagde complex bestaat niet",
            variant: "destructive"
          });
          return;
        }
        
        setComplex(complexData);
      } catch (error) {
        console.error('Error fetching complex:', error);
        toast({
          title: "Fout bij laden",
          description: "Er is een fout opgetreden bij het laden van het complex",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchComplex();
  }, [id]);

  if (loading) {
    return (
      <PageLayout>
        <Loading />
      </PageLayout>
    );
  }

  if (!complex) {
    return (
      <PageLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Complex niet gevonden</h2>
          <p className="text-muted-foreground">
            Het complex met ID {id} kon niet worden gevonden.
          </p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <ComplexDetailsHeader complex={complex} />
        
        <Tabs defaultValue="info" className="mt-6" onValueChange={setCurrentTab}>
          <TabsList>
            <TabsTrigger value="info">Informatie</TabsTrigger>
            <TabsTrigger value="objects">Objecten</TabsTrigger>
            <TabsTrigger value="connections">Aansluitingen</TabsTrigger>
            {/* <TabsTrigger value="meters">Meters</TabsTrigger> */}
            {/* <TabsTrigger value="documents">Documenten</TabsTrigger> */}
          </TabsList>
          <TabsContent value="info" className="space-y-4">
            <ComplexInfoTab complex={complex} />
          </TabsContent>
          <TabsContent value="objects" className="space-y-4">
            <ComplexObjectsTab complexId={complex.id} complexName={complex.name} />
          </TabsContent>
          <TabsContent value="connections" className="space-y-4">
            <ComplexConnectionsTab complexId={complex.id} complexName={complex.name} />
          </TabsContent>
          {/* <TabsContent value="meters">
            <MetersTab parentId={complex.id} parentType="complex" />
          </TabsContent> */}
          {/* <TabsContent value="documents">
            <DocumentsTab parentId={complex.id} parentType="complex" />
          </TabsContent> */}
        </Tabs>
      </div>
    </PageLayout>
  );
}
