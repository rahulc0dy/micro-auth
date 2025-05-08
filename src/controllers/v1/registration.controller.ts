import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { Context } from "hono";

import { STATUS } from "../../constants/status-codes.ts";
import { db } from "../../database";
import { users } from "../../database/schemas/users.ts";
import { EmailPasswordRegistrationSchema } from "../../schemas/request-schemas.ts";
import { ApiError } from "../../utils/api-error.ts";
import { ApiResponse } from "../../utils/api-response.ts";

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
