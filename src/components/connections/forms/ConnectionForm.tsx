
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { ConnectionFormValues, connectionFormSchema } from "./schema/connectionFormSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { HierarchyBreadcrumb } from "./HierarchyBreadcrumb"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { EanCodeLookup } from "./EanCodeLookup"
import { EanCodeInfo } from "@/utils/eanUtils"
import { MeterTypeSelector } from "./MeterTypeSelector"

interface ConnectionFormProps {
  onSubmit: (values: ConnectionFormValues) => void;
  initialValues?: Partial<ConnectionFormValues>;
}

export function ConnectionForm({ onSubmit, initialValues }: ConnectionFormProps) {
  const [selectedOrganization, setSelectedOrganization] = useState<string>(initialValues?.organization || '');
  const [selectedEntity, setSelectedEntity] = useState<string>(initialValues?.entity || '');
  const [selectedProject, setSelectedProject] = useState<string>(initialValues?.project || '');
  const [selectedComplex, setSelectedComplex] = useState<string>(initialValues?.complex || '');
  const [selectedObject, setSelectedObject] = useState<string>(initialValues?.object || '');
  
  const form = useForm<ConnectionFormValues>({
    resolver: zodResolver(connectionFormSchema),
    defaultValues: {
      address: initialValues?.address || "",
      city: initialValues?.city || "",
      postalCode: initialValues?.postalCode || "",
      type: initialValues?.type || "electricity",
      status: initialValues?.status || "active",
      organization: initialValues?.organization || "",
      entity: initialValues?.entity || "",
      project: initialValues?.project || "",
      complex: initialValues?.complex || "",
      object: initialValues?.object || "",
      gridOperator: initialValues?.gridOperator || "",
      ean: initialValues?.ean || "",
      capacity: initialValues?.capacity || "",
      meteringCompany: initialValues?.meteringCompany || "",
      supplier: initialValues?.supplier || "",
      gridOperatorWorkNumber: initialValues?.gridOperatorWorkNumber || "",
      gridOperatorContact: initialValues?.gridOperatorContact || "",
      meteringType: initialValues?.meteringType || "",
    },
    mode: "onChange"
  });

  const handleEanCodeFound = (info: EanCodeInfo) => {
    // Auto-fill form based on retrieved EAN data
    form.setValue('address', info.address);
    form.setValue('city', info.city);
    form.setValue('postalCode', info.postalCode);
    form.setValue('gridOperator', info.gridOperator);
    form.setValue('type', info.connectionType.toLowerCase());
    form.setValue('capacity', info.capacity);
    
    toast({
      title: "EAN code gevonden",
      description: "Adresgegevens zijn automatisch ingevuld.",
    });
  };

  const handleSubmit = (values: ConnectionFormValues) => {
    if (!values.ean || values.ean.trim() === '') {
      toast({
        title: "Validatiefout",
        description: "EAN code is verplicht voor aansluitingen",
        variant: "destructive",
      });
      return;
    }
    
    if (!values.organization || !values.entity || !values.project || !values.complex || !values.object) {
      toast({
        title: "Hiërarchie ontbreekt",
        description: "Alle hiërarchie elementen (organisatie, entiteit, project, complex, object) zijn verplicht",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Hierarchy Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Hiërarchie</h3>
          <HierarchyBreadcrumb 
            selectedOrganization={selectedOrganization}
            selectedEntity={selectedEntity}
            selectedProject={selectedProject}
            selectedComplex={selectedComplex}
            selectedObject={selectedObject}
            onOrganizationChange={(value, name) => {
              setSelectedOrganization(value);
              form.setValue("organization", value);
            }}
            onEntityChange={(value, name) => {
              setSelectedEntity(value);
              form.setValue("entity", value);
            }}
            onProjectChange={(value, name) => {
              setSelectedProject(value);
              form.setValue("project", value);
            }}
            onComplexChange={(value, name) => {
              setSelectedComplex(value);
              form.setValue("complex", value);
            }}
            onObjectChange={(value, name) => {
              setSelectedObject(value);
              form.setValue("object", value);
            }}
          />
        </div>

        {/* EAN Code Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Aansluiting Identificatie</h3>
          <FormField
            control={form.control}
            name="ean"
            render={({ field }) => (
              <FormItem>
                <EanCodeLookup
                  value={field.value || ""}
                  onChange={field.onChange}
                  onCodeFound={handleEanCodeFound}
                />
              </FormItem>
            )}
          />
        </div>

        {/* Address Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Adresgegevens</h3>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adres <span className="text-red-500">*</span></FormLabel>
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
                    <FormLabel>Plaats <span className="text-red-500">*</span></FormLabel>
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
                    <FormLabel>Postcode <span className="text-red-500">*</span></FormLabel>
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

        {/* Connection Type Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Type & Status</h3>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer een type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="electricity">Elektriciteit</SelectItem>
                      <SelectItem value="gas">Gas</SelectItem>
                      <SelectItem value="water">Water</SelectItem>
                      <SelectItem value="heat">Warmte</SelectItem>
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
                  <FormLabel>Status <span className="text-red-500">*</span></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecteer een status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="active">Actief</SelectItem>
                      <SelectItem value="inactive">Inactief</SelectItem>
                      <SelectItem value="pending">In behandeling</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Technical Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Technische Gegevens</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capaciteit</FormLabel>
                  <FormControl>
                    <Input placeholder="bijv. 3x25A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="gridOperator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Netbeheerder</FormLabel>
                  <FormControl>
                    <Input placeholder="bijv. Liander" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="meteringCompany"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meetbedrijf</FormLabel>
                  <FormControl>
                    <Input placeholder="bijv. Kenter" {...field} />
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
                    <Input placeholder="bijv. Vattenfall" {...field} />
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
                  <FormLabel>Werknummer netbeheerder</FormLabel>
                  <FormControl>
                    <Input placeholder="bijv. WN12345" {...field} />
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
                  <FormLabel>Contactpersoon netbeheerder</FormLabel>
                  <FormControl>
                    <Input placeholder="bijv. Jan Janssen" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="meteringType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type meter</FormLabel>
                  <MeterTypeSelector value={field.value} onChange={field.onChange} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="pt-4">
          <Button type="submit" className="w-full md:w-auto">
            Aansluiting Opslaan
          </Button>
        </div>
      </form>
    </Form>
  );
}
