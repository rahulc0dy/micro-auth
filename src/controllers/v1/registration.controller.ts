import type { Context } from "hono";
import { z } from "zod";
import { db } from "../../database";
import { users } from "../../database/schemas/users.ts";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { STATUS } from "../../constants/statusCodes.ts";
import { ApiResponse } from "../../utils/ApiResponse.ts";

const EmailPasswordRegistrationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const registrationController = async (c: Context) => {
  const body = await c.req.parseBody();

  const { name, email, password } = EmailPasswordRegistrationSchema.parse(body);

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existingUser && existingUser.length > 0) {
    throw new ApiError({
      message: "User already exists, please use a different email.",
      statusCode: STATUS.CLIENT_ERROR.BAD_REQUEST,
      errors: [{ message: "Email already registered", field: email }],
    });
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await db
    .insert(users)
    .values({ email, passwordHash: hashedPassword, name: name })
    .returning({
      id: users.id,
      name: users.name,
      email: users.email,
      createdAt: users.createdAt,
    });

  if (!user || !user[0]) {
    throw new ApiError({
      message: "Could not create user.",
      statusCode: STATUS.SERVER_ERROR.INTERNAL_SERVER_ERROR,
      errors: [{ message: "Failed to create user record" }],
    });
  }

  return c.json(
    new ApiResponse({
      success: true,
      message: "Registration successful",
      data: {
        user: user[0],
      },
    }),
    {
      status: STATUS.SUCCESS.CREATED,
    }
  );
};
