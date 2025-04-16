
import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { GeneralFormValues } from "./types";

interface NameEmailFieldsProps {
  form: UseFormReturn<GeneralFormValues>;
}

export function NameEmailFields({ form }: NameEmailFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Naam</FormLabel>
            <FormControl>
              <Input placeholder="Uw naam" {...field} />
            </FormControl>
            <FormDescription>
              Dit is uw volledige naam zoals weergegeven in het systeem.
            </FormDescription>
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
              <Input placeholder="voorbeeld@cedrus.nl" {...field} />
            </FormControl>
            <FormDescription>
              Dit e-mailadres wordt gebruikt voor inloggen en communicatie.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
