
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { hierarchyService } from '@/services/hierarchyService';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Organization } from '@/types/hierarchy';
import { mapDbToOrganization } from '@/services/hierarchy/helpers';
import { toast } from '@/hooks/use-toast';
import { Loading } from '@/components/ui/loading';
import { Building2, Plus, Search } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useNavigate } from 'react-router-dom';

export function ClientManagement() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrganizations = async () => {
      setLoading(true);
      try {
        const data = await hierarchyService.getOrganizations();
        const mappedOrgs = data.map(org => mapDbToOrganization(org));
        setOrganizations(mappedOrgs);
      } catch (error) {
        console.error('Error fetching organizations:', error);
        toast({
          title: "Fout bij laden",
          description: "Er is een fout opgetreden bij het laden van de organisaties.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  const filteredOrganizations = organizations.filter(org => 
    org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (org.city && org.city.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold mb-2 flex items-center">
            <Building2 className="mr-2 h-6 w-6" />
            Klantenbeheer
          </h2>
          <p className="text-muted-foreground">
            Beheer hier uw klanten (organisaties)
          </p>
        </div>
        <Button onClick={() => navigate('/organizations/new')} className="bg-cedrus-accent hover:bg-cedrus-accent/90">
          <Plus className="mr-2 h-4 w-4" />
          Nieuwe Organisatie
        </Button>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Zoek klanten..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-10 w-full"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <Loading />
            </div>
          ) : filteredOrganizations.length === 0 ? (
            <div className="text-center py-8">
              <Building2 className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium">Geen klanten gevonden</h3>
              <p className="text-muted-foreground">
                Er zijn geen klanten gevonden die overeenkomen met uw zoekopdracht.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Naam</TableHead>
                    <TableHead>Plaats</TableHead>
                    <TableHead className="w-[150px]">Acties</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrganizations.map(org => (
                    <TableRow key={org.id}>
                      <TableCell className="font-medium">{org.name}</TableCell>
                      <TableCell>{org.city}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => navigate(`/organizations/${org.id}`)}>
                          Bekijken
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
