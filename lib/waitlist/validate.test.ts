import { describe, expect, it } from "vitest";
import { validateWaitlist } from "./validate";

describe("validateWaitlist", () => {
  it("accepts a valid signup and normalizes email", () => {
    const r = validateWaitlist({ email: " A@Example.com ", firstName: "Ana", monthlyLbs: "1-2 lb", subscriptionInterest: true });
    expect(r).toEqual({ ok: true, data: { email: "a@example.com", firstName: "Ana", roastMethod: undefined, monthlyLbs: "1-2 lb", bagSizes: undefined, heardFrom: undefined, source: undefined, subscriptionInterest: true } });
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

describe("bag sizes", () => {
  it("keeps only known sizes", () => {
    const r = validateWaitlist({ email: "a@b.co", firstName: "A", bagSizes: ["1 lb", "5 kg", "8 oz"] });
    expect(r.ok && r.data.bagSizes).toEqual(["8 oz", "1 lb"]);
  });
});

describe("source tracking", () => {
  it("accepts known heardFrom and safe src only", () => {
    const r = validateWaitlist({ email: "a@b.co", firstName: "A", heardFrom: "Reddit", source: "FB-Page" });
    expect(r.ok && [r.data.heardFrom, r.data.source]).toEqual(["Reddit", "fb-page"]);
    const bad = validateWaitlist({ email: "a@b.co", firstName: "A", heardFrom: "x", source: "<script>" });
    expect(bad.ok && [bad.data.heardFrom, bad.data.source]).toEqual([undefined, undefined]);
  });
});
