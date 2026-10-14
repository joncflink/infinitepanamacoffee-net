import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SiteFooter from "./SiteFooter";
import { isInternalPath, PRIMARY_NAV } from "@/components/site/nav";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

describe("SiteFooter navigation", () => {
  it("links Coffee Passport™ to /passport", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "Coffee Passport™" })).toHaveAttribute("href", "/passport");
  });

  it("has a waitlist link to /harvest", () => {
    render(<SiteFooter />);
    expect(screen.getByRole("link", { name: "Harvest Waitlist" })).toHaveAttribute("href", "/harvest");
  });

  it("does not expose internal pages", () => {
    const { container } = render(<SiteFooter />);
    const hrefs = Array.from(container.querySelectorAll("a")).map((a) => a.getAttribute("href") ?? "");
    for (const h of hrefs) expect(isInternalPath(h)).toBe(false);
    expect(hrefs).not.toContain("/cellar");
  });
});

describe("primary nav", () => {
  it("has at most 5 items and no internal pages", () => {
    expect(PRIMARY_NAV.length).toBeLessThanOrEqual(5);
    for (const i of PRIMARY_NAV) expect(isInternalPath(i.href)).toBe(false);
  });

  it("flags internal routes", () => {
    expect(isInternalPath("/labels/IPC-1/front")).toBe(true);
    expect(isInternalPath("/inventory")).toBe(true);
    expect(isInternalPath("/harvest")).toBe(false);
  });
});
