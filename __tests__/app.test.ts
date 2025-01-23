import { describe, test } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import app from "../src/app.ts";

const urlPrefix = '/api/v1'

describe("App creation.", () => {
    test('GET /health-check/server', async () => {
        const res = await app.request(`${urlPrefix}/health-check/server`)
        expect(res.status).toBe(200)
        expect(await res.json()).toEqual({status:'Server running.'});
    })
});