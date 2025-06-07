import { afterEach, describe, expect, spyOn, test } from "bun:test";
import app from "../../src/app.ts";

// Adjust these if your endpoints are prefixed (e.g., "/api/v1/oauth/github")
const OAUTH_REDIRECT = "/oauth/github";
const OAUTH_CALLBACK = "/oauth/callback";

afterEach(() => {
  // Restore all spies/mocks between tests
  globalThis.fetch && (globalThis.fetch as any).mockRestore?.();
});

describe("GitHub OAuth End-to-End", () => {
  test("GET /oauth/github should redirect to GitHub", async () => {
    const res = await app.request(OAUTH_REDIRECT);
    expect(res.status).toBe(302);
    const location = res.headers.get("location");
    expect(location).toBeTruthy();
    expect(location).toMatch(
      /^https:\/\/github.com\/login\/oauth\/authorize\?/
    );
  });

  test("GET /oauth/callback without code should fail", async () => {
    const res = await app.request(OAUTH_CALLBACK);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toBe("No code provided");
  });

  test("GET /oauth/callback returns error if access_token missing", async () => {
    spyOn(globalThis, "fetch").mockImplementation(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url =
          typeof input === "string"
            ? input
            : input instanceof URL
              ? input.href
              : input.url;
        // Now use `url` for your logic
        if (url.includes("access_token")) {
          return new Response(JSON.stringify({ access_token: "dummy_token" }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }
        if (url.includes("api.github.com/user")) {
          return new Response(
            JSON.stringify({
              id: 123456,
              name: "Test User",
              email: "testuser@example.com",
              avatar_url: "https://avatars.githubusercontent.com/u/123456?v=4",
            }),
            {
              status: 200,
              headers: { "content-type": "application/json" },
            }
          );
        }
        return new Response(null, { status: 404 });
      }
    );
    const res = await app.request(`${OAUTH_CALLBACK}?code=testcode`);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.message).toBe("No access token provided");
  });

  test("GET /oauth/callback returns user data on success", async () => {
    spyOn(globalThis, "fetch").mockImplementation(
      async (input: RequestInfo | URL, init?: RequestInit) => {
        const url =
          typeof input === "string"
            ? input
            : input instanceof URL
              ? input.href
              : input.url;
        // Now use `url` for your logic
        if (url.includes("access_token")) {
          return new Response(JSON.stringify({ access_token: "dummy_token" }), {
            status: 200,
            headers: { "content-type": "application/json" },
          });
        }
        if (url.includes("api.github.com/user")) {
          return new Response(
            JSON.stringify({
              id: 123456,
              name: "Test User",
              email: "testuser@example.com",
              avatar_url: "https://avatars.githubusercontent.com/u/123456?v=4",
            }),
            {
              status: 200,
              headers: { "content-type": "application/json" },
            }
          );
        }
        return new Response(null, { status: 404 });
      }
    );

    const res = await app.request(`${OAUTH_CALLBACK}?code=validcode`);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.message).toBe("User authenticated");
    expect(json.data.user).toMatchObject({
      id: 123456,
      name: "Test User",
      email: "testuser@example.com",
      avatar: "https://avatars.githubusercontent.com/u/123456?v=4",
    });
  });
});
