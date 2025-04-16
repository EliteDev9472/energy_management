
import { z } from "zod";
import { UserRole } from "@/types/user";

export const formSchema = z.object({
  name: z.string().min(2, "Naam moet minimaal 2 karakters zijn"),
  email: z.string().email("Geen geldig e-mailadres"),
  password: z.string().min(8, "Wachtwoord moet minimaal 8 karakters zijn"),
  role: z.enum(["admin", "consultant", "client"]),
  organizationId: z.string().optional()
});

export type UserFormValues = z.infer<typeof formSchema>;
