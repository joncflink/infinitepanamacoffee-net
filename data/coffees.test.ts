import { describe, it, expect } from "vitest";
import { getCoffeeByPassportNumber } from "./coffees";

describe("getCoffeeByPassportNumber", () => {
  it("finds a valid current passport", () => {
    const coffee = getCoffeeByPassportNumber("IPC-000001");
    expect(coffee).toBeDefined();
    expect(coffee?.coffeeName).toBe("Boquete SHB Arabica Washed");
  });

  it("finds a valid legacy passport", () => {
    const coffee = getCoffeeByPassportNumber("IPC-ALT-001");
    expect(coffee).toBeDefined();
    expect(coffee?.legacyPassport).toBe(true);
    expect(coffee?.coffeeName).toBe("Altura");
  });

  it("is case-insensitive", () => {
    const coffee = getCoffeeByPassportNumber("ipc-000001");
    expect(coffee?.passportNumber).toBe("IPC-000001");
  });

  it("normalizes surrounding whitespace", () => {
    const coffee = getCoffeeByPassportNumber("  IPC-000001  ");
    expect(coffee?.passportNumber).toBe("IPC-000001");
  });

  it("returns undefined for a malformed value", () => {
    expect(getCoffeeByPassportNumber("not-a-passport!!!")).toBeUndefined();
    expect(getCoffeeByPassportNumber("")).toBeUndefined();
    expect(getCoffeeByPassportNumber("   ")).toBeUndefined();
  });

  it("returns undefined for a well-formed but unknown value", () => {
    expect(getCoffeeByPassportNumber("IPC-999999")).toBeUndefined();
  });

  it("never matches on the internal uuid — only the public passport number", () => {
    const coffee = getCoffeeByPassportNumber("IPC-000001");
    expect(coffee).toBeDefined();
    expect(getCoffeeByPassportNumber(coffee!.id)).toBeUndefined();
  });
});
