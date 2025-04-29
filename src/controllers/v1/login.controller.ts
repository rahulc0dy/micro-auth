import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { Context } from "hono";
import { z } from "zod";

import { STATUS } from "../../constants/statusCodes.ts";
import { db } from "../../database";
import { users } from "../../database/schemas/users.ts";
import { ApiError } from "../../utils/ApiError.ts";
import { ApiResponse } from "../../utils/ApiResponse.ts";

const EmailPassLoginSchema = z.object({
  email: z.string().email().nonempty(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .nonempty(),
});

export const emailPassLoginController = async (c: Context) => {
  const body = await c.req.parseBody();
  const parsed = EmailPassLoginSchema.parse(body);

  const { email, password } = parsed;

  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (!existingUser || existingUser.length === 0) {
    throw new ApiError({
      message: "User does not exist",
      statusCode: STATUS.CLIENT_ERROR.BAD_REQUEST,
      errors: [{ message: "Email is not registered", field: email }],
    });
  }

  const passwordMatches = await bcrypt.compare(
    password,
    existingUser[0].passwordHash
  );

  if (!passwordMatches) {
    throw new ApiError({
      message: "Incorrect email or password. Please try again.",
      statusCode: STATUS.CLIENT_ERROR.BAD_REQUEST,
      errors: [
        {
          message: "email or password is incorrect",
          field: "email or password",
        },
      ],
    });
  }

  return c.json(
    new ApiResponse({
      message: "Logged in successfully",
      data: {
        email: email,
      },
    })
  );
};
