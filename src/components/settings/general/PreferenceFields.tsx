
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { UseFormReturn } from "react-hook-form";
import { GeneralFormValues } from "./types";

interface PreferenceFieldsProps {
  form: UseFormReturn<GeneralFormValues>;
}

export function PreferenceFields({ form }: PreferenceFieldsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => {
            // Ensure we never have an empty string value
            const safeValue = field.value || "nl";
            
            return (
              <FormItem>
                <FormLabel>Taal</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={safeValue}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer een taal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="nl">Nederlands</SelectItem>
                    <SelectItem value="en">Engels</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="theme"
          render={({ field }) => {
            // Ensure we never have an empty string value
            const safeValue = field.value || "light";
            
            return (
              <FormItem>
                <FormLabel>Thema</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={safeValue}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer een thema" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="light">Licht</SelectItem>
                    <SelectItem value="dark">Donker</SelectItem>
                    <SelectItem value="system">Systeemvoorkeur</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            );
          }}
        />
      </div>
      
      <FormField
        control={form.control}
        name="notifications"
        render={({ field }) => (
          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <FormLabel className="text-base">Notificaties</FormLabel>
              <FormMessage />
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
    </div>
  );
}
