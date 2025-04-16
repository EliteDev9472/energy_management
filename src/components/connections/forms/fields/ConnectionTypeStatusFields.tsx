
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ConnectionFormValues } from "../schema/connectionFormSchema";

interface ConnectionTypeStatusFieldsProps {
  form: UseFormReturn<ConnectionFormValues>;
}

export function ConnectionTypeStatusFields({ form }: ConnectionTypeStatusFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Elektriciteit">Elektriciteit</SelectItem>
                <SelectItem value="Gas">Gas</SelectItem>
                <SelectItem value="Water">Water</SelectItem>
                <SelectItem value="Warmte">Warmte</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="status"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Status</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecteer status" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Actief">Actief</SelectItem>
                <SelectItem value="Inactief">Inactief</SelectItem>
                <SelectItem value="In aanvraag">In aanvraag</SelectItem>
                <SelectItem value="Storing">Storing</SelectItem>
                <SelectItem value="Geblokkeerd">Geblokkeerd</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
