
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useSettings } from "@/contexts/SettingsContext";
import { NameEmailFields } from "./NameEmailFields";
import { PreferenceFields } from "./PreferenceFields";
import { MarketingPreference } from "./MarketingPreference";
import { SubmitButton } from "./SubmitButton";
import { useState } from "react";
import { generalFormSchema, GeneralFormValues } from "./types";

export function GeneralForm() {
  const { settings, updateSettings, loading: settingsLoading } = useSettings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set up the form with default values from settings
  const form = useForm<GeneralFormValues>({
    resolver: zodResolver(generalFormSchema),
    defaultValues: {
      name: settings.name || "",
      email: settings.email || "",
      language: settings.language || "nl",
      theme: settings.theme || "light",
      notifications: settings.notifications || false,
      marketing_emails: settings.marketing_emails || false,
    },
  });

  // Form submission handler
  async function onSubmit(data: GeneralFormValues) {
    setIsSubmitting(true);
    try {
      await updateSettings(data);
      
      toast({
        title: "Instellingen bijgewerkt",
        description: "Je instellingen zijn succesvol bijgewerkt.",
      });
    } catch (error) {
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het bijwerken van je instellingen.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <NameEmailFields form={form} />
        <PreferenceFields form={form} />
        <MarketingPreference form={form} />
        <SubmitButton loading={isSubmitting} />
      </form>
    </Form>
  );
}
