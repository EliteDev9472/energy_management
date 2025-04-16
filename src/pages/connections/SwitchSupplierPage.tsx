import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Organization, Entity, Category, Project } from '@/types/hierarchy';
import { hierarchyService } from '@/services/hierarchyService';

export default function SwitchSupplierPage() {
  const navigate = useNavigate();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    organization: '',
    entity: '',
    category: '',
    project: '',
    ean: '',
    requestDate: '',
    desiredConnectionDate: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load organizations
        const orgs = await hierarchyService.getOrganizations();
        setOrganizations(orgs);
        
        // If there's a selected organization, load its entities
        if (formData.organization) {
          const ents = await hierarchyService.getEntitiesByOrganization(formData.organization);
          setEntities(ents);
          
          // If there's a selected entity, load its categories
          if (formData.entity) {
            const cats = await hierarchyService.getCategoriesByEntity(formData.entity);
            setCategories(cats);
          }
        }
      } catch (error) {
        console.error('Error loading hierarchy data:', error);
        toast({
          title: "Error loading data",
          description: "There was a problem loading the required data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [formData.organization, formData.entity]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted with data:', formData);
  };

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold mb-6">Leverancier Wijzigen</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Aansluiting Informatie</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="organization">Organisatie</Label>
                <Select value={formData.organization} onValueChange={(value) => handleChange('organization', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer een organisatie" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizations.map(org => (
                      <SelectItem key={org.id} value={org.id}>
                        {org.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="entity">Entiteit</Label>
                <Select value={formData.entity} onValueChange={(value) => handleChange('entity', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer een entiteit" />
                  </SelectTrigger>
                  <SelectContent>
                    {entities.map(entity => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {entity.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="category">Categorie</Label>
                <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer een categorie" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="project">Project</Label>
                <Select value={formData.project} onValueChange={(value) => handleChange('project', value)}>
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
              
              <div className="grid gap-2">
                <Label htmlFor="ean">EAN Code</Label>
                <Input
                  id="ean"
                  value={formData.ean}
                  onChange={(e) => handleChange('ean', e.target.value)}
                  placeholder="EAN code van de aansluiting"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="requestDate">Aanvraag Datum</Label>
                  <Input
                    id="requestDate"
                    type="date"
                    value={formData.requestDate}
                    onChange={(e) => handleChange('requestDate', e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="desiredConnectionDate">Gewenste Aansluitdatum</Label>
                  <Input
                    id="desiredConnectionDate"
                    type="date"
                    value={formData.desiredConnectionDate}
                    onChange={(e) => handleChange('desiredConnectionDate', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" type="button" onClick={() => navigate('/connections')}>
                  Annuleren
                </Button>
                <Button type="submit">Wijzig Leverancier</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
