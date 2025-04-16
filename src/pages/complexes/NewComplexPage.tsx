
import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { hierarchyService } from '@/services/hierarchyService';
import { Project } from '@/types/hierarchy';
import { Building2, ChevronRight, FolderTree, Package } from 'lucide-react';

export default function NewComplexPage() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedProjectId = searchParams.get('projectId');

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const allProjects = await hierarchyService.getProjects();
        setProjects(allProjects);
        
        // If a project ID was provided in the URL, select it
        if (preSelectedProjectId) {
          setProjectId(preSelectedProjectId);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: "Fout bij laden projecten",
          description: "Er is een fout opgetreden bij het ophalen van de projecten.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, [preSelectedProjectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !address || !city || !postalCode || !projectId) {
      toast({
        title: "Validatie fout",
        description: "Vul alle verplichte velden in.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newComplex = await hierarchyService.addComplex({
        name,
        address,
        city,
        postalCode,
        description,
        projectId
      });
      
      toast({
        title: "Complex toegevoegd",
        description: "Het complex is succesvol aangemaakt.",
      });
      
      navigate(`/complexes`);
    } catch (error) {
      console.error('Error adding complex:', error);
      toast({
        title: "Fout bij aanmaken complex",
        description: (error as Error).message || "Er is een fout opgetreden bij het aanmaken van het complex.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getBreadcrumb = () => {
    const selectedProject = projects.find(p => p.id === projectId);
    
    if (!selectedProject) {
      return null;
    }
    
    return (
      <div className="flex items-center text-sm text-muted-foreground mb-6">
        <FolderTree className="h-4 w-4 mr-2" />
        <span>{selectedProject.categoryName || 'Categorie'}</span>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Package className="h-4 w-4 mr-2" />
        <span>{selectedProject.name}</span>
        <ChevronRight className="h-4 w-4 mx-1" />
        <Building2 className="h-4 w-4 mr-2" />
        <span className="text-foreground">Nieuw Complex</span>
      </div>
    );
  };

  return (
    <PageLayout>
      <div className="animate-fade-in max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white mb-2">Nieuw Complex</h1>
        <p className="text-muted-foreground mb-6">
          Voeg een nieuw complex toe aan een project
        </p>
        
        {projectId && getBreadcrumb()}
        
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Complex informatie</CardTitle>
              <CardDescription>
                Vul de basisgegevens van het complex in
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project">Project *</Label>
                <Select 
                  value={projectId} 
                  onValueChange={setProjectId}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer een project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Naam complex *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Bijv. Woonwijk Zonnepark - Hoofdcomplex"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="address">Adres *</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Straatnaam en huisnummer"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="postal_code">Postcode *</Label>
                  <Input
                    id="postal_code"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="1234 AB"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Plaats *</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Plaatsnaam"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Beschrijving</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optionele beschrijving van het complex"
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/complexes')}
              >
                Annuleren
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-cedrus-accent hover:bg-cedrus-accent/90"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                    Bezig met opslaan...
                  </>
                ) : 'Complex aanmaken'}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </PageLayout>
  );
}
