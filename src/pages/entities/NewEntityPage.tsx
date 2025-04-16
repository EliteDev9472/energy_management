
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { hierarchyService } from '@/services/hierarchy';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  description: z.string().optional(),
  organizationId: z.string().min(1, { message: 'Organization is required' })
});

type FormValues = z.infer<typeof formSchema>;

export default function NewEntityPage() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      organizationId: ''
    }
  });

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const orgs = await hierarchyService.getOrganizations();
        setOrganizations(orgs);
      } catch (error) {
        console.error("Failed to fetch organizations:", error);
        toast({
          title: "Er is iets misgegaan",
          description: "Kon de organisaties niet ophalen. Probeer het opnieuw of neem contact op met ondersteuning",
          variant: "destructive",
        });
      }
    };

    fetchOrganizations();
  }, []);

  const onSubmit = async (values) => {
    setIsSubmitting(true);
    
    try {
      const newEntity = await hierarchyService.addEntity({
        name: values.name,
        description: values.description,
        organization_id: values.organizationId
      });
      
      if (newEntity) {
        toast({
          title: "Entiteit aangemaakt",
          description: `${values.name} is succesvol aangemaakt binnen de organisatie.`,
        });
        navigate('/entities');
      } else {
        throw new Error("Entiteit kon niet worden aangemaakt");
      }
    } catch (error) {
      console.error("Error creating entity:", error);
      toast({
        title: "Er is iets misgegaan",
        description: error instanceof Error ? error.message : "Probeer het opnieuw of neem contact op met ondersteuning",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Nieuwe Entiteit</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Entiteit details</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Naam</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Naam van de entiteit"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beschrijving</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Beschrijving van de entiteit"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="organizationId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organisatie</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecteer een organisatie" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {organizations.map((org) => (
                            <SelectItem key={org.id} value={org.id}>
                              {org.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => navigate('/entities')}>
                    Annuleren
                  </Button>
                  <Button type="submit" disabled={isSubmitting} className="bg-cedrus-accent hover:bg-cedrus-accent/90">
                    {isSubmitting ? 'Bezig met opslaan...' : 'Opslaan'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
