import crypto from "node:crypto";

import type { Context } from "hono";
import { getSignedCookie, setSignedCookie } from "hono/cookie";

import {
  COOKIE_SECRET,
  GITHUB_CALLBACK_URL,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} from "../../env.ts";
import { ApiError } from "../../utils/api-error.ts";
import { ApiResponse } from "../../utils/api-response.ts";

export const githubOAuthRedirect = async (c: Context) => {
  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id: GITHUB_CLIENT_ID,
    redirect_uri: GITHUB_CALLBACK_URL,
    scope: "user:email",
    allow_signup: "true",
  });

  await setSignedCookie(c, "github-oauth-state", state, COOKIE_SECRET);

  return c.redirect(
    `https://github.com/login/oauth/authorize?${params.toString()}`
  );
};

export const githubOauthCallback = async (c: Context) => {
  const code = c.req.query("code");
  const state = c.req.query("state");
  const expectedState = await getSignedCookie(
    c,
    COOKIE_SECRET,
    "github-oauth-state"
  );

  if (!state || !expectedState || state !== expectedState)
    throw new ApiError({
      message: "Invalid or missing state",
      statusCode: 400,
      errors: [
        {
          message: "State validation failed. Possible CSRF detected.",
          field: "state",
        },
      ],
    });

  if (!code)
    throw new ApiError({
      message: "No code provided",
      statusCode: 400,
      errors: [{ message: "No code provided", field: "code" }],
    });

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: GITHUB_CALLBACK_URL,
    }),
  });

  if (!tokenRes.ok) {
    throw new ApiError({
      message: "Failed to exchange code for token",
      statusCode: 500,
      errors: [
        { message: `GitHub API error: ${tokenRes.status}`, field: "oauth" },
      ],
    });
  }

  const tokenData = await tokenRes.json();

  if (tokenData.error) {
    throw new ApiError({
      message: tokenData.error_description || "OAuth error",
      statusCode: 400,
      errors: [{ message: tokenData.error, field: "oauth" }],
    });
  }

  const accessToken = tokenData.access_token;
  if (!accessToken)
    throw new ApiError({
      message: "No access token provided",
      statusCode: 400,
      errors: [{ message: "No access token provided", field: "access_token" }],
    });

  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!userRes.ok) {
    throw new ApiError({
      message: "Failed to fetch user data",
      statusCode: 500,
      errors: [
        { message: `GitHub API error: ${userRes.status}`, field: "user" },
      ],
    });
  }

  const userData = await userRes.json();

  if (!userData.id) {
    throw new ApiError({
      message: "Invalid user data received",
      statusCode: 500,
      errors: [{ message: "Missing user ID", field: "user" }],
    });
  }

  const user = {
    id: userData.id,
    name: userData.name,
    email: userData.email || null, // email may be private, so we can't rely on it'
    avatar: userData.avatar_url,
  };

  return c.json(
    new ApiResponse({
      message: "User authenticated",
      data: {
        user,
      },
    })
  );
};
