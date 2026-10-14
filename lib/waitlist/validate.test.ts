import { describe, expect, it } from "vitest";
import { validateWaitlist } from "./validate";

describe("validateWaitlist", () => {
  it("accepts a valid signup and normalizes email", () => {
    const r = validateWaitlist({ email: " A@Example.com ", firstName: "Ana", monthlyLbs: "1-2 lb", subscriptionInterest: true });
    expect(r).toEqual({ ok: true, data: { email: "a@example.com", firstName: "Ana", roastMethod: undefined, monthlyLbs: "1-2 lb", subscriptionInterest: true } });
  });
  it("rejects bad email", () => {
    expect(validateWaitlist({ email: "nope", firstName: "A" }).ok).toBe(false);
  });
  it("rejects missing name", () => {
    expect(validateWaitlist({ email: "a@b.co", firstName: "" }).ok).toBe(false);
  });
  it("drops unknown option values", () => {
    const r = validateWaitlist({ email: "a@b.co", firstName: "A", roastMethod: "x", monthlyLbs: "9 lb" });
    expect(r.ok && r.data.roastMethod).toBeUndefined();
    expect(r.ok && r.data.monthlyLbs).toBeUndefined();
  });
});
