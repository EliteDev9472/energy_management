
import { z } from "zod";

export const generalFormSchema = z.object({
  name: z.string().min(2, {
    message: "Naam moet minimaal 2 tekens bevatten.",
  }),
  email: z.string().email({
    message: "Voer een geldig e-mailadres in.",
  }),
  language: z.enum(["nl", "en"], {
    required_error: "Selecteer een taal.",
  }),
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Selecteer een thema.",
  }),
  notifications: z.boolean().default(false),
  marketing_emails: z.boolean().default(false),
});

export type GeneralFormValues = z.infer<typeof generalFormSchema>;
