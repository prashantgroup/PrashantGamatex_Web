import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  company: z.enum(["PrashantGamatex", "WestPoint", "Ferber"], {
    errorMap: () => ({ message: "Please select a company" }),
  }),
});

export type LoginFormData = z.infer<typeof loginSchema>; 