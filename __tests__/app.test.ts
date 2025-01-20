import { describe, it } from "jsr:@std/testing/bdd";
import { expect } from "jsr:@std/expect";
import { add } from "./add.ts";

describe("add function", () => {
    it("adds two numbers correctly", () => {
        const result = add(2, 3);
        expect(result).toBe(5);
    });

    it("handles negative numbers", () => {
        const result = add(-2, -3);
        expect(result).toBe(-5);
    });
});
