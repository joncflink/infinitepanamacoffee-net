import { NextResponse } from "next/server";
import { validateWaitlist } from "@/lib/waitlist/validate";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
  // Honeypot: bots fill hidden "company" field.
  if (body && typeof body === "object" && (body as Record<string, unknown>).company) {
    return NextResponse.json({ ok: true });
  }
  const parsed = validateWaitlist(body);
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });

  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_HARVEST_GROUP_ID;
  if (!apiKey || !groupId) {
    console.error("Waitlist: MAILERLITE_API_KEY or MAILERLITE_HARVEST_GROUP_ID not configured");
    return NextResponse.json(
      { ok: false, error: "The waitlist isn't open just yet. Please check back soon." },
      { status: 503 },
    );
  }

  const { email, firstName, roastMethod, monthlyLbs, bagSizes, heardFrom, source, subscriptionInterest } = parsed.data;
  const fields: Record<string, string> = { name: firstName };
  if (roastMethod) fields.ipc_roast_method = roastMethod;
  if (monthlyLbs) fields.ipc_monthly_lbs = monthlyLbs;
  if (bagSizes) fields.ipc_bag_sizes = bagSizes.join(", ");
  if (heardFrom) fields.ipc_heard_from = heardFrom;
  if (source) fields.ipc_source = source;
  if (subscriptionInterest) fields.ipc_subscription_interest = "yes";

  try {
    const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, fields, groups: [groupId] }),
    });
    if (!res.ok) {
      console.error("Waitlist: MailerLite error", res.status);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 502 },
    );
  }
  return NextResponse.json({ ok: true });
}
