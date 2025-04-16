
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
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
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { TeamMember } from '@/types/project';
import { addTeamMember, updateTeamMember } from '@/services/teamService';

interface TeamMemberFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  initialValues?: TeamMember;
  isEditing?: boolean;
}

const formSchema = z.object({
  name: z.string().min(2, { message: 'Naam moet minstens 2 karakters bevatten' }),
  email: z.string().email({ message: 'Ongeldig emailadres' }),
  role: z.enum(['projectmanager', 'consultant', 'klantcontact', 'team_member'], {
    required_error: 'Selecteer een rol'
  }),
  avatar: z.string().optional()
});

export function TeamMemberForm({ 
  onSubmit, 
  onCancel, 
  initialValues, 
  isEditing = false 
}: TeamMemberFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues || {
      name: '',
      email: '',
      role: 'team_member',
      avatar: ''
    }
  });
  
  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    if (isEditing && initialValues) {
      updateTeamMember({
        id: initialValues.id,
        name: values.name,
        email: values.email,
        role: values.role,
        avatar: values.avatar
      });
    } else {
      addTeamMember({
        name: values.name,
        email: values.email,
        role: values.role,
        avatar: values.avatar
      });
    }
    
    onSubmit();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Naam</FormLabel>
                <FormControl>
                  <Input placeholder="Volledige naam" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <Input placeholder="email@voorbeeld.nl" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer een rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="projectmanager">Projectmanager</SelectItem>
                    <SelectItem value="consultant">Consultant</SelectItem>
                    <SelectItem value="klantcontact">Klantcontact</SelectItem>
                    <SelectItem value="team_member">Teamlid</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="avatar"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar URL (optioneel)</FormLabel>
                <FormControl>
                  <Input placeholder="URL naar profielafbeelding" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuleren
          </Button>
          <Button type="submit">
            {isEditing ? 'Bijwerken' : 'Toevoegen'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
