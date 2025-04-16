
import { FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CONNECTION_TYPE_OPTIONS, CONNECTION_STATUS_OPTIONS, Connection } from "@/types/connection";
import { HierarchyBreadcrumb } from "../HierarchyBreadcrumb";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { ConnectionFormValues } from "../schema/connectionFormSchema";

interface BasicDetailsTabProps {
  form: UseFormReturn<ConnectionFormValues>;
  connection?: Connection;
}

export function BasicDetailsTab({ form, connection }: BasicDetailsTabProps) {
  const [selectedOrganization, setSelectedOrganization] = useState(form.getValues().organization || '');
  const [selectedEntity, setSelectedEntity] = useState(form.getValues().entity || '');
  const [selectedProject, setSelectedProject] = useState(form.getValues().project || '');
  const [selectedComplex, setSelectedComplex] = useState(form.getValues().complex || '');
  const [selectedObject, setSelectedObject] = useState(form.getValues().object || '');

  return (
    <CardContent className="space-y-6 pt-6">
      {/* Hierarchy Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Hiërarchie</h3>
        <HierarchyBreadcrumb
          selectedOrganization={selectedOrganization}
          selectedEntity={selectedEntity}
          selectedProject={selectedProject}
          selectedComplex={selectedComplex}
          selectedObject={selectedObject}
          onOrganizationChange={(id, name) => {
            setSelectedOrganization(id);
            form.setValue("organization", id);
            // Reset lower hierarchy selections when organization changes
            setSelectedEntity("");
            setSelectedProject("");
            setSelectedComplex("");
            setSelectedObject("");
            form.setValue("entity", "");
            form.setValue("project", "");
            form.setValue("complex", "");
            form.setValue("object", "");
          }}
          onEntityChange={(id, name) => {
            setSelectedEntity(id);
            form.setValue("entity", id);
            // Reset lower hierarchy selections when entity changes
            setSelectedProject("");
            setSelectedComplex("");
            setSelectedObject("");
            form.setValue("project", "");
            form.setValue("complex", "");
            form.setValue("object", "");
          }}
          onProjectChange={(id, name) => {
            setSelectedProject(id);
            form.setValue("project", id);
            // Reset lower hierarchy selections when project changes
            setSelectedComplex("");
            setSelectedObject("");
            form.setValue("complex", "");
            form.setValue("object", "");
          }}
          onComplexChange={(id, name) => {
            setSelectedComplex(id);
            form.setValue("complex", id);
            // Reset object selection when complex changes
            setSelectedObject("");
            form.setValue("object", "");
          }}
          onObjectChange={(id, name) => {
            setSelectedObject(id);
            form.setValue("object", id);
          }}
        />
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Adresgegevens</h3>
        <div className="grid grid-cols-1 gap-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adres</FormLabel>
                <FormControl>
                  <Input placeholder="Hoofdstraat 12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plaats</FormLabel>
                  <FormControl>
                    <Input placeholder="Amsterdam" {...field} />
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
                    <Input placeholder="1234AB" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Connection Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-muted-foreground">Aansluiting Details</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(CONNECTION_TYPE_OPTIONS).map(([key, value]) => (
                        <SelectItem key={key} value={value.toLowerCase()}>
                          {value}
                        </SelectItem>
                      ))}
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
                  <Select 
                    onValueChange={field.onChange} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(CONNECTION_STATUS_OPTIONS).map(([key, value]) => (
                        <SelectItem key={key} value={key.toLowerCase()}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="ean"
            render={({ field }) => (
              <FormItem>
                <FormLabel>EAN</FormLabel>
                <FormControl>
                  <Input placeholder="871687..." {...field} />
                </FormControl>
                <FormDescription>
                  EAN-code van de aansluiting (18 cijfers)
                </FormDescription>
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
                  <Input placeholder="Vattenfall" {...field} />
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
