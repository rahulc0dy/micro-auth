import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { Context } from "hono";

import { STATUS } from "../../constants/status-codes.ts";
import { db } from "../../database";
import { users } from "../../database/schemas/users.ts";
import { EmailPassLoginSchema } from "../../schemas/request-schemas.ts";
import { ApiError } from "../../utils/api-error.ts";
import { ApiResponse } from "../../utils/api-response.ts";

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
