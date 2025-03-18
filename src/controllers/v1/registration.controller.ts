import type { Context } from "hono";
import { z } from "zod";
import { db } from "../../database";
import { users } from "../../database/schemas/users.ts";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

const emailPasswordSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const registrationController = async (c: Context) => {
  const body = await c.req.parseBody();
  console.log(body);

  const { name, email, password } = emailPasswordSchema.parse(body);

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(email, users.email));

  if (!existingUser || existingUser.length > 0) {
    throw new Error("User already exists, please use a different email.");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await db
    .insert(users)
    .values({ email, passwordHash: hashedPassword, name: name });

  return c.json({
    success: true,
    message: "Registration successful",
    data: user,
  });
};
