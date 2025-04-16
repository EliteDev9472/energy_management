
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
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
import { toast } from '@/hooks/use-toast';
import { hierarchyService } from '@/services/hierarchy';
import { Entity } from '@/types/hierarchy';

export const categoryFormSchema = z.object({
  name: z.string().min(2, { message: 'Naam moet minstens 2 karakters bevatten' }),
  entity: z.string({ required_error: 'Selecteer een entiteit' }),
  description: z.string().optional(),
});

export type CategoryFormValues = z.infer<typeof categoryFormSchema>;

interface CategoryFormProps {
  entities: Entity[];
  isLoading: boolean;
  onSuccess?: () => void;
}

export const CategoryForm = ({ entities, isLoading, onSuccess }: CategoryFormProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Extract entityId from query parameters if present
  const searchParams = new URLSearchParams(location.search);
  const preselectedEntityId = searchParams.get('entityId');
  
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      entity: preselectedEntityId || '',
      description: '',
    }
  });

  // Set the entity field value from URL parameter
  useEffect(() => {
    if (preselectedEntityId) {
      form.setValue('entity', preselectedEntityId);
    }
  }, [preselectedEntityId, form]);

  const onSubmit = async (values: CategoryFormValues) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting category with values:', values);
      
      // Find the entity for display in toast
      const entity = entities.find(e => e.id === values.entity);
      if (!entity) {
        toast({
          title: "Ongeldige entiteit",
          description: "De geselecteerde entiteit kon niet worden gevonden",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // Create the category
      const newCategory = await hierarchyService.addCategory({
        name: values.name,
        entity_id: values.entity, // Changed from entityId to entity_id
        description: values.description || '',
        entityName: entity.name,
      });
      
      console.log('Category created:', newCategory);
      
      if (newCategory) {
        toast({
          title: "Categorie aangemaakt",
          description: `${values.name} is succesvol aangemaakt binnen ${entity.name}`,
        });
        
        if (onSuccess) {
          onSuccess();
        } else if (preselectedEntityId) {
          // If we had a preselected entity, go back to that entity's detail page
          navigate(`/entities/${preselectedEntityId}`);
        } else {
          navigate('/categories');
        }
      } else {
        throw new Error("Categorie kon niet worden aangemaakt");
      }
    } catch (error) {
      console.error('Error creating category:', error);
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categorie naam</FormLabel>
              <FormControl>
                <Input placeholder="Voer een naam in" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="entity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Entiteit</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                value={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer een entiteit" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoading ? (
                    <SelectItem value="loading" disabled>Laden...</SelectItem>
                  ) : entities.length === 0 ? (
                    <SelectItem value="none" disabled>Geen entiteiten gevonden</SelectItem>
                  ) : (
                    entities.map((entity) => (
                      <SelectItem key={entity.id} value={entity.id}>
                        {entity.name} {entity.organization && `(${entity.organization})`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
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
                <Input placeholder="Beschrijving van de categorie" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => {
            if (preselectedEntityId) {
              navigate(`/entities/${preselectedEntityId}`);
            } else {
              navigate('/categories');
            }
          }}>
            Annuleren
          </Button>
          <Button type="submit" disabled={isSubmitting} className="bg-cedrus-accent hover:bg-cedrus-accent/90">
            {isSubmitting ? 'Bezig met opslaan...' : 'Opslaan'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
