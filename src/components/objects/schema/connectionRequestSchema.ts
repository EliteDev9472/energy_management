
import { z } from "zod";

export const connectionRequestSchema = z.object({
  address: z.string().min(1, { message: "Adres is verplicht" }),
  city: z.string().min(1, { message: "Stad is verplicht" }),
  postalCode: z.string().min(1, { message: "Postcode is verplicht" }),
  type: z.string().min(1, { message: "Type is verplicht" }),
  capacity: z.string().min(1, { message: "Capaciteit is verplicht" }),
  gridOperator: z.string().min(1, { message: "Netbeheerder is verplicht" }),
  desiredConnectionDate: z.string().min(1, { message: "Gewenste aansluitdatum is verplicht" }),
  installer: z.string().optional(),
  installerEmail: z.string().email({ message: "Ongeldig e-mailadres" }).optional().or(z.literal('')),
  installerPhone: z.string().optional(),
  ean: z.string().optional()
});

export type ConnectionRequestFormValues = z.infer<typeof connectionRequestSchema>;
