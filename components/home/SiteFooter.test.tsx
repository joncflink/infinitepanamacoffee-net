import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import SiteFooter from "./SiteFooter";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("SiteFooter navigation", () => {
  it("links My Infinite Cellar™ to /cellar", () => {
    render(<SiteFooter />);
    expect(
      screen.getByRole("link", { name: "My Infinite Cellar™" })
    ).toHaveAttribute("href", "/cellar");
  });

  it("links Coffee Passport™ to /passport", () => {
    render(<SiteFooter />);
    expect(
      screen.getByRole("link", { name: "Coffee Passport™" })
    ).toHaveAttribute("href", "/passport");
  });

  it("does not route either nav item to the homepage", () => {
    render(<SiteFooter />);
    const cellarLink = screen.getByRole("link", { name: "My Infinite Cellar™" });
    const passportLink = screen.getByRole("link", { name: "Coffee Passport™" });
    expect(cellarLink.getAttribute("href")).not.toBe("/");
    expect(passportLink.getAttribute("href")).not.toBe("/");
  });
});
