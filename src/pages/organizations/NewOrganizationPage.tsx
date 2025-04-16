
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { hierarchyService } from '@/services/hierarchyService';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Naam moet minstens 2 karakters bevatten' }),
  description: z.string().optional(),
  city: z.string().optional(),
  address: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function NewOrganizationPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      city: '',
      address: '',
    }
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      // Create a new organization using the hierarchyService
      await hierarchyService.addOrganization({
        name: values.name,
        description: values.description || '',
        city: values.city,
        address: values.address
      });
      
      toast({
        title: "Organisatie aangemaakt",
        description: `${values.name} is succesvol aangemaakt`,
      });
      
      navigate('/organizations');
    } catch (error) {
      console.error('Error creating organization:', error);
      toast({
        title: "Er is iets misgegaan",
        description: "Probeer het opnieuw of neem contact op met ondersteuning",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageLayout>
      <div className="animate-fade-in">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/organizations')}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Terug
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-cedrus-blue dark:text-white">Nieuwe Organisatie</h1>
            <p className="text-muted-foreground mt-1">
              Maak een nieuwe organisatie aan
            </p>
          </div>
        </div>

        <div className="max-w-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Organisatie naam</FormLabel>
                    <FormControl>
                      <Input placeholder="Voer een naam in" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plaats (optioneel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Plaats van de organisatie" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adres (optioneel)</FormLabel>
                    <FormControl>
                      <Input placeholder="Adres van de organisatie" {...field} />
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
                    <FormLabel>Beschrijving (optioneel)</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Beschrijving van de organisatie" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => navigate('/organizations')}>
                  Annuleren
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-cedrus-accent hover:bg-cedrus-accent/90">
                  {isSubmitting ? 'Bezig met opslaan...' : 'Opslaan'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </PageLayout>
  );
}
