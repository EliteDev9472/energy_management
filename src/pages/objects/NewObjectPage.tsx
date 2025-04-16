import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Project, Complex, ObjectType, BuildPhase } from '@/types/hierarchy';
import { hierarchyService } from '@/services/hierarchyService';

export default function NewObjectPage() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [complexes, setComplexes] = useState<Complex[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    projectId: '',
    complexId: '',
    objectType: 'woning' as ObjectType,
    buildPhase: 'voorbereiding' as BuildPhase
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const projectsData = await hierarchyService.getProjects();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error loading projects:', error);
        toast({
          title: "Error loading projects",
          description: "There was a problem loading the projects. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  const loadComplexes = async (projectId) => {
    try {
      setLoading(true);
      const complexesData = await hierarchyService.getComplexesByProject(projectId);
      setComplexes(complexesData);
    } catch (error) {
      console.error('Error loading complexes:', error);
      toast({
        title: "Error loading complexes",
        description: "There was a problem loading the complexes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field == 'projectId')
      loadComplexes(value);

  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.name || !formData.address || !formData.city || !formData.postalCode || !formData.projectId) {
      toast({
        title: "Vul alle vereiste velden in",
        description: "Alle velden met een * zijn verplicht",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const newObject = await hierarchyService.addObject({
        name: formData.name,
        projectId: formData.projectId,
        complexId: formData.complexId,
        address: formData.address,
        city: formData.city,
        postalcode: formData.postalCode,
        objectType: formData.objectType,
        buildPhase: formData.buildPhase
      });

      toast({
        title: "Object toegevoegd",
        description: `${newObject.name} is succesvol toegevoegd`
      });

      navigate('/objects');
    } catch (error) {
      toast({
        title: "Fout bij toevoegen",
        description: (error as Error).message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Nieuw Object Toevoegen</h1>

        <Card>
          <CardHeader>
            <CardTitle>Object Informatie</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="project">Project *</Label>
                <Select value={formData.projectId} onValueChange={(value) => handleChange('projectId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer een project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map(project => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.projectNumber} - {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="complex">Complexen *</Label>
                <Select value={formData.complexId} onValueChange={(value) => handleChange('complexId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer een Complexen" />
                  </SelectTrigger>
                  <SelectContent>
                    {complexes.map(complex => (
                      <SelectItem key={complex.id} value={complex.id}>
                        {complex.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Naam *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="Naam van het object"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="objectType">Type object *</Label>
                  <Select
                    value={formData.objectType}
                    onValueChange={(value) => handleChange('objectType', value as ObjectType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="woning">Woning</SelectItem>
                      <SelectItem value="utiliteit">Utiliteit</SelectItem>
                      <SelectItem value="installatie">Installatie</SelectItem>
                      <SelectItem value="techniek">Techniek</SelectItem>
                      <SelectItem value="bouwvoorziening">Bouwvoorziening</SelectItem>
                      <SelectItem value="overig">Overig</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Adres *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Straatnaam en huisnummer"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="postalCode">Postcode *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => handleChange('postalCode', e.target.value)}
                    placeholder="1234 AB"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="city">Plaats *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="Plaatsnaam"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="buildPhase">Fase binnen bouw</Label>
                  <Select
                    value={formData.buildPhase}
                    onValueChange={(value) => handleChange('buildPhase', value as BuildPhase)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer fase" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="voorbereiding">Voorbereiding</SelectItem>
                      <SelectItem value="ontwikkeling">Ontwikkeling</SelectItem>
                      <SelectItem value="uitvoering">Uitvoering</SelectItem>
                      <SelectItem value="oplevering">Oplevering</SelectItem>
                      <SelectItem value="beheer">Beheer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => navigate('/objects')}>
                  Annuleren
                </Button>
                <Button type="submit">Object Toevoegen</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
