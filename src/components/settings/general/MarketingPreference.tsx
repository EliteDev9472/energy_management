
import { FormField, FormItem, FormLabel, FormControl, FormDescription } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { GeneralFormValues } from "./types";

interface MarketingPreferenceProps {
  form: UseFormReturn<GeneralFormValues>;
}

export function MarketingPreference({ form }: MarketingPreferenceProps) {
  return (
    <FormField
      control={form.control}
      name="marketing_emails"
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <FormLabel className="text-base">Marketing e-mails</FormLabel>
            <FormDescription>
              Ontvang e-mails over nieuwe functies en updates.
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
  );
}
