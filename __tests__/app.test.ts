import { describe, test } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import app from "../src/app.ts";

describe("App creation.", () => {
    test('GET /health-check/server', async () => {
        const res = await app.request('/api/v1/health-check/server')
        expect(res.status).toBe(200)
        expect(await res.json()).toEqual({status:'Server running.'});
    })
});