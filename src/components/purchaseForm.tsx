// This file provide validation for advertisement

import { z } from "zod";

export const PurchaseFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Namn krävs.")
    .max(100, "Namnet är för långt."),
  email: z
    .string()
    .email("Ogiltig e-postadress."),
  message: z
    .string()
    .trim()
    .min(5, "Meddelandet är för kort.")
    .max(1000, "Meddelandet är för långt."),
  link: z
    .union([
      z.string().url("Ogiltig URL.").max(2048),
      z.literal(""),
      z.undefined(),
      z.null(),
    ])
    .optional()
    .transform((val) => {
      if (!val || val === "") return undefined;
      return val;
    }),
  source: z.enum(["ad", "link"]).optional(),
});


export type PurchaseFormData = z.infer<typeof PurchaseFormSchema>;
