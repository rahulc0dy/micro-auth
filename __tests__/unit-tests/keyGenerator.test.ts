import { describe, expect, test } from "bun:test";
import { keyGenerator } from "../../src/utils/keyGenerator";

describe("keyGenerator", () => {
  test("should use X-Forwarded-For IP when available", () => {
    const mockContext = {
      req: {
        header: (name: string) => {
          if (name === "X-Forwarded-For") return "192.168.1.1, 10.0.0.1";
          if (name === "User-Agent") return "test-agent";
          return null;
        },
      },
      env: {
        server: {
          requestIP(ctx: any) {
            return ctx?.connInfo?.remote.address || "";
          },
        },
      },
      get connInfo() {
        return {
          remote: {
            address: "127.0.0.1",
          },
        };
      },
    };

    const key = keyGenerator(mockContext as any);
    expect(key).toBe("192.168.1.1-test-agent");
  });

  test.skip("should use connection info IP when X-Forwarded-For is not available", () => {
    const mockContext = {
      req: {
        header: (name: string) => {
          if (name === "User-Agent") return "test-agent";
          return null;
        },
      },
      env: {
        server: {
          requestIP(ctx: any) {
            return ctx?.connInfo?.remote.address || "";
          },
        },
      },
      get connInfo() {
        return {
          remote: {
            address: "127.0.0.1",
          },
        };
      },
    };

    const key = keyGenerator(mockContext as any);
    expect(key).toBe("127.0.0.1-test-agent");
  });

  test.skip("should handle missing User-Agent", () => {
    const mockContext = {
      req: {
        header: () => null,
      },
      env: {
        server: {
          requestIP(ctx: any) {
            return ctx?.connInfo?.remote.address || "";
          },
        },
      },
      get connInfo() {
        return {
          remote: {
            address: "127.0.0.1",
          },
        };
      },
    };

    const key = keyGenerator(mockContext as any);
    expect(key).toBe("127.0.0.1-unknown");
  });
});
