import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CellarView from "./CellarView";

const mockUseCellar = vi.fn();

vi.mock("@/components/CellarProvider", () => ({
  useCellar: () => mockUseCellar(),
}));

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

vi.mock("@/lib/supabase/track", () => ({
  logProductEvent: vi.fn(),
  logReorderEvent: vi.fn(),
}));

const SAVED_COFFEE = {
  passportNumber: "IPC-000001",
  coffeeName: "Boquete SHB Arabica Washed",
  collection: "Infinite Select™",
  status: "reserve_collection" as const,
  addedAt: "2026-07-11T00:00:00.000Z",
  sizeOptions: [],
};

describe("CellarView", () => {
  beforeEach(() => {
    mockUseCellar.mockReset();
  });

  it("shows the empty state when there are no saved items", () => {
    mockUseCellar.mockReturnValue({ items: [], remove: vi.fn() });
    render(<CellarView />);
    expect(
      screen.getByText("Your Infinite Cellar™ is ready.")
    ).toBeInTheDocument();
  });

  it("renders a saved coffee with a correct link to its Passport page", () => {
    mockUseCellar.mockReturnValue({ items: [SAVED_COFFEE], remove: vi.fn() });
    render(<CellarView />);
    expect(screen.getByText("Boquete SHB Arabica Washed")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "View Passport" })).toHaveAttribute(
      "href",
      "/passport/IPC-000001"
    );
  });

  it("calls remove with the passport number and source when Remove is clicked", () => {
    const remove = vi.fn();
    mockUseCellar.mockReturnValue({ items: [SAVED_COFFEE], remove });
    render(<CellarView />);
    fireEvent.click(screen.getByRole("button", { name: "Remove from Cellar" }));
    expect(remove).toHaveBeenCalledWith("IPC-000001", "cellar_page");
  });

  it("empty-state CTAs never point at the homepage", () => {
    mockUseCellar.mockReturnValue({ items: [], remove: vi.fn() });
    render(<CellarView />);
    for (const link of screen.getAllByRole("link")) {
      expect(link.getAttribute("href")).not.toBe("/");
    }
  });
});
