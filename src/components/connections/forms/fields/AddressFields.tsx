
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ConnectionFormValues } from "../schema/connectionFormSchema";

interface AddressFieldsProps {
  form: UseFormReturn<ConnectionFormValues>;
}

export function AddressFields({ form }: AddressFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Adres</FormLabel>
            <FormControl>
              <Input placeholder="Straat en huisnummer" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="postalCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Postcode</FormLabel>
            <FormControl>
              <Input placeholder="1234 AB" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Plaats</FormLabel>
            <FormControl>
              <Input placeholder="Stad" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={form.control}
        name="supplier"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Leverancier</FormLabel>
            <FormControl>
              <Input placeholder="Leverancier" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
