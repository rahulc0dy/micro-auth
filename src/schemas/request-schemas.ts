import { z } from "zod";

export const EmailPassLoginSchema = z.object({
  email: z.string().email().nonempty(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .nonempty(),
});

export const EmailPasswordRegistrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});
