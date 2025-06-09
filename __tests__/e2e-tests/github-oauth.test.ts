import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import { serve } from "bun";
import app from "../../src/app.ts";
import { SECURE_API_KEY } from "../../src/env.ts";

// Minimal test app with both routes

let server: ReturnType<typeof serve>;
let baseUrl: string;

beforeAll(() => {
  server = serve({
    fetch: app.fetch,
    port: 0, // random available port
  });
  baseUrl = `http://localhost:${server.port}`;
});
afterAll(() => {
  server.stop();
});

describe("GitHub OAuth e2e", () => {
  test("redirects to GitHub with state cookie", async () => {
    const res = await fetch(`${baseUrl}/api/v1/oauth/github`, {
      redirect: "manual",
      headers: {
        "x-secure-api-key": SECURE_API_KEY,
      },
    });

    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toMatch(
      /^https:\/\/github.com\/login\/oauth\/authorize\?/
    );

    const setCookie = res.headers.get("set-cookie");
    expect(setCookie).toContain("github-oauth-state=");
  });

  test("fails when callback is accessed without state/correct cookies", async () => {
    // no code/state
    let res = await fetch(`${baseUrl}/api/v1/oauth/github/callback`, {
      headers: {
        "x-secure-api-key": SECURE_API_KEY,
      },
    });
    expect(res.status).toBe(400);

    // with right state param but no cookie
    res = await fetch(
      `${baseUrl}/api/v1/oauth/github/callback?code=somecode&state=fake`,
      {
        headers: {
          "x-secure-api-key": SECURE_API_KEY,
        },
      }
    );
    expect(res.status).toBe(400);
  });

  test.todo("handles full oauth flow success", async () => {
    const redirectRes = await fetch(`${baseUrl}/api/v1/oauth/github`, {
      redirect: "manual",
      headers: {
        "x-secure-api-key": SECURE_API_KEY,
      },
    });
    const setCookie = redirectRes.headers.get("set-cookie");
    const state = /github-oauth-state=([^;]+)/.exec(setCookie || "")?.[1];
    expect(state).toBeTruthy();

    const oldFetch = globalThis.fetch;
    globalThis.fetch = (async (input: RequestInfo, init?: RequestInit) => {
      if (
        typeof input === "string" &&
        input.startsWith("https://github.com/login/oauth/access_token")
      ) {
        return new Response(
          JSON.stringify({ access_token: "fake-access-token" }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      if (
        typeof input === "string" &&
        input.startsWith("https://api.github.com/user")
      ) {
        return new Response(
          JSON.stringify({
            id: 42,
            name: "Bun Tester",
            email: "bun@example.com",
            avatar_url: "https://example.com/avatar.png",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      // fallback to real
      return oldFetch(input, init);
    }) as typeof fetch;

    const callbackRes = await fetch(
      `${baseUrl}/api/v1/oauth/github/callback?code=magic-code&state=${state}`,
      {
        headers: {
          cookie: `github-oauth-state=${state}`,
          "x-secure-api-key": SECURE_API_KEY,
        },
      }
    );
    expect(callbackRes.status).toBe(200);

    const resJson = await callbackRes.json();
    expect(resJson.success).toBe(true);
    expect(resJson.data.user).toMatchObject({
      id: 42,
      name: "Bun Tester",
      email: "bun@example.com",
      avatar: "https://example.com/avatar.png",
    });

    // restore global fetch
    globalThis.fetch = oldFetch;
  });

  test.todo("returns error for github access_token API error", async () => {
    // get state cookie
    const redirectRes = await fetch(`${baseUrl}/api/v1/oauth/github`, {
      redirect: "manual",
      headers: {
        "x-secure-api-key": SECURE_API_KEY,
      },
    });
    const setCookie = redirectRes.headers.get("set-cookie");
    const state = /github-oauth-state=([^;]+)/.exec(setCookie || "")?.[1];

    const oldFetch = globalThis.fetch;
    globalThis.fetch = (async (input: RequestInfo, init?: RequestInit) => {
      if (
        typeof input === "string" &&
        input.startsWith("https://github.com/login/oauth/access_token")
      ) {
        return new Response("fail", { status: 500 });
      }
      return oldFetch(input, init);
    }) as typeof fetch;

    const callbackRes = await fetch(
      `${baseUrl}/api/v1/oauth/github/callback?code=xxx&state=${state}`,
      {
        headers: {
          cookie: `github-oauth-state=${state}`,
          "x-secure-api-key": SECURE_API_KEY,
        },
      }
    );
    expect(callbackRes.status).toBe(500);

    globalThis.fetch = oldFetch;
  });

  test.todo("returns error for github user API error", async () => {
    // get state cookie
    const redirectRes = await fetch(`${baseUrl}/api/v1/oauth/github`, {
      redirect: "manual",
      headers: {
        "x-secure-api-key": SECURE_API_KEY,
      },
    });
    const setCookie = redirectRes.headers.get("set-cookie");
    const state = /github-oauth-state=([^;]+)/.exec(setCookie || "")?.[1];

    const oldFetch = globalThis.fetch;
    globalThis.fetch = (async (input: RequestInfo, init?: RequestInit) => {
      if (
        typeof input === "string" &&
        input.startsWith("https://github.com/login/oauth/access_token")
      ) {
        return new Response(JSON.stringify({ access_token: "fake" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (
        typeof input === "string" &&
        input.startsWith("https://api.github.com/user")
      ) {
        return new Response("fail", { status: 500 });
      }
      return oldFetch(input, init);
    }) as typeof fetch;

    const callbackRes = await fetch(
      `${baseUrl}/api/v1/oauth/github/callback?code=yyy&state=${state}`,
      {
        headers: {
          cookie: `github-oauth-state=${state}`,
          "x-secure-api-key": SECURE_API_KEY,
        },
      }
    );
    expect(callbackRes.status).toBe(500);

    globalThis.fetch = oldFetch;
  });
});
