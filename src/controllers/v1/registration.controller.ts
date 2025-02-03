import { Context } from "hono";
import { z } from "zod";

const emailPasswordSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const registrationController = async (c: Context) => {
  const body = await c.req.parseBody();
  console.log(body);
  const validatedData = emailPasswordSchema.parse(body);

  const { name, email, password } = validatedData;

  // TODO:Perform any registrationController logic here, e.g., saving to the database

  return c.json({
    success: true,
    message: "Registration successful",
    data: { name, email, password },
  });
};
