
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";

const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  projectUpdates: z.boolean().default(true),
  connectionUpdates: z.boolean().default(true),
  taskAssignments: z.boolean().default(true),
  securityAlerts: z.boolean().default(true),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

export function Notifications() {
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      projectUpdates: true,
      connectionUpdates: true,
      taskAssignments: true,
      securityAlerts: true,
    },
  });

  function onSubmit(data: NotificationsFormValues) {
    // In a real app, we would update the user's notification preferences
    console.log("Form submitted:", data);
    toast({
      title: "Notificatie-instellingen bijgewerkt",
      description: "Uw notificatievoorkeuren zijn succesvol opgeslagen.",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notificatie-instellingen</h3>
        <p className="text-sm text-muted-foreground">
          Bepaal hoe en wanneer u meldingen wilt ontvangen.
        </p>
      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="emailNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">E-mail notificaties</FormLabel>
                  <FormDescription>
                    Ontvang alle meldingen via e-mail.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="projectUpdates"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Project updates</FormLabel>
                  <FormDescription>
                    Ontvang meldingen over updates aan projecten.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="connectionUpdates"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Aansluiting updates</FormLabel>
                  <FormDescription>
                    Ontvang meldingen over wijzigingen in aansluitingen.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="taskAssignments"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Taak toewijzingen</FormLabel>
                  <FormDescription>
                    Ontvang meldingen wanneer taken aan u worden toegewezen.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="securityAlerts"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Beveiligingswaarschuwingen</FormLabel>
                  <FormDescription>
                    Ontvang belangrijke meldingen over de beveiliging van uw account.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Voorkeuren opslaan</Button>
        </form>
      </Form>
    </div>
  );
}
