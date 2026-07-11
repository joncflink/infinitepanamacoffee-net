import { describe, it, expect, vi } from "vitest";

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => {
    throw new Error("Supabase not configured in tests");
  },
}));

import { logProductEvent, logReorderEvent, detectDeviceType } from "./track";

describe("analytics: failures never break the action they're attached to", () => {
  it("logProductEvent does not throw even when the Supabase client is unavailable", () => {
    expect(() => logProductEvent({ event: "cellar_viewed" })).not.toThrow();
  });

  it("logReorderEvent does not throw even when the Supabase client is unavailable", () => {
    expect(() =>
      logReorderEvent({
        lotId: "IPC-000001",
        passportNumber: "IPC-000001",
        action: "reorder_clicked",
        destinationUrl: "https://example.com",
      })
    ).not.toThrow();
  });

  it("logs the failure instead of swallowing it silently", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    logProductEvent({ event: "cellar_viewed" });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

describe("detectDeviceType", () => {
  it("detects mobile", () => {
    expect(detectDeviceType("Mozilla/5.0 (Linux; Android 10; SM-G960U)")).toBe("mobile");
  });

  it("detects tablet", () => {
    expect(detectDeviceType("Mozilla/5.0 (iPad; CPU OS 15_0 like Mac OS X)")).toBe("tablet");
  });

  it("defaults to desktop", () => {
    expect(detectDeviceType("Mozilla/5.0 (Windows NT 10.0; Win64; x64)")).toBe("desktop");
  });
});
