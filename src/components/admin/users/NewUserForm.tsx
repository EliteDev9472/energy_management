
import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { UserRole, USER_ROLE_LABELS } from "@/types/user";
import { formSchema } from "./userFormSchema";
import { hierarchyService } from "@/services/hierarchy";
import { Organization } from "@/types/hierarchy";

interface NewUserFormProps {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onSuccess: () => void;
}

export function NewUserForm({ loading, setLoading, onSuccess }: NewUserFormProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoadingOrgs, setIsLoadingOrgs] = useState(true);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: "client" as UserRole
    }
  });

  const { watch, setValue } = form;
  const selectedRole = watch("role");

  // Load organizations for all users
  const loadOrganizations = async () => {
    try {
      setIsLoadingOrgs(true);
      const orgs = await hierarchyService.getOrganizations();
      setOrganizations(orgs);
    } catch (error) {
      console.error('Error loading organizations:', error);
      toast({
        title: "Fout bij het laden van organisaties",
        description: "Er is een fout opgetreden. Probeer het later nog eens.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingOrgs(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      // First create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
          },
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        // Create profile record with role
        const profileData = {
          id: authData.user.id,
          name: values.name,
          email: values.email,
          role: values.role,
          organization_id: values.organizationId
        };
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (profileError) throw profileError;

        // Find organization name for toast message
        const orgName = organizations.find(org => org.id === values.organizationId)?.name || "Onbekende organisatie";

        toast({
          title: "Gebruiker aangemaakt",
          description: `${values.name} is succesvol toegevoegd als ${USER_ROLE_LABELS[values.role as UserRole]} voor ${orgName}.`
        });

        onSuccess();
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Fout bij aanmaken gebruiker",
        description: "Er is een fout opgetreden. Controleer de gegevens en probeer het opnieuw.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  useEffect(() => {
    if (!selectedRole || selectedRole !== "client") {
      setValue("organizationId", undefined);
    }
  }, [selectedRole, setValue]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Volledige naam</FormLabel>
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
              <FormLabel>E-mailadres</FormLabel>
              <FormControl>
                <Input type="email" placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wachtwoord</FormLabel>
              <FormControl>
                <Input type="password" placeholder="********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rol</FormLabel>
              <Select 
                onValueChange={(value: UserRole) => {
                  field.onChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecteer een rol" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(USER_ROLE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedRole === "client" && (
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
                    {isLoadingOrgs ? (
                      <SelectItem value="loading" disabled>Laden...</SelectItem>
                    ) : organizations.length === 0 ? (
                      <SelectItem value="none" disabled>Geen organisaties beschikbaar</SelectItem>
                    ) : (
                      organizations.map(org => (
                        <SelectItem key={org.id} value={org.id}>{org.name}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" disabled={loading}>
          {loading ? "Bezig met aanmaken..." : "Gebruiker Aanmaken"}
        </Button>
      </form>
    </Form>
  );
}
