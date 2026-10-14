export const ROAST_METHODS = [
  "Popcorn popper",
  "Air roaster",
  "Drum roaster (home)",
  "Stovetop / pan",
  "Oven",
  "Not roasting yet",
  "Other",
] as const;

export const MONTHLY_LBS = [
  "Under 1 lb",
  "1-2 lb",
  "3-5 lb",
  "More than 5 lb",
] as const;

export const BAG_SIZES = ["8 oz", "1 lb", "2 lb or more"] as const;

export type WaitlistInput = {
  email: string;
  firstName: string;
  roastMethod?: string;
  monthlyLbs?: string;
  bagSizes?: string[];
  subscriptionInterest?: boolean;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateWaitlist(
  body: unknown,
): { ok: true; data: WaitlistInput } | { ok: false; error: string } {
  if (!body || typeof body !== "object") return { ok: false, error: "Invalid request." };
  const b = body as Record<string, unknown>;
  const email = typeof b.email === "string" ? b.email.trim().toLowerCase() : "";
  const firstName = typeof b.firstName === "string" ? b.firstName.trim() : "";
  if (!EMAIL_RE.test(email) || email.length > 254)
    return { ok: false, error: "Please enter a valid email address." };
  if (!firstName || firstName.length > 80)
    return { ok: false, error: "Please enter your first name." };
  const roastMethod =
    typeof b.roastMethod === "string" &&
    (ROAST_METHODS as readonly string[]).includes(b.roastMethod)
      ? b.roastMethod
      : undefined;
  const monthlyLbs =
    typeof b.monthlyLbs === "string" &&
    (MONTHLY_LBS as readonly string[]).includes(b.monthlyLbs)
      ? b.monthlyLbs
      : undefined;
  const bagSizes = Array.isArray(b.bagSizes)
    ? (BAG_SIZES as readonly string[]).filter((sz) => (b.bagSizes as unknown[]).includes(sz))
    : [];
  return {
    ok: true,
    data: {
      email,
      firstName,
      roastMethod,
      monthlyLbs,
      bagSizes: bagSizes.length ? bagSizes : undefined,
      subscriptionInterest: b.subscriptionInterest === true,
    },
  };
}
