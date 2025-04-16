
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CapacitySelector } from "../CapacitySelector";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ConnectionFormValues } from "../schema/connectionFormSchema";
import { MeterTypeSelector } from "../MeterTypeSelector";
import { Building, Gauge } from "lucide-react";

interface TechnicalDetailsTabProps {
  form: UseFormReturn<ConnectionFormValues>;
}

export function TechnicalDetailsTab({ form }: TechnicalDetailsTabProps) {
  return (
    <CardContent className="p-6 space-y-4">
      <div className="space-y-2">
        <h3 className="text-base font-medium flex items-center gap-2">
          <Gauge className="h-5 w-5 text-muted-foreground" /> Metergegevens
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="meteringType"
            render={({ field }) => (
              <MeterTypeSelector
                value={field.value || ""}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-base font-medium flex items-center gap-2">
          <Building className="h-5 w-5 text-muted-foreground" /> Netbeheerder & Leverancier
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="gridOperator"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Netbeheerder</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value || ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecteer netbeheerder" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Liander">Liander</SelectItem>
                    <SelectItem value="Stedin">Stedin</SelectItem>
                    <SelectItem value="Enexis">Enexis</SelectItem>
                    <SelectItem value="Westland">Westland</SelectItem>
                    <SelectItem value="Coteq">Coteq</SelectItem>
                    <SelectItem value="Rendo">Rendo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <CapacitySelector 
                connectionType={form.watch('type')} 
                value={field.value || ""} 
                onChange={field.onChange}
              />
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <FormField
            control={form.control}
            name="meteringCompany"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meetbedrijf</FormLabel>
                <FormControl>
                  <Input placeholder="Meetbedrijf" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gridOperatorWorkNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Netbeheerder werknummer</FormLabel>
                <FormControl>
                  <Input placeholder="Werknummer" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="gridOperatorContact"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Netbeheerder contactpersoon</FormLabel>
                <FormControl>
                  <Input placeholder="Contactpersoon" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>
    </CardContent>
  );
}
