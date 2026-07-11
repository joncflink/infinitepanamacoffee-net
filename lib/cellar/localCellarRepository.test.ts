import { describe, it, expect, beforeEach } from "vitest";
import { localCellarRepository } from "./localCellarRepository";

const STORAGE_KEY = "infinite-cellar:v1";

describe("localCellarRepository", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts empty", () => {
    expect(localCellarRepository.list()).toEqual([]);
  });

  it("adds an item", () => {
    localCellarRepository.add("IPC-000001");
    const items = localCellarRepository.list();
    expect(items).toHaveLength(1);
    expect(items[0].passportNumber).toBe("IPC-000001");
    expect(typeof items[0].addedAt).toBe("string");
  });

  it("prevents duplicates — adding the same passport twice yields one entry", () => {
    localCellarRepository.add("IPC-000001");
    localCellarRepository.add("IPC-000001");
    expect(localCellarRepository.list()).toHaveLength(1);
  });

  it("removes an item", () => {
    localCellarRepository.add("IPC-000001");
    localCellarRepository.remove("IPC-000001");
    expect(localCellarRepository.list()).toEqual([]);
  });

  it("removing an item not present is a safe no-op", () => {
    expect(() => localCellarRepository.remove("IPC-000001")).not.toThrow();
    expect(localCellarRepository.list()).toEqual([]);
  });

  it("persists to localStorage itself, not just an in-memory cache", () => {
    localCellarRepository.add("IPC-000001");
    // Read the raw persisted value directly — this is what would still be
    // there after an actual page reload, independent of the module's
    // in-memory read cache.
    const raw = localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].passportNumber).toBe("IPC-000001");
  });

  it("drops malformed entries instead of crashing on read", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([{ garbage: true }, { passportNumber: "IPC-000001", addedAt: "2026-01-01" }]));
    const items = localCellarRepository.list();
    expect(items).toEqual([{ passportNumber: "IPC-000001", addedAt: "2026-01-01" }]);
  });
});
