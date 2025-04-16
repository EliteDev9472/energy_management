import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Connection, ConnectionStatus, ConnectionType } from "@/types/connection";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { connectionService } from "@/services/connections/connectionService";
import { connectionFormSchema } from './schema/connectionFormSchema';
import { BasicDetailsTab } from "./tabs/BasicDetailsTab";
import { TechnicalDetailsTab } from "./tabs/TechnicalDetailsTab";

type FormValues = z.infer<typeof connectionFormSchema>;

interface ConnectionEditFormProps {
  connection: Connection;
  onSubmit?: (connection: Connection) => Promise<void>;
  onCancel?: () => void;
}

export function ConnectionEditForm({ connection, onSubmit, onCancel }: ConnectionEditFormProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("details");
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(connectionFormSchema),
    defaultValues: {
      address: connection.address || "",
      city: connection.city || "",
      postalCode: connection.postalCode || "",
      type: connection.type as string || "",
      status: connection.status as string || "",
      supplier: connection.supplier || "",
      organization: connection.organization || "",
      entity: connection.entity || "",
      project: connection.project || "",
      complex: connection.complex || "",
      object: connection.object || "",
      gridOperator: connection.gridOperator || "",
      ean: connection.ean || "",
      capacity: connection.capacity || "",
      meteringCompany: connection.meteringCompany || "",
      gridOperatorWorkNumber: connection.gridOperatorWorkNumber || "",
      gridOperatorContact: connection.gridOperatorContact || "",
      meteringType: connection.technicalSpecifications?.meteringType || connection.meteringType || "",
    },
  });
  
  const handleSubmit = async (values: FormValues) => {
    setIsSaving(true);
    
    try {
      const updatedConnection: Connection = {
        ...connection,
        address: values.address,
        city: values.city,
        postalCode: values.postalCode,
        type: values.type as ConnectionType,
        status: values.status as ConnectionStatus,
        supplier: values.supplier || "",
        organization: values.organization || "",
        entity: values.entity || "",
        project: values.project || "",
        complex: values.complex || "", 
        object: values.object || "",
        gridOperator: values.gridOperator || "",
        ean: values.ean || "",
        capacity: values.capacity || "",
        meteringCompany: values.meteringCompany || "",
        gridOperatorWorkNumber: values.gridOperatorWorkNumber || "",
        gridOperatorContact: values.gridOperatorContact || "",
        
        technicalSpecifications: {
          ...(connection.technicalSpecifications || {}),
          meteringType: values.meteringType || ""
        },
        
        contract: connection.contract || {
          endDate: "",
          price: "",
          type: "",
          startDate: "",
          conditions: ""
        },
      };
      
      if (onSubmit) {
        await onSubmit(updatedConnection);
      } else {
        const result = await connectionService.updateConnection(updatedConnection);
        
        if (result) {
          toast({
            title: "Aansluiting bijgewerkt",
            description: "De aansluiting is succesvol bijgewerkt.",
          });
          navigate(`/connections/${connection.id}`);
        } else {
          throw new Error("Failed to update connection");
        }
      }
    } catch (error) {
      console.error("Error saving connection:", error);
      toast({
        title: "Fout bij opslaan",
        description: "Er is een fout opgetreden bij het opslaan van de aansluiting.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate(`/connections/${connection.id}`);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-card border-b rounded-b-none rounded-t-lg px-6 pt-4">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="technical">Technische gegevens</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <BasicDetailsTab form={form} connection={connection} />
            </TabsContent>
            
            <TabsContent value="technical">
              <TechnicalDetailsTab form={form} />
            </TabsContent>
          </Tabs>
        </Card>
        
        <div className="mt-6 flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            Annuleren
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? "Opslaan..." : "Opslaan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
