
import { useState, useEffect } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { ComplexesList } from '@/components/complexes/ComplexesList';
import { Button } from '@/components/ui/button';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { hierarchyService } from '@/services/hierarchy';
import { Complex } from '@/types/hierarchy';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export default function ComplexesPage() {
  const [complexes, setComplexes] = useState<Complex[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchComplexes() {
      setLoading(true);
      try {
        const allComplexes = await hierarchyService.getComplexes();
        setComplexes(allComplexes);
      } catch (error) {
        console.error('Error fetching complexes:', error);
        toast({
          title: "Fout bij laden",
          description: "Er is een fout opgetreden bij het laden van de complexen.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchComplexes();
  }, []);

  const filteredComplexes = searchTerm
    ? complexes.filter(complex => 
        complex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (complex.address?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (complex.city?.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : complexes;

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">Complexen</h1>
            <p className="text-muted-foreground mt-1">
              Bekijk en beheer al uw complexen en objecten
            </p>
          </div>
          <Button 
            className="bg-cedrus-accent hover:bg-cedrus-accent/90 flex items-center gap-2"
            onClick={() => navigate('/complexes/new')}
          >
            <Plus className="h-4 w-4" /> Nieuw Complex
          </Button>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Zoek op naam, adres of stad..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cedrus-accent"></div>
          </div>
        ) : (
          <ComplexesList complexes={filteredComplexes} />
        )}
      </div>
    </PageLayout>
  );
}
