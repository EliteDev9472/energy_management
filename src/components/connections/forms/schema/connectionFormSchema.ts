
import { z } from "zod";

export const connectionFormSchema = z.object({
  // Basics
  address: z.string().min(1, { message: "Adres is verplicht" }),
  city: z.string().min(1, { message: "Stad is verplicht" }),
  postalCode: z.string().min(1, { message: "Postcode is verplicht" }),
  type: z.string().min(1, { message: "Type is verplicht" }),
  status: z.string().min(1, { message: "Status is verplicht" }),
  
  // Hierarchy - make these required
  organization: z.string().min(1, { message: "Organisatie is verplicht" }),
  entity: z.string().min(1, { message: "Entiteit is verplicht" }),
  project: z.string().min(1, { message: "Project is verplicht" }),
  complex: z.string().min(1, { message: "Complex is verplicht" }),
  complexId: z.string().min(1, { message: "Complex ID is verplicht" }),
  object: z.string().min(1, { message: "Object is verplicht" }),
  
  // Technical information - make EAN required only for active connections
  gridOperator: z.string().optional(),
  ean: z.string().optional(),
  capacity: z.string().optional(),
  meteringCompany: z.string().optional(),
  supplier: z.string().optional(),
  gridOperatorWorkNumber: z.string().optional(),
  gridOperatorContact: z.string().optional(),
  
  // Technical specifications
  meteringType: z.string().optional(),
});

export type ConnectionFormValues = z.infer<typeof connectionFormSchema>;
