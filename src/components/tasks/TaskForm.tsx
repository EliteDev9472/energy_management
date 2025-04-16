
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
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
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { ProjectTask } from '@/types/project';
import { getAllTeamMembers } from '@/services/teamService';
import { addTask, updateTask } from '@/services/taskService';

interface TaskFormProps {
  onSubmit: () => void;
  onCancel: () => void;
  initialValues?: ProjectTask;
  isEditing?: boolean;
}

const formSchema = z.object({
  title: z.string().min(2, { message: 'Titel moet minstens 2 karakters bevatten' }),
  description: z.string().min(5, { message: 'Beschrijving moet minstens 5 karakters bevatten' }),
  assignedTo: z.string().optional(),
  dueDate: z.date().optional(),
  status: z.enum(['open', 'in_progress', 'completed']),
  priority: z.enum(['low', 'medium', 'high'])
});

export function TaskForm({ 
  onSubmit, 
  onCancel, 
  initialValues, 
  isEditing = false 
}: TaskFormProps) {
  const [date, setDate] = useState<Date | undefined>(
    initialValues?.dueDate ? new Date(initialValues.dueDate) : undefined
  );
  
  const teamMembers = getAllTeamMembers();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues 
      ? {
          ...initialValues,
          dueDate: initialValues.dueDate ? new Date(initialValues.dueDate) : undefined
        } 
      : {
          title: '',
          description: '',
          assignedTo: undefined,
          status: 'open',
          priority: 'medium',
          dueDate: undefined
        }
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const formattedDueDate = values.dueDate ? format(values.dueDate, 'yyyy-MM-dd') : null;
    
    if (isEditing && initialValues) {
      updateTask({
        id: initialValues.id,
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        assignedTo: values.assignedTo || null,
        dueDate: formattedDueDate
      });
    } else {
      addTask({
        title: values.title,
        description: values.description,
        status: values.status,
        priority: values.priority,
        assignedTo: values.assignedTo || null,
        dueDate: formattedDueDate
      });
    }
    
    onSubmit();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titel</FormLabel>
              <FormControl>
                <Input placeholder="Taakomschrijving" {...field} />
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
                <Textarea 
                  placeholder="Gedetailleerde beschrijving van de taak" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="assignedTo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Toegewezen aan</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer een teamlid" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teamMembers.map(member => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Deadline</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Kies een datum</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setDate(date);
                      }}
                      disabled={(date) => date < new Date("1900-01-01")}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer een status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In uitvoering</SelectItem>
                    <SelectItem value="completed">Afgerond</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prioriteit</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer een prioriteit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="low">Laag</SelectItem>
                    <SelectItem value="medium">Gemiddeld</SelectItem>
                    <SelectItem value="high">Hoog</SelectItem>
                  </SelectContent>
                </Select>
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
