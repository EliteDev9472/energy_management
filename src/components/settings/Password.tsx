
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(8, {
      message: "Huidig wachtwoord moet minimaal 8 tekens bevatten.",
    }),
    newPassword: z.string().min(8, {
      message: "Nieuw wachtwoord moet minimaal 8 tekens bevatten.",
    }),
    confirmPassword: z.string().min(8, {
      message: "Bevestig wachtwoord moet minimaal 8 tekens bevatten.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Wachtwoorden komen niet overeen",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export function Password() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: PasswordFormValues) {
    setIsSubmitting(true);
    
    try {
      // First, verify the current password by signing in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: (await supabase.auth.getUser()).data.user?.email || '',
        password: data.currentPassword,
      });
      
      if (signInError) {
        toast({
          title: "Fout bij wachtwoordverificatie",
          description: "Het huidige wachtwoord is onjuist.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      
      // If verification succeeded, update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword,
      });
      
      if (updateError) {
        toast({
          title: "Fout bij wachtwoordwijziging",
          description: updateError.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Wachtwoord bijgewerkt",
          description: "Uw wachtwoord is succesvol gewijzigd.",
        });
        form.reset();
      }
    } catch (error) {
      console.error("Error updating password:", error);
      toast({
        title: "Er is een fout opgetreden",
        description: "Probeer het later opnieuw.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Wachtwoord wijzigen</h3>
        <p className="text-sm text-muted-foreground">
          Werk uw wachtwoord bij om de beveiliging van uw account te verbeteren.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Huidig wachtwoord</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormDescription>
                  Voer uw huidige wachtwoord in ter verificatie.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nieuw wachtwoord</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormDescription>
                  Wachtwoord moet minimaal 8 tekens bevatten.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bevestig wachtwoord</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormDescription>
                  Voer uw nieuwe wachtwoord nogmaals in ter bevestiging.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Bezig met opslaan...
              </>
            ) : (
              "Wachtwoord wijzigen"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
